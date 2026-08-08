import { useEffect, useState, useRef } from 'react';
import { Sparkles, BookOpen, Search, Check, ArrowRight } from 'lucide-react';
import { useTypewriter, useLoopingTimeline, usePrefersReducedMotion } from '@/lib/hooks';
import { heroScript } from '@/lib/mockData';
import { ChannelBadge, Badge } from '@/components/ui';

type RenderedMessage = {
  id: number;
  type: 'customer' | 'ai';
  text: string;
  arabic?: boolean;
  source?: string;
  full: boolean;
};

const processingSteps = ['Thinking', 'Searching knowledge', 'Found relevant information', 'Generating response'];
const processingIcons = [Sparkles, Search, BookOpen, Check];

export function HeroConversation() {
  const reduced = usePrefersReducedMotion();
  const [messages, setMessages] = useState<RenderedMessage[]>([]);
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(-1);
  const [currentAiText, setCurrentAiText] = useState('');
  const [showSource, setShowSource] = useState(false);
  const [cycle, setCycle] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) {
      // Show final state immediately
      const final: RenderedMessage[] = [];
      heroScript.forEach((s, i) => {
        if (s.type === 'customer') final.push({ id: i, type: 'customer', text: s.text, arabic: s.arabic, full: true });
        if (s.type === 'ai') final.push({ id: i, type: 'ai', text: s.text, arabic: s.arabic, source: s.source, full: true });
      });
      setMessages(final);
      return;
    }

    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let cumulative = 800;
    const localMsgs: RenderedMessage[] = [];

    setMessages([]);
    setShowSource(false);
    setCurrentAiText('');

    let msgId = 0;

    for (const step of heroScript) {
      if (step.type === 'customer') {
        const id = msgId++;
        const custText = step.text;
        const custArabic = step.arabic;
        timeouts.push(setTimeout(() => {
          setMessages(prev => [...prev, { id, type: 'customer', text: custText, arabic: custArabic, full: true }]);
        }, cumulative));
        cumulative += 1000;
      } else if (step.type === 'processing') {
        timeouts.push(setTimeout(() => setShowProcessing(true), cumulative));
        cumulative += 400;
        for (let i = 0; i < processingSteps.length; i++) {
          const pi = i;
          timeouts.push(setTimeout(() => setProcessingStep(pi), cumulative));
          cumulative += 500;
        }
        timeouts.push(setTimeout(() => {
          setShowProcessing(false);
          setProcessingStep(-1);
        }, cumulative));
        cumulative += 200;
      } else if (step.type === 'ai') {
        const id = msgId++;
        const aiText = step.text;
        const aiArabic = step.arabic;
        const aiSource = step.source;

        // Add empty AI message
        timeouts.push(setTimeout(() => {
          setMessages(prev => [...prev, { id, type: 'ai', text: '', arabic: aiArabic, source: aiSource, full: false }]);
          setCurrentAiText(aiText);
        }, cumulative));
        cumulative += aiText.length * 25 + 600;

        // Mark as done
        timeouts.push(setTimeout(() => {
          setMessages(prev => prev.map(m => m.id === id ? { ...m, text: aiText, full: true } : m));
          setShowSource(true);
        }, cumulative));
        cumulative += 800;
      }
    }

    // Loop
    timeouts.push(setTimeout(() => {
      setCycle(c => c + 1);
    }, cumulative + 2500));

    return () => timeouts.forEach(clearTimeout);
  }, [cycle, reduced]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
    }
  }, [messages, showProcessing, currentAiText]);

  // Typewriter for the latest AI message
  const latestAi = messages.find(m => m.type === 'ai' && !m.full);
  const typed = useTypewriter(latestAi ? currentAiText : '', !!latestAi, 25);

  useEffect(() => {
    if (latestAi && typed) {
      setMessages(prev => prev.map(m => m.id === latestAi.id ? { ...m, text: typed } : m));
    }
  }, [typed]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-app border border-app rounded-2xl shadow-xl overflow-hidden">
        {/* Phone header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-app bg-subtle">
          <ChannelBadge channel="whatsapp" size="md" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-main truncate">Wazly Demo</div>
            <div className="text-xs text-subtle flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Online
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            <span className="text-xs font-medium text-brand">AI Active</span>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="h-[420px] overflow-y-auto px-4 py-4 space-y-3 bg-subtle">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'customer' ? 'justify-end' : 'justify-start'} animate-slide-in-right`}>
              <div className={`max-w-[80%] ${msg.type === 'customer' ? 'items-end' : 'items-start'}`}>
                {msg.type === 'ai' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[10px] font-medium text-muted">Wazly AI</span>
                  </div>
                )}
                <div
                  className={`px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.type === 'customer'
                      ? 'bg-brand-600 text-white rounded-2xl rounded-tr-md'
                      : 'bg-app border border-app text-main rounded-2xl rounded-tl-md'
                  } ${msg.arabic ? 'font-arabic' : ''}`}
                  dir={msg.arabic ? 'rtl' : 'ltr'}
                >
                  {msg.text}
                  {msg.type === 'ai' && !msg.full && (
                    <span className="inline-block w-0.5 h-4 ml-0.5 bg-brand animate-blink align-middle" />
                  )}
                </div>
                {msg.type === 'ai' && msg.full && msg.source && (
                  <div className="mt-1.5 flex items-center gap-1.5 animate-fade-in">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-bg border border-brand-200/20">
                      <BookOpen className="w-3 h-3 text-brand" />
                      <span className="text-[10px] text-brand font-medium">{msg.source}</span>
                      <span className="w-1 h-1 rounded-full bg-brand animate-pulse-dot" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Processing indicator */}
          {showProcessing && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-app border border-app rounded-2xl rounded-tl-md px-4 py-3 space-y-2 max-w-[80%]">
                {processingSteps.map((step, i) => {
                  const Icon = processingIcons[i];
                  const active = i <= processingStep;
                  const current = i === processingStep;
                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-2 text-xs transition-all duration-300 ${
                        active ? 'text-main opacity-100' : 'text-subtle opacity-40'
                      }`}
                      style={{ transform: current ? 'translateX(0)' : 'translateX(0)' }}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        active ? 'bg-brand-600 dark:bg-brand-500' : 'bg-muted'
                      }`}>
                        <Icon className={`w-3 h-3 ${active ? 'text-white' : 'text-subtle'}`} />
                      </div>
                      <span className={current ? 'font-medium' : ''}>{step}</span>
                      {current && (
                        <span className="flex gap-0.5 ml-1">
                          <span className="typing-dot" style={{ width: 4, height: 4 }} />
                          <span className="typing-dot" style={{ width: 4, height: 4 }} />
                          <span className="typing-dot" style={{ width: 4, height: 4 }} />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="px-4 py-3 border-t border-app bg-app flex items-center gap-2">
          <div className="flex-1 h-9 rounded-full bg-muted flex items-center px-4">
            <span className="text-xs text-subtle">Type a message…</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
