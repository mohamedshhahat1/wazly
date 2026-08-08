import { useEffect, useState } from 'react';
import { Sparkles, User, ArrowDown } from 'lucide-react';
import { useReveal, usePrefersReducedMotion } from '@/lib/hooks';
import { useLang } from '@/lib/i18n';
import { handoffScript } from '@/lib/mockData';
import { Badge } from '@/components/ui';

type ScriptLine = {
  type: string;
  text?: string;
  textEn?: string;
  status?: string;
  statusEn?: string;
  operator?: string;
  operatorEn?: string;
};

const lines = handoffScript as unknown as ScriptLine[];

export function HandoffAnimation() {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(-1);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setStep(lines.length - 1);
      return;
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let cumulative = 600;

    setStep(-1);

    for (let i = 0; i < lines.length; i++) {
      const idx = i;
      const s = lines[i];
      timeouts.push(setTimeout(() => setStep(idx), cumulative));

      if (s.type === 'customer') cumulative += 1800;
      else if (s.type === 'ai') cumulative += 2000;
      else if (s.type === 'status') cumulative += 1400;
      else if (s.type === 'operator') cumulative += 2500;
    }

    timeouts.push(
      setTimeout(() => {
        setStep(-1);
        setCycle(c => c + 1);
      }, cumulative + 2000),
    );

    return () => timeouts.forEach(clearTimeout);
  }, [visible, cycle, reduced]);

  // Derived from which line types have played. The previous version compared
  // against English status strings that no longer exist in the data.
  const statusBadge = (s: number) => {
    if (s < 0) return null;
    let hasAi = false;
    let hasHandoff = false;
    let hasOperator = false;
    for (let i = 0; i <= s; i++) {
      const t = lines[i].type;
      if (t === 'ai') hasAi = true;
      if (t === 'status') hasHandoff = true;
      if (t === 'operator') hasOperator = true;
    }
    if (hasOperator) return <Badge variant="success">{pick('موظف بيتابع', 'Human handling')}</Badge>;
    if (hasHandoff) return <Badge variant="human">{pick('تحويل لموظف', 'Handoff')}</Badge>;
    if (hasAi) return <Badge variant="ai">{pick('الـ AI بيتعامل', 'AI handling')}</Badge>;
    return null;
  };

  return (
    <div ref={ref} className="w-full max-w-md mx-auto">
      <div className="bg-app border border-app rounded-2xl shadow-medium overflow-hidden">
        <div className="px-4 py-3 border-b border-app bg-subtle flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-main">{pick('المحادثة', 'Conversation')}</span>
          <div className="min-h-[20px] transition-all duration-300">{statusBadge(step)}</div>
        </div>

        <div className="h-[380px] overflow-y-auto px-4 py-4 space-y-3 bg-subtle">
          {lines.map((s, i) => {
            if (s.type === 'status') {
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-1 py-2 transition-all duration-500 ${
                    step >= i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-accent-50 dark:bg-accent-950/30 flex items-center justify-center border border-accent-200 dark:border-accent-900/50">
                    <ArrowDown className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                  </div>
                  <Badge variant="human" size="xs">
                    {pick(s.status ?? '', s.statusEn ?? s.status ?? '')}
                  </Badge>
                </div>
              );
            }

            const isCustomer = s.type === 'customer';
            const isOperator = s.type === 'operator';
            const isAi = s.type === 'ai';

            return (
              <div
                key={i}
                className={`flex ${isCustomer ? 'justify-end' : 'justify-start'} transition-all duration-500 ${
                  step >= i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
              >
                <div className="max-w-[80%]">
                  {(isAi || isOperator) && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isAi ? 'bg-brand-600 dark:bg-brand-500' : 'bg-accent-600'
                        }`}
                      >
                        {isAi ? <Sparkles className="w-3 h-3 text-white" /> : <User className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-[10px] font-medium text-muted">
                        {isAi ? 'Wazly AI' : pick(s.operator ?? '', s.operatorEn ?? s.operator ?? '')}
                      </span>
                    </div>
                  )}
                  <div
                    dir="auto"
                    className={`px-3.5 py-2.5 text-sm leading-[1.75] ${
                      isCustomer
                        ? 'bg-brand-600 text-white rounded-2xl rounded-se-md'
                        : isAi
                        ? 'bg-app border border-app text-main rounded-2xl rounded-ss-md'
                        : 'bg-accent-600 text-white rounded-2xl rounded-ss-md'
                    }`}
                  >
                    {pick(s.text ?? '', s.textEn ?? s.text ?? '')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
