import { Sparkles, User, ArrowDown } from 'lucide-react';
import { useScrollProgress, usePrefersReducedMotion } from '@/lib/hooks';
import { mapRange } from '@/lib/motion';
import { useLang } from '@/lib/i18n';
import { handoffScript, operators } from '@/lib/mockData';
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
  const reduced = usePrefersReducedMotion();
  const { ref, progress: raw } = useScrollProgress<HTMLDivElement>({ disabled: reduced });

  // Reduced motion shows the resolved conversation; otherwise scroll advances it.
  const p = reduced ? 1 : mapRange(raw, 0.15, 0.7, 0, 1);
  const step = Math.min(lines.length - 1, Math.floor(p * (lines.length + 1)) - 1);

  // Derived from which line *types* have played. Comparing against copy would
  // break the moment that copy gets translated.
  let hasAi = false;
  let handedOff = false;
  let operatorActive = false;
  for (let i = 0; i <= step; i++) {
    const t = lines[i].type;
    if (t === 'ai') hasAi = true;
    if (t === 'status') handedOff = true;
    if (t === 'operator') operatorActive = true;
  }

  const operator = operators[0];
  const operatorLabel = `${pick(operator.name, operator.nameEn ?? operator.name)} — ${pick(
    operator.role,
    operator.roleEn ?? operator.role,
  )}`;

  return (
    <div ref={ref} className="w-full max-w-md mx-auto">
      <div className="bg-app border border-app rounded-2xl shadow-medium overflow-hidden">
        {/* Ownership moves from AI to human here. The tint shifts with it. */}
        <div
          className="px-4 py-3 border-b border-app flex items-center justify-between gap-2 transition-colors duration-700 ease-smooth"
          style={{
            backgroundColor: handedOff
              ? 'var(--bg-muted)'
              : 'var(--bg-subtle)',
          }}
        >
          <span className="text-sm font-semibold text-main">{pick('المحادثة', 'Conversation')}</span>

          {/* Both badges share one grid cell, so the swap happens in place and
              nothing reflows around it. */}
          <div className="grid justify-items-end min-h-[22px]">
            <div
              className="col-start-1 row-start-1 transition-all duration-500 ease-smooth"
              style={{
                opacity: hasAi && !handedOff ? 1 : 0,
                transform: handedOff ? 'translateY(-6px) scale(0.96)' : 'none',
              }}
            >
              <Badge variant="ai">
                <Sparkles className="w-3 h-3" />
                AI
              </Badge>
            </div>
            <div
              className="col-start-1 row-start-1 transition-all duration-500 ease-smooth"
              style={{
                opacity: handedOff ? 1 : 0,
                transform: handedOff ? 'none' : 'translateY(6px) scale(0.96)',
              }}
            >
              <Badge variant="human">
                <User className="w-3 h-3" />
                {operatorLabel}
              </Badge>
            </div>
          </div>
        </div>

        <div className="h-[380px] overflow-y-auto px-4 py-4 space-y-3 bg-subtle">
          {lines.map((s, i) => {
            if (s.type === 'status') {
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-1.5 py-2 transition-all duration-500 ${
                    step >= i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-accent-50 dark:bg-accent-950/30 flex items-center justify-center border border-accent-200 dark:border-accent-900/50">
                    <ArrowDown className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                  </div>
                  <Badge variant="human" size="xs">
                    {pick(s.status ?? '', s.statusEn ?? s.status ?? '')}
                  </Badge>
                  {/* The takeover itself, held back a beat behind the status */}
                  <span
                    className="text-[10px] text-subtle transition-opacity duration-500"
                    style={{ opacity: operatorActive ? 1 : 0 }}
                  >
                    {pick('استلام بشري', 'Human takeover')}
                  </span>
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
