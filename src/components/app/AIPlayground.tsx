import { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Search, Check, BookOpen } from 'lucide-react';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { useLang } from '@/lib/i18n';
import { playgroundExamples } from '@/lib/mockData';
import { Card, Button } from '@/components/ui';

type Stage = 'idle' | 'searching' | 'found' | 'answering' | 'done';

type Example = {
  question: string;
  questionEn?: string;
  answer: string;
  answerEn?: string;
  source?: string;
  sourceEn?: string;
  confidence?: number;
};

const examples = playgroundExamples as unknown as Example[];

interface PlaygroundMessage {
  id: number;
  role: 'user' | 'ai';
  text: string;
  fullText: string;
  source?: string;
  confidence?: number;
}

export function AIPlayground() {
  const { pick } = useLang();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [stage, setStage] = useState<Stage>('idle');
  const [searchProgress, setSearchProgress] = useState(0);
  const [streamingId, setStreamingId] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const qOf = (ex: Example) => pick(ex.question, ex.questionEn ?? ex.question);
  const aOf = (ex: Example) => pick(ex.answer, ex.answerEn ?? ex.answer);
  const sOf = (ex: Example) => pick(ex.source ?? '', ex.sourceEn ?? ex.source ?? '');

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const busy = stage !== 'idle' && stage !== 'done';

  const handleSend = (text: string, ex?: Example) => {
    if (busy) return;
    const example = ex ?? examples.find(e => qOf(e) === text) ?? examples[0];
    const answer = aOf(example);

    setMessages(prev => [...prev, { id: msgId.current++, role: 'user', text, fullText: text }]);
    setInput('');
    setStage('searching');
    setSearchProgress(0);

    const aiId = msgId.current++;
    const aiMessage: PlaygroundMessage = {
      id: aiId,
      role: 'ai',
      text: '',
      fullText: answer,
      source: sOf(example),
      confidence: example.confidence,
    };

    if (reduced) {
      setStage('found');
      timers.current.push(
        setTimeout(() => {
          setMessages(prev => [...prev, { ...aiMessage, text: answer }]);
          setStage('done');
        }, 100),
      );
      return;
    }

    const searchDuration = 1500;
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      timers.current.push(
        setTimeout(() => setSearchProgress(Math.round((i / steps) * 100)), (i / steps) * searchDuration),
      );
    }

    timers.current.push(setTimeout(() => setStage('found'), searchDuration));
    timers.current.push(
      setTimeout(() => {
        setStage('answering');
        setMessages(prev => [...prev, aiMessage]);
        setStreamingId(aiId);
        setStage('done');
      }, searchDuration + 600),
    );
  };

  // Stream the active AI answer one character at a time.
  useEffect(() => {
    if (streamingId === null) return;
    const msg = messages.find(m => m.id === streamingId);
    if (!msg) {
      setStreamingId(null);
      return;
    }
    if (msg.text.length >= msg.fullText.length) {
      setStreamingId(null);
      return;
    }
    const timer = setTimeout(() => {
      setMessages(prev =>
        prev.map(m => (m.id === streamingId ? { ...m, text: m.fullText.slice(0, m.text.length + 1) } : m)),
      );
    }, 18);
    return () => clearTimeout(timer);
  }, [streamingId, messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, stage]);

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 max-w-3xl mx-auto w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-main mb-1">{pick('جرّب الـ AI', 'AI playground')}</h2>
        <p className="text-sm text-muted">
          {pick(
            'جرّب الـ AI بيرد إزاي على أسئلة عملائك. اختار سؤال من دول أو اكتب سؤالك.',
            'Test how your AI answers customer questions. Try an example or type your own.',
          )}
        </p>
      </div>

      {/* Examples */}
      <div className="flex flex-wrap gap-2 mb-4">
        {examples.map(ex => (
          <button
            key={ex.question}
            onClick={() => handleSend(qOf(ex), ex)}
            disabled={busy}
            dir="auto"
            className="text-xs px-3 py-1.5 rounded-lg border border-app text-muted hover:text-main hover:border-strong hover:bg-subtle transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-start"
          >
            {qOf(ex)}
          </button>
        ))}
      </div>

      {/* Conversation */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-subtle min-h-[300px]">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-brand-bg flex items-center justify-center mb-3">
                <Sparkles className="w-7 h-7 text-brand" />
              </div>
              <div className="text-sm font-medium text-main mb-1">{pick('اسأل الـ AI أي حاجة', 'Ask your AI anything')}</div>
              <div className="text-xs text-muted">
                {pick('هيدور في معرفة الشركة ويرد عليك', 'It will search company knowledge and respond')}
              </div>
            </div>
          )}

          {messages.map(msg => {
            const isUser = msg.role === 'user';
            const isStreaming = msg.id === streamingId;
            const complete = !isUser && msg.text.length > 0 && msg.text === msg.fullText;
            return (
              <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-message-in`}>
                <div className="max-w-[80%]">
                  {!isUser && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-5 h-5 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center shrink-0">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[10px] font-medium text-muted">Wazly AI</span>
                    </div>
                  )}
                  <div
                    dir="auto"
                    className={`px-3.5 py-2.5 text-sm leading-[1.75] whitespace-pre-line ${
                      isUser
                        ? 'bg-brand-600 text-white rounded-2xl rounded-se-md'
                        : 'bg-app border border-app text-main rounded-2xl rounded-ss-md'
                    }`}
                  >
                    {msg.text}
                    {isStreaming && <span className="inline-block w-0.5 h-4 ms-0.5 bg-brand animate-blink align-middle" />}
                  </div>
                  {complete && msg.source && (
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap animate-fade-in">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-bg border border-brand-200/20">
                        <BookOpen className="w-3 h-3 text-brand shrink-0" />
                        <span className="text-[10px] text-brand font-medium">
                          {pick('المصدر', 'Source')}: {msg.source}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted">
                        <span className="text-[10px] text-muted">
                          {pick('الثقة', 'Confidence')}:{' '}
                          <span className="text-main font-semibold num">{msg.confidence}%</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {stage === 'searching' && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-app border border-app rounded-2xl rounded-ss-md px-4 py-3 max-w-[80%]">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-3.5 h-3.5 text-brand" />
                  <span className="text-xs text-muted">{pick('بيدور في معرفة الشركة…', 'Searching company knowledge…')}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden w-48 max-w-full">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all duration-100"
                    style={{ width: `${searchProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {stage === 'found' && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-app border border-app rounded-2xl rounded-ss-md px-4 py-2.5 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-main font-medium">{pick('لقيت المعلومة', 'Relevant information found')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-app p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && input.trim()) handleSend(input.trim());
              }}
              placeholder={pick('اكتب سؤال زي ما العميل هيكتبه…', 'Type a customer question…')}
              dir="auto"
              className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-muted text-sm text-main placeholder:text-subtle outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
            />
            <Button size="md" onClick={() => input.trim() && handleSend(input.trim())} disabled={!input.trim() || busy}>
              <Send className="w-4 h-4 flip-rtl" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
