import { useLang } from '@/lib/i18n';
import { useScrollProgress, usePrefersReducedMotion } from '@/lib/hooks';
import { clamp01, easeOut, mapRange, round } from '@/lib/motion';
import { Avatar, Eyebrow } from '@/components/ui';
import { Check } from 'lucide-react';

/** Named sources, fanned out before they collapse into the answer. */
const SOURCES: Array<{ ar: string; en: string; dx: number }> = [
  { ar: 'معلومات الخدمات', en: 'Service information', dx: -74 },
  { ar: 'الأسعار', en: 'Pricing', dx: 0 },
  { ar: 'الأسئلة الشائعة', en: 'FAQ', dx: 74 },
];

export function AISection() {
  const { pick, isRTL } = useLang();
  const reduced = usePrefersReducedMotion();
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    mode: 'through',
    disabled: reduced,
  });

  const p = reduced ? 0.85 : progress;
  const sign = isRTL ? -1 : 1;

  const question = easeOut(clamp01(mapRange(p, 0.2, 0.3, 0, 1)));
  const retrieving = clamp01(mapRange(p, 0.3, 0.38, 0, 1));
  // Sources collapse inward and downward as the answer forms.
  const collapse = easeOut(clamp01(mapRange(p, 0.5, 0.64, 0, 1)));
  const answer = easeOut(clamp01(mapRange(p, 0.58, 0.74, 0, 1)));
  const cites = clamp01(mapRange(p, 0.74, 0.84, 0, 1));

  return (
    <section id="how" ref={ref} className="py-section-sm sm:py-section">
      <div className="max-w-shell mx-auto px-5 sm:px-8">
        {/* Conversation first in DOM, so in Arabic it sits on the right and the
            statement on the left — the opposite hand to the hero. */}
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
          <div className="bg-elevated border border-app rounded-2xl p-4 sm:p-5">
            {/* Customer question */}
            <div
              className="flex justify-start"
              style={{
                opacity: round(question, 3),
                clipPath: question < 0.99 ? `inset(0 0 ${round((1 - question) * 100, 1)}% 0)` : undefined,
              }}
            >
              <div className="bubble-in max-w-[88%] bg-subtle px-3 py-2 text-[13px] leading-relaxed text-main" dir="auto">
                {pick(
                  'عندي شقة 150 متر في التجمع، عايز أعرف السعر وإيه اللي داخل فيه.',
                  'I have a 150m apartment in New Cairo — what is the price and what does it include?'
                )}
              </div>
            </div>

            {/* Retrieval line */}
            <div
              className="mt-4 flex items-center gap-2"
              style={{
                opacity: round(retrieving, 3),
                transform: `translate3d(${round((1 - retrieving) * 10 * sign)}px, 0, 0)`,
              }}
            >
              <span className="flex gap-1 text-brand">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </span>
              <span className="text-[11px] text-muted">
                {pick('بيراجع معلومات شركتك', 'Checking your company information')}
              </span>
            </div>

            {/* Sources: fan out, then collapse into the answer below. */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {SOURCES.map((source, index) => {
                const enter = easeOut(clamp01(mapRange(p, 0.34 + index * 0.05, 0.44 + index * 0.05, 0, 1)));
                const spread = 1 - collapse;
                return (
                  <span
                    key={source.en}
                    className="inline-flex items-center rounded-md border border-app bg-subtle px-2 py-1 text-[11px] text-muted"
                    style={{
                      opacity: round(enter * (1 - collapse * 0.85), 3),
                      transform: `translate3d(${round(source.dx * spread * sign)}px, ${round(
                        collapse * 26
                      )}px, 0) scale(${round(1 - collapse * 0.14, 3)})`,
                      willChange: 'transform',
                    }}
                  >
                    {pick(source.ar, source.en)}
                  </span>
                );
              })}
            </div>

            {/* Answer */}
            <div
              className="mt-3 flex justify-end"
              style={{
                opacity: round(answer, 3),
                clipPath: answer < 0.99 ? `inset(0 0 ${round((1 - answer) * 100, 1)}% 0)` : undefined,
              }}
            >
              <div className="flex max-w-[90%] flex-row-reverse items-end gap-2">
                <div
                  className="bubble-out bg-brand-600 px-3 py-2 text-[13px] leading-relaxed text-white dark:bg-brand-500 dark:text-brand-950"
                  dir="auto"
                >
                  {pick(
                    'الباقة المتوسطة بتشمل المحارة والسباكة والكهرباء والأرضيات. لـ 150 متر السعر يبدأ من 675,000 ج.م، والتنفيذ من 45 لـ 60 يوم عمل.',
                    'The mid package covers plastering, plumbing, electrics and flooring. For 150m it starts at EGP 675,000, delivered in 45–60 working days.'
                  )}
                </div>
              </div>
            </div>

            {/* Citations. The same three sources, now attached to the answer. */}
            <div
              className="mt-3 flex items-center gap-2 border-t border-app pt-3"
              style={{ opacity: round(cites, 3) }}
            >
              <Check className="h-3.5 w-3.5 shrink-0 text-brand" />
              <span className="text-[11px] text-subtle">
                {pick('المصدر: ', 'Source: ')}
                {SOURCES.map(s => pick(s.ar, s.en)).join(pick(' · ', ' · '))}
              </span>
            </div>
          </div>

          {/* Statement */}
          <div>
            <Eyebrow index="02">{pick('الذكاء', 'Intelligence')}</Eyebrow>
            <h2 className="mt-5 text-display-2 font-semibold text-main">
              {pick('مش مجرد شات بوت.', 'Not just a chatbot.')}
            </h2>
            <p className="mt-4 text-display-3 font-medium text-muted">
              {pick(
                <>
                  <span className="font-latin">Wazly</span> يفهم نشاط شركتك قبل أن يرد.
                </>,
                <>
                  <span className="font-latin">Wazly</span> understands your business before it answers.
                </>
              )}
            </p>
            <p className="mt-6 max-w-measure-lg text-[15px] leading-relaxed text-muted">
              {pick(
                'بيقرأ معلومات شركتك، بيرجع للمصدر، وبيرد بالتفاصيل الصح — مش بإجابة عامة.',
                'It reads your company information, goes back to the source, and answers with the right detail — not a generic reply.'
              )}
            </p>

            <div className="mt-8 flex items-center gap-3">
              <Avatar initial="م" tone="muted" size="sm" />
              <span className="text-xs text-subtle">
                {pick('شركة الكيان للتشطيبات والمقاولات العامة', 'Al Kayan Finishing & General Contracting')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
