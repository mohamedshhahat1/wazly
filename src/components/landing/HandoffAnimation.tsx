import { useEffect, useState } from 'react';
import { Sparkles, User, ArrowDown, CheckCircle2 } from 'lucide-react';
import { useReveal, usePrefersReducedMotion } from '@/lib/hooks';
import { handoffScript } from '@/lib/mockData';
import { Badge } from '@/components/ui';

export function HandoffAnimation() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(-1);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setStep(handoffScript.length - 1);
      return;
    }

    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let cumulative = 600;

    setStep(-1);

    for (let i = 0; i < handoffScript.length; i++) {
      const idx = i;
      const s = handoffScript[i];
      timeouts.push(setTimeout(() => setStep(idx), cumulative));

      if (s.type === 'customer') cumulative += 1800;
      else if (s.type === 'ai') cumulative += 2000;
      else if (s.type === 'status') cumulative += 1400;
      else if (s.type === 'operator') cumulative += 2500;
    }

    timeouts.push(setTimeout(() => {
      setStep(-1);
      setCycle(c => c + 1);
    }, cumulative + 2000));

    return () => timeouts.forEach(clearTimeout);
  }, [visible, cycle, reduced]);

  const getStatusBadge = (s: number) => {
    if (s < 0) return null;
    const current = handoffScript[s];
    if (current.type === 'status') {
      if (current.status === 'Human takeover') return <Badge variant="human">Human takeover</Badge>;
      if (current.status === 'Assigned to Mohamed') return <Badge variant="human">Assigned to Mohamed</Badge>;
    }
    // Infer status from context
    let hasAi = false, hasHumanStatus = false, hasOperator = false;
    for (let i = 0; i <= s; i++) {
      if (handoffScript[i].type === 'ai') hasAi = true;
      if (handoffScript[i].type === 'status') hasHumanStatus = true;
      if (handoffScript[i].type === 'operator') hasOperator = true;
    }
    if (hasOperator) return <Badge variant="success">Human takeover</Badge>;
    if (hasHumanStatus) return <Badge variant="human">Human takeover</Badge>;
    if (hasAi) return <Badge variant="ai">AI handling</Badge>;
    return null;
  };

  return (
    <div ref={ref} className="w-full max-w-md mx-auto">
      <div className="bg-app border border-app rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-app bg-subtle flex items-center justify-between">
          <span className="text-sm font-semibold text-main">Conversation</span>
          <div className="min-h-[20px] transition-all duration-300">
            {getStatusBadge(step)}
          </div>
        </div>

        {/* Messages */}
        <div className="h-[380px] overflow-y-auto px-4 py-4 space-y-3 bg-subtle">
          {handoffScript.map((s, i) => {
            if (s.type === 'status') {
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-1 py-2 transition-all duration-500 ${
                    step >= i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-accent-50 dark:bg-accent-950/30 flex items-center justify-center border border-accent-200 dark:border-accent-900/50">
                    <ArrowDown className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="human" size="xs">{s.status}</Badge>
                  </div>
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
                  step >= i ? 'opacity-100 translate-x-0' : `opacity-0 ${isCustomer ? 'translate-x-4' : '-translate-x-4'}`
                }`}
              >
                <div className={`max-w-[80%] ${isCustomer ? 'items-end' : 'items-start'}`}>
                  {(isAi || isOperator) && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isAi ? 'bg-brand-600 dark:bg-brand-500' : 'bg-accent-600'
                      }`}>
                        {isAi ? <Sparkles className="w-3 h-3 text-white" /> : <User className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-[10px] font-medium text-muted">
                        {isAi ? 'Wazly AI' : s.operator}
                      </span>
                    </div>
                  )}
                  <div
                    className={`px-3.5 py-2.5 text-sm leading-relaxed ${
                      isCustomer
                        ? 'bg-brand-600 text-white rounded-2xl rounded-tr-md'
                        : isAi
                        ? 'bg-app border border-app text-main rounded-2xl rounded-tl-md'
                        : 'bg-accent-600 text-white rounded-2xl rounded-tl-md'
                    }`}
                  >
                    {s.text}
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
