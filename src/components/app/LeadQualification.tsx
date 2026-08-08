import { useEffect, useState, useRef } from 'react';
import { Sparkles, TrendingUp, Target, CheckCircle2, User } from 'lucide-react';
import { useReveal, usePrefersReducedMotion, useCountUp } from '@/lib/hooks';
import { leadQualScript } from '@/lib/mockData';
import { Card, Badge, ProgressBar } from '@/components/ui';

export function LeadQualification() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(-1);
  const [cycle, setCycle] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setStep(leadQualScript.length - 1);
      setCurrentScore(91);
      return;
    }

    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let cumulative = 500;
    setStep(-1);
    setCurrentScore(0);
    scoreRef.current = 0;

    for (let i = 0; i < leadQualScript.length; i++) {
      const idx = i;
      const s = leadQualScript[i];

      timeouts.push(setTimeout(() => {
        setStep(idx);
        if (s.type === 'detect' || s.type === 'score') {
          const target = s.score;
          const start = scoreRef.current;
          const duration = 800;
          const startTime = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = Math.round(start + (target - start) * eased);
            setCurrentScore(val);
            if (progress < 1) requestAnimationFrame(animate);
            else { scoreRef.current = target; }
          };
          requestAnimationFrame(animate);
        }
      }, cumulative));

      if (s.type === 'customer') cumulative += 1800;
      else if (s.type === 'detect') cumulative += 1500;
      else if (s.type === 'ai') cumulative += 1800;
      else if (s.type === 'score') cumulative += 1200;
      else if (s.type === 'qualified') cumulative += 2500;
    }

    timeouts.push(setTimeout(() => {
      setStep(-1);
      setCycle(c => c + 1);
    }, cumulative + 2500));

    return () => timeouts.forEach(clearTimeout);
  }, [visible, cycle, reduced]);

  const isQualified = step >= leadQualScript.findIndex(s => s.type === 'qualified');

  return (
    <div ref={ref} className="w-full max-w-2xl mx-auto">
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-app bg-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-brand" />
            <span className="text-sm font-semibold text-main">Lead Qualification</span>
          </div>
          <div className="flex items-center gap-2">
            {step >= 0 && leadQualScript[step]?.type === 'detect' && (
              <Badge variant="warning" size="xs">High Intent</Badge>
            )}
            {isQualified && (
              <Badge variant="success" size="xs">
                <CheckCircle2 className="w-2.5 h-2.5" /> Qualified Lead
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-0">
          {/* Conversation */}
          <div className="md:col-span-3 p-4 space-y-3 bg-subtle min-h-[360px]">
            {leadQualScript.map((s, i) => {
              if (s.type === 'detect') {
                return (
                  <div key={i} className={`transition-all duration-500 ${step >= i ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="brand" size="xs">Intent: {s.intent}</Badge>
                      <Badge variant="warning" size="xs">{s.lead}</Badge>
                    </div>
                  </div>
                );
              }
              if (s.type === 'score') return null;
              if (s.type === 'qualified') {
                return (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-bg border border-brand-200/30 transition-all duration-500 ${step >= i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <CheckCircle2 className="w-4 h-4 text-brand" />
                    <span className="text-sm text-brand font-medium">Qualified Lead added to dashboard</span>
                  </div>
                );
              }

              const isCustomer = s.type === 'customer';
              return (
                <div key={i} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'} transition-all duration-500 ${step >= i ? 'opacity-100 translate-x-0' : `opacity-0 ${isCustomer ? 'translate-x-4' : '-translate-x-4'}`}`}>
                  <div className={`max-w-[80%] ${isCustomer ? 'items-end' : 'items-start'}`}>
                    {(s.type === 'ai') && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-5 h-5 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-[10px] font-medium text-muted">Wazly AI</span>
                      </div>
                    )}
                    <div
                      className={`px-3.5 py-2.5 text-sm leading-relaxed ${
                        isCustomer ? 'bg-brand-600 text-white rounded-2xl rounded-tr-md'
                        : 'bg-app border border-app text-main rounded-2xl rounded-tl-md'
                      } ${s.arabic ? 'font-arabic' : ''}`}
                      dir={s.arabic ? 'rtl' : 'ltr'}
                    >
                      {s.text || s.arabic || ''}
                      {'text' in s && s.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Score panel */}
          <div className="md:col-span-2 p-4 border-t md:border-t-0 md:border-l border-app space-y-4">
            <div>
              <div className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Lead Score</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-main tabular-nums count-up">{currentScore}</span>
                <span className="text-sm text-muted">/ 100</span>
              </div>
              <div className="mt-2">
                <ProgressBar
                  value={currentScore}
                  color={currentScore >= 80 ? 'green' : currentScore >= 50 ? 'brand' : 'amber'}
                  animated
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-muted uppercase tracking-wider">Signals</div>
              {[
                { label: 'Intent detected', active: step >= 1, delay: 0 },
                { label: 'Budget mentioned', active: step >= 5, delay: 100 },
                { label: 'Timeline shared', active: step >= 3, delay: 200 },
                { label: 'Location confirmed', active: step >= 3, delay: 300 },
              ].map(sig => (
                <div
                  key={sig.label}
                  className={`flex items-center gap-2 text-xs transition-all duration-500 ${sig.active ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-2'}`}
                  style={{ transitionDelay: `${sig.delay}ms` }}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${sig.active ? 'bg-brand-600 dark:bg-brand-500' : 'bg-muted'}`}>
                    <CheckCircle2 className={`w-2.5 h-2.5 ${sig.active ? 'text-white' : 'text-subtle'}`} />
                  </div>
                  <span className={sig.active ? 'text-main' : 'text-subtle'}>{sig.label}</span>
                </div>
              ))}
            </div>

            {isQualified && (
              <div className="pt-2 border-t border-app animate-fade-in-up">
                <div className="flex items-center gap-2 text-sm text-brand font-medium">
                  <TrendingUp className="w-4 h-4" />
                  High-quality lead
                </div>
                <div className="text-xs text-muted mt-1">Auto-added to CRM</div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
