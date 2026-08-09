import { Sparkles, User, ArrowDown } from 'lucide-react';
import { useScrollProgress, usePrefersReducedMotion } from '@/lib/hooks';
import { mapRange } from '@/lib/motion';
import { useLang } from '@/lib/i18n';
import { handoffScript, operators } from '@/lib/mockData';
import { Badge } from '@/components/ui';

/**
 * Mirrors the real shape of `handoffScript` rather than asserting a shape onto
 * it, so it is assignable with no cast. An earlier version claimed `textEn` and
 * `statusEn` fields that the data never had; because the cast silenced the
 * compiler, every `?? fallback` quietly resolved to Arabic in English mode.
 */
type ScriptLine = {
  type: 'customer' | 'ai' | 'status' | 'operator';
  text?: string;
};

const lines: ScriptLine[] = handoffScript;

// Static data, so the status beats are numbered once at module load.
const statusOrder = new Map<number, number>();
let statusCount = 0;
lines.forEach((line, i) => {
  if (line.type === 'status') statusOrder.set(i, statusCount++);
});

export function HandoffAnimation() {
  const { pick } = useLang();
  const reduced = usePrefersReducedMotion();
  const { ref, progress: raw } = useScrollProgress<HTMLDivElement>({ disabled: reduced });

  // Reduced motion shows the resolved conversation; otherwise scroll advances it.
  const p = reduced ? 1 : mapRange(raw, 0.15, 0.7, 0, 1);
  const step = Math.min(lines.length - 1, Math.floor(p * (lines.length + 1)) - 1);

  // Derived from which line *types* have played. Matching on copy would break
  // the moment that copy gets translated.
  let aiActive = false;
  let assigned = false;
  let operatorActive = false;
  let seen = 0;
  for (let i = 0; i <= step; i++) {
    const type = lines[i].type;
    if (type === 'ai') aiActive = true;
    if (type === 'operator') operatorActive = true;
    if (type === 'status') {
      seen += 1;
      if (seen > 1) assigned = true;
    }
  }

  const operator = operators[0];
  const operatorName = pick(operator.name, operator.nameEn ?? operator.name);
  const operatorRole = pick(operator.role, operator.roleEn ?? operator.role);
  const firstName = operatorName.split(' ')[0];

  return (
    <div ref={ref} className="w-full max-w-md mx-auto">
      <div className="bg-app border border-app rounded-2xl shadow-medium overflow-hidden">
        {/* Ownership moves from AI to human here, and the tint moves with it */}
        <div
          className="px-4 py-3 border-b border-app flex items-center justify-between gap-2 transition-colors duration-700 ease-smooth"
          style={{ backgroundColor: assigned ? 'var(--bg-muted)' : 'var(--bg-subtle)' }}
        >
          <span className="text-sm font-semibold text-main">{pick('المحادثة', 'Conversation')}</span>

          {/* Both badges share one grid cell, so the swap happens in place and
              nothing around it reflows. That is what reads as a transition
              rather than one badge leaving and another arriving. */}
          <div className="grid justify-items-end min-h-[22px]">
            <div
              className="col-start-1 row-start-1 transition-all duration-500 ease-smooth"
              style={{
                opacity: aiActive && !assigned ? 1 : 0,
                transform: assigned ? 'translateY(-6px) scale(0.96)' : 'none',
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
                opacity: assigned ? 1 : 0,
                transform: assigned ? 'none' : 'translateY(6px) scale(0.96)',
              }}
            >
              <Badge variant="human">
                <User className="w-3 h-3" />
                {`${firstName} — ${operatorRole}`}
              </Badge>
            </div>
          </div>
        </div>

        <div className="h-[380px] overflow-y-auto px-4 py-4 space-y-3 bg-subtle">
          {lines.map((line, i) => {
            const played = step >= i;
            const enter = played ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3';

            if (line.type === 'status') {
              const isAlert = (statusOrder.get(i) ?? 0) === 0;

              // The alert is the strong beat: it gets the icon and the badge.
              if (isAlert) {
                return (
                  <div key={i} className={`flex flex-col items-center gap-1.5 py-2 transition-all duration-500 ${enter}`}>
                    <div className="w-8 h-8 rounded-full bg-accent-50 dark:bg-accent-950/30 flex items-center justify-center border border-accent-200 dark:border-accent-900/50">
                      <ArrowDown className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                    </div>
                    <Badge variant="human" size="xs">
                      {pick('المحادثة تحتاج موظف', 'This conversation needs a person')}
                    </Badge>
                    {/* Held a beat behind, so the takeover reads as a consequence */}
                    <span
                      className="text-[10px] text-subtle transition-opacity duration-500"
                      style={{ opacity: assigned ? 1 : 0 }}
                    >
                      {pick('استلام بشري', 'Human takeover')}
                    </span>
                  </div>
                );
              }

              return (
                <div key={i} className={`text-center transition-all duration-500 ${enter}`}>
                  <span className="text-[11px] text-subtle">
                    {pick(`${firstName} انضم للمحادثة`, `${firstName} joined the conversation`)}
                  </span>
                </div>
              );
            }

            const isCustomer = line.type === 'customer';
            const isAi = line.type === 'ai';
            const isOperator = line.type === 'operator';

            return (
              <div key={i} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'} transition-all duration-500 ${enter}`}>
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
                      <span className="text-[10px] font-medium text-muted">{isAi ? 'Wazly AI' : operatorName}</span>
                    </div>
                  )}
                  {/* Conversation content stays as the customer wrote it; dir=auto
                      keeps mixed Arabic and Latin runs aligned correctly. */}
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
                    {line.text}
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
