import { Building2, FileText, HelpCircle, Tag, Shield, Check, Sparkles } from 'lucide-react';
import { useScrollProgress, usePrefersReducedMotion, useCountTo } from '@/lib/hooks';
import { mapRange } from '@/lib/motion';
import { useLang } from '@/lib/i18n';

const sourceIcons = [Building2, HelpCircle, Tag, Shield, FileText];

/**
 * Readiness figure per number of absorbed sources.
 *
 * The brief specifies four values rather than a smooth 0→100 ramp, and it is
 * the more honest reading anyway: indexing jumps as each source lands, and it
 * never claims 100% because there is always more a business could add.
 */
const READINESS = [0, 42, 42, 76, 76, 94];

export function KnowledgeAnimation() {
  const { pick, isRTL } = useLang();
  const reduced = usePrefersReducedMotion();
  const { ref, progress: raw } = useScrollProgress<HTMLDivElement>({ disabled: reduced });

  const sources = pick(
    ['بيانات الشركة', 'الأسئلة الشائعة', 'المنتجات', 'الخدمات والأسعار', 'المستندات والعقود'],
    ['Company information', 'FAQs', 'Products', 'Services & pricing', 'Documents & contracts'],
  );

  const pipeline = pick(
    ['المعالجة', 'التقسيم', 'الفهرسة', 'معرفة الـ AI'],
    ['Processing', 'Chunking', 'Indexing', 'AI knowledge'],
  );

  // Reduced motion resolves to the finished state; otherwise the useful window
  // is the middle of the card's traversal, while it is actually on screen.
  const p = reduced ? 1 : mapRange(raw, 0.22, 0.72, 0, 1);

  const absorbed = Math.min(sources.length, Math.floor(p * (sources.length + 1)));
  const pipelineStep = absorbed <= 0 ? -1 : Math.min(pipeline.length - 1, absorbed - 1);
  const ready = absorbed >= sources.length;

  // Eases between the stepped targets instead of snapping.
  const readiness = useCountTo(READINESS[absorbed] ?? 94, 600);

  return (
    <div ref={ref} className="w-full max-w-lg mx-auto">
      <div className="bg-app border border-app rounded-2xl shadow-medium p-5 sm:p-6 space-y-5">
        {/* Sources */}
        <div>
          <div className={`text-xs font-medium text-muted mb-3 ${isRTL ? '' : 'uppercase tracking-wider'}`}>
            {pick('علّم الـ AI عن شركتك', 'Teach the AI about your business')}
          </div>
          <div className="space-y-2">
            {sources.map((name, i) => {
              const Icon = sourceIcons[i] ?? FileText;
              const active = absorbed > i;
              return (
                <div
                  key={name}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-500 ease-smooth ${
                    active ? 'border-app bg-subtle' : 'border-transparent bg-transparent'
                  }`}
                  style={{
                    // Absorbed sources settle into place; the rest hang back.
                    opacity: active ? 1 : 0.3,
                    transform: active ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.99)',
                  }}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                      active ? 'bg-brand-bg' : 'bg-muted'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors duration-300 ${active ? 'text-brand' : 'text-subtle'}`} />
                  </div>
                  <span className={`text-sm flex-1 min-w-0 truncate ${active ? 'text-main' : 'text-subtle'}`}>{name}</span>
                  {active && <Check className="w-4 h-4 text-brand animate-scale-in shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Connector — grows as sources are taken in */}
        <div className="flex justify-center">
          <div
            className="w-px bg-brand-500 transition-all duration-500 ease-smooth"
            style={{
              height: '2rem',
              opacity: absorbed > 0 ? Math.min(0.65, 0.2 + absorbed * 0.12) : 0,
            }}
            aria-hidden="true"
          />
        </div>

        {/* Pipeline */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {pipeline.map((stage, i) => {
            const active = pipelineStep >= i;
            return (
              <div key={stage} className="flex items-center gap-2 flex-1 min-w-max">
                <div
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
                    active
                      ? 'bg-brand-bg text-brand border border-brand-200/30'
                      : 'bg-muted text-subtle border border-transparent'
                  }`}
                >
                  {active && <Sparkles className="w-3 h-3" />}
                  {stage}
                </div>
                {i < pipeline.length - 1 && (
                  <div
                    className={`h-px flex-1 min-w-[12px] transition-colors duration-500 ${
                      pipelineStep > i ? 'bg-brand-400' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Readiness */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs gap-2">
            <span className="text-muted">
              {ready ? pick('جاهزية الـ AI', 'Knowledge readiness') : pick('بنفهرس المعرفة…', 'Indexing knowledge…')}
            </span>
            <span className="font-mono text-main num">{Math.round(readiness)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500"
              style={{ width: `${readiness}%` }}
            />
          </div>
        </div>

        {/* Ready */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-bg border border-brand-200/20 transition-all duration-500 ease-smooth"
          style={{
            opacity: ready ? 1 : 0,
            transform: ready ? 'translateY(0)' : 'translateY(6px)',
          }}
        >
          <div className="w-8 h-8 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-brand">{pick('معرفة الـ AI جاهزة', 'AI knowledge ready')}</div>
            <div className="text-xs text-muted">
              {pick('الـ AI بقى يقدر يرد على أسئلة عملائك.', 'Your AI can now answer questions about your business.')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
