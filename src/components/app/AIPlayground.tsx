import { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Search, Check, BookOpen, Loader } from 'lucide-react';
import { useTypewriter, usePrefersReducedMotion } from '@/lib/hooks';
import { playgroundExamples } from '@/lib/mockData';
import { Badge, Card, Button } from '@/components/ui';

type Stage = 'idle' | 'searching' | 'found' | 'answering' | 'done';

interface PlaygroundMessage {
  id: number;
  role: 'user' | 'ai';
  text: string;
  arabic?: boolean;
  source?: string;
  confidence?: number;
}

export function AIPlayground() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [stage, setStage] = useState<Stage>('idle');
  const [searchProgress, setSearchProgress] = useState(0);
  const reduced = usePrefersReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(0);

  const examples = playgroundExamples;

  const handleSend = (text: string, arabic: boolean) => {
    if (stage !== 'idle' && stage !== 'done') return;

    const example = examples.find(e => e.question === text) || examples[0];

    // Add user message
    setMessages(prev => [...prev, { id: msgId.current++, role: 'user', text, arabic }]);
    setInput('');
    setStage('searching');
    setSearchProgress(0);

    // Searching animation
    if (reduced) {
      setStage('found');
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: msgId.current++, role: 'ai', text: example.answer, arabic: example.arabic,
          source: example.source, confidence: example.confidence,
        }]);
        setStage('done');
      }, 100);
      return;
    }

    // Animate search progress
    const searchDuration = 1500;
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      setTimeout(() => setSearchProgress(Math.round((i / steps) * 100)), (i / steps) * searchDuration);
    }

    setTimeout(() => setStage('found'), searchDuration);
    setTimeout(() => setStage('answering'), searchDuration + 600);

    // Stream answer
    const answerText = example.answer;
    const fullMsg: PlaygroundMessage = {
      id: msgId.current++, role: 'ai', text: '', arabic: example.arabic,
      source: example.source, confidence: example.confidence,
    };

    setTimeout(() => {
      setMessages(prev => [...prev, fullMsg]);
      setStage('done');
    }, searchDuration + 600);
  };

  // Typewriter for latest AI message
  const latestAi = messages.find(m => m.role === 'ai' && m.text === '' && stage === 'done');
  const example = examples.find(e => messages.some(m => m.role === 'user' && m.text === e.question)) || examples[0];
  const typed = useTypewriter(latestAi ? example.answer : '', !!latestAi, 22);

  useEffect(() => {
    if (latestAi && typed) {
      setMessages(prev => prev.map(m => m.id === latestAi.id ? { ...m, text: typed } : m));
    }
  }, [typed]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, stage]);

  return (
    <div className="h-full flex flex-col p-6 max-w-3xl mx-auto w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-main mb-1">AI Playground</h2>
        <p className="text-sm text-muted">Test how your AI responds to customer questions. Try one of the examples below.</p>
      </div>

      {/* Example chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {examples.map(ex => (
          <button
            key={ex.question}
            onClick={() => handleSend(ex.question, ex.arabic)}
            disabled={stage !== 'idle' && stage !== 'done'}
            className="text-xs px-3 py-1.5 rounded-lg border border-app text-muted hover:text-main hover:border-strong hover:bg-subtle transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            dir={ex.arabic ? 'rtl' : 'ltr'}
          >
            {ex.question}
          </button>
        ))}
      </div>

      {/* Conversation area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-subtle min-h-[300px]">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-brand-bg flex items-center justify-center mb-3">
                <Sparkles className="w-7 h-7 text-brand" />
              </div>
              <div className="text-sm font-medium text-main mb-1">Ask your AI anything</div>
              <div className="text-xs text-muted">Your AI will search company knowledge and respond</div>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-right`}>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[10px] font-medium text-muted">Wazly AI</span>
                  </div>
                )}
                <div
                  className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white rounded-2xl rounded-tr-md'
                      : 'bg-app border border-app text-main rounded-2xl rounded-tl-md'
                  } ${msg.arabic ? 'font-arabic' : ''}`}
                  dir={msg.arabic ? 'rtl' : 'ltr'}
                >
                  {msg.text}
                  {msg.role === 'ai' && msg.text !== '' && msg.text !== example.answer && (
                    <span className="inline-block w-0.5 h-4 ml-0.5 bg-brand animate-blink align-middle" />
                  )}
                </div>
                {msg.role === 'ai' && msg.source && msg.text === example.answer && (
                  <div className="mt-1.5 space-y-1 animate-fade-in">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-bg border border-brand-200/20">
                        <BookOpen className="w-3 h-3 text-brand" />
                        <span className="text-[10px] text-brand font-medium">Source: {msg.source}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted">
                        <span className="text-[10px] text-muted">Confidence: <span className="text-main font-semibold">{msg.confidence}%</span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Searching state */}
          {stage === 'searching' && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-app border border-app rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-3.5 h-3.5 text-brand animate-pulse" />
                  <span className="text-xs text-muted">Searching company knowledge…</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden w-48">
                  <div className="h-full rounded-full bg-brand-500 transition-all duration-100" style={{ width: `${searchProgress}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* Found state */}
          {stage === 'found' && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-app border border-app rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-main font-medium">Relevant information found</span>
                </div>
              </div>
            </div>
          )}

          {/* Answering state */}
          {stage === 'answering' && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="px-3 py-2 rounded-lg bg-muted">
                  <span className="flex gap-1">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </span>
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
                if (e.key === 'Enter' && input.trim()) handleSend(input.trim(), /[\u0600-\u06FF]/.test(input));
              }}
              placeholder="Type a customer question…"
              className="flex-1 px-3 py-2 rounded-lg bg-muted text-sm text-main placeholder:text-subtle outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
              dir={/[\u0600-\u06FF]/.test(input) ? 'rtl' : 'ltr'}
            />
            <Button
              size="md"
              onClick={() => input.trim() && handleSend(input.trim(), /[\u0600-\u06FF]/.test(input))}
              disabled={!input.trim() || (stage !== 'idle' && stage !== 'done')}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
