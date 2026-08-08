import { useEffect, useState, useRef } from 'react';
import { Sparkles, BookOpen, ArrowRight, CheckCheck } from 'lucide-react';
import { useTypewriter, usePrefersReducedMotion } from '@/lib/hooks';
import { heroScript, heroHandoffScript } from '@/lib/mockData';
import { useLang } from '@/lib/i18n';
import { ChannelBadge } from '@/components/ui';

/**
 * The demo runs the whole product story, not just the AI part: a customer asks,
 * the AI answers from company knowledge, the customer asks for a person, the
 * conversation is handed over, and the day's counter ticks up.
 */
const script = [heroScript[0], heroScript[1], heroScript[2], ...heroHandoffScript];

type Item =
  | {
      kind: 'msg';
      id: number;
      from: 'customer' | 'ai' | 'operator';
      text: string;
      source?: string;
      operator?: string;
      time: string;
      full: boolean;
    }
  | { kind: 'event'; id: number; label: string };

const times = ['٨:٤٢', '٨:٤٣', '٨:٤٤', '٨:٤٥', '٨:٤٦'];

export function HeroConversation() {
  const reduced = usePrefersReducedMotion();
  const { pick } = useLang();
  const [items, setItems] = useState<Item[]>([]);
  const [typing, setTyping] = useState(false);
  const [currentAiText, setCurrentAiText] = useState('');
  const [count, setCount] = useState(47);
  const [bumped, setBumped] = useState(false);
  const [cycle, setCycle] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion by showing the resolved conversation immediately.
    if (reduced) {
      const final: Item[] = [];
      let id = 0;
      script.forEach(step => {
        if (step.type === 'customer') final.push({ kind: 'msg', id: id++, from: 'customer', text: step.text, time: times[0], full: true });
        if (step.type === 'ai') final.push({ kind: 'msg', id: id++, from: 'ai', text: step.text, source: 'source' in step ? step.source : undefined, time: times[0], full: true });
        if (step.type === 'status') final.push({ kind: 'event', id: id++, label: step.status });
        if (step.type === 'operator') final.push({ kind: 'msg', id: id++, from: 'operator', text: step.text, operator: step.operator, time: times[0], full: true });
      });
      setItems(final);
      setCount(48);
      return;
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let at = 700;
    let id = 0;
    let slot = 0;

    setItems([]);
    setCurrentAiText('');
    setTyping(false);
    setCount(47);
    setBumped(false);

    for (const step of script) {
      if (step.type === 'customer') {
        const text = step.text;
        const time = times[Math.min(slot++, times.length - 1)];
        const mid = id++;
        timeouts.push(setTimeout(() => {
          setItems(prev => [...prev, { kind: 'msg', id: mid, from: 'customer', text, time, full: true }]);
        }, at));
        at += 1100;
      } else if (step.type === 'processing') {
        // A plain typing indicator reads as a real product; a checklist of
        // "Thinking / Searching / Generating" reads as a pitch.
        timeouts.push(setTimeout(() => setTyping(true), at));
        at += 1500;
        timeouts.push(setTimeout(() => setTyping(false), at));
        at += 150;
      } else if (step.type === 'ai') {
        const text = step.text;
        const source = 'source' in step ? step.source : undefined;
        const time = times[Math.min(slot++, times.length - 1)];
        const mid = id++;

        timeouts.push(setTimeout(() => {
          setItems(prev => [...prev, { kind: 'msg', id: mid, from: 'ai', text: '', source, time, full: false }]);
          setCurrentAiText(text);
        }, at));
        at += text.length * 22 + 500;

        timeouts.push(setTimeout(() => {
          setItems(prev => prev.map(m => (m.kind === 'msg' && m.id === mid ? { ...m, text, full: true } : m)));
        }, at));
        at += 700;
      } else if (step.type === 'status') {
        const label = step.status;
        const eid = id++;
        timeouts.push(setTimeout(() => {
          setItems(prev => [...prev, { kind: 'event', id: eid, label }]);
        }, at));
        at += 900;
      } else if (step.type === 'operator') {
        const text = step.text;
        const operator = step.operator;
        const time = times[Math.min(slot++, times.length - 1)];
        const mid = id++;
        timeouts.push(setTimeout(() => setTyping(true), at));
        at += 1200;
        timeouts.push(setTimeout(() => {
          setTyping(false);
          setItems(prev => [...prev, { kind: 'msg', id: mid, from: 'operator', text, operator, time, full: true }]);
        }, at));
        at += 1000;
      }
    }

    // The analytics claim, demonstrated rather than asserted.
    timeouts.push(setTimeout(() => {
      setCount(48);
      setBumped(true);
    }, at));
    at += 400;

    timeouts.push(setTimeout(() => setCycle(c => c + 1), at + 3200));

    return () => timeouts.forEach(clearTimeout);
  }, [cycle, reduced]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
    }
  }, [items, typing, currentAiText, reduced]);

  const latestAi = items.find((m): m is Extract<Item, { kind: 'msg' }> => m.kind === 'msg' && m.from === 'ai' && !m.full);
  const typed = useTypewriter(latestAi ? currentAiText : '', !!latestAi, 22);

  useEffect(() => {
    if (latestAi && typed) {
      setItems(prev => prev.map(m => (m.kind === 'msg' && m.id === latestAi.id ? { ...m, text: typed } : m)));
    }
  }, [typed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-app border border-app rounded-2xl shadow-large overflow-hidden">
        {/* Conversation header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-app bg-subtle">
          <ChannelBadge channel="whatsapp" size="md" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-main truncate">أحمد محمد</div>
            <div className="text-xs text-subtle flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {pick('متصل الآن', 'Online')}
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-brand-bg">
            <Sparkles className="w-3 h-3 text-brand" />
            <span className="text-[10px] font-medium text-brand">{pick('الـ AI شغّال', 'AI active')}</span>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="h-[420px] overflow-y-auto px-4 py-4 space-y-3 bg-subtle">
          {items.map(item => {
            if (item.kind === 'event') {
              return (
                <div key={item.id} className="flex justify-center animate-fade-in">
                  <span className="text-[11px] text-muted bg-app border border-app rounded-full px-3 py-1">
                    {item.label}
                  </span>
                </div>
              );
            }

            const outgoing = item.from === 'customer';

            return (
              <div key={item.id} className={`flex ${outgoing ? 'justify-end' : 'justify-start'} animate-message-in`}>
                <div className="max-w-[82%]">
                  {item.from === 'ai' && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-5 h-5 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[10px] font-medium text-muted">Wazly AI</span>
                    </div>
                  )}
                  {item.from === 'operator' && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-5 h-5 rounded-full bg-accent-600 flex items-center justify-center text-[9px] font-bold text-white">
                        م
                      </div>
                      <span className="text-[10px] font-medium text-muted">
                        {item.operator} · {pick('المبيعات', 'Sales')}
                      </span>
                    </div>
                  )}

                  <div
                    className={`px-3.5 py-2.5 text-sm leading-[1.75] whitespace-pre-line ${
                      outgoing
                        ? 'bg-brand-600 text-white rounded-2xl rounded-se-md'
                        : 'bg-app border border-app text-main rounded-2xl rounded-ss-md'
                    }`}
                  >
                    {item.text}
                    {!item.full && (
                      <span className="inline-block w-0.5 h-4 ms-0.5 bg-brand animate-blink align-middle" />
                    )}
                  </div>

                  <div className={`flex items-center gap-1 mt-1 ${outgoing ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-subtle num">{item.time}</span>
                    {outgoing && <CheckCheck className="w-3 h-3 text-brand" />}
                  </div>

                  {item.from === 'ai' && item.full && item.source && (
                    <div className="mt-1 flex items-center gap-1.5 animate-fade-in">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-bg">
                        <BookOpen className="w-3 h-3 text-brand" />
                        <span className="text-[10px] text-brand font-medium">{item.source}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {typing && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-app border border-app rounded-2xl rounded-ss-md px-4 py-3 flex items-center gap-1 text-muted">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
        </div>

        {/* Live counter — shows the analytics claim rather than stating it */}
        <div className="px-4 py-2.5 border-t border-app bg-app flex items-center justify-between">
          <span className="text-[11px] text-muted">{pick('محادثات النهارده', 'Conversations today')}</span>
          <span className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-main num">{count}</span>
            {bumped && <span className="text-[10px] font-medium text-brand animate-fade-in">+1</span>}
          </span>
        </div>

        {/* Composer */}
        <div className="px-4 py-3 border-t border-app bg-app flex items-center gap-2">
          <div className="flex-1 h-9 rounded-full bg-muted flex items-center px-4">
            <span className="text-xs text-subtle">{pick('اكتب رسالة…', 'Type a message…')}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center shrink-0">
            <ArrowRight className="w-4 h-4 text-white flip-rtl" />
          </div>
        </div>
      </div>
    </div>
  );
}
