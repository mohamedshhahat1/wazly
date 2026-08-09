import { useLang } from '@/lib/i18n';
import { useScrollProgress, usePrefersReducedMotion, useIsCompact } from '@/lib/hooks';
import { clamp01, easeOut, mapRange, round } from '@/lib/motion';
import { Eyebrow } from '@/components/ui';
import { Check } from 'lucide-react';

/**
 * Document fragments, not document cards. Each carries a real line of company
 * information, because the answer at the bottom is derived from them — the
 * section demonstrates retrieval rather than illustrating it.
 */
const FRAGMENTS: Array<{ labelAr: string; labelEn: string; ar: string; en: string }> = [
  {
    labelAr: 'معلومات الشركة',
    labelEn: 'Company information',
    ar: 'شركة الكيان للتشطيبات — التجمع الخامس، القاهرة الجديدة، المعادي، الشيخ زايد',
    en: 'Al Kayan Finishing — New Cairo, Fifth Settlement, Maadi, Sheikh Zayed',
  },
  {
    labelAr: 'الخدمات والأسعار',
    labelEn: 'Services & pricing',
    ar: 'تشطيب كامل: 4,500 – 7,200 ج.م للمتر حسب مستوى الخامات',
    en: 'Full finishing: EGP 4,500 – 7,200 per m² depending on materials',
  },
  {
    labelAr: 'الأسئلة الشائعة',
    labelEn: 'FAQ',
    ar: 'مدة التنفيذ لشقة 150 متر من 45 إلى 60 يوم عمل',
    en: 'A 150m² apartment takes 45–60 working days',
  },
  {
    labelAr: 'شروط التعاقد',
    labelEn: 'Contract terms',
    ar: 'دفعة أولى 25% عند التعاقد، والباقي على مراحل التنفيذ',
    en: '25% on signing, the remainder across delivery milestones',
  },
];

export function KnowledgeAssembly() {
  const { pick } = useLang();
  const reduced = usePrefersReducedMotion();
  const compact = useIsCompact();
  // Compact viewports cannot hold the stacked grid inside one sticky frame, so
  // they read the progress of the section passing instead of pinning it.
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    mode: compact ? 'through' : 'sticky',
    disabled: reduced,
  });

  const pinned = !reduced && !compact;
  const p = reduced ? 1 : progress;

  const railTo = clamp01(mapRange(p, 0.1, 0.56, 0, 1));
  const merge = easeOut(clamp01(mapRange(p, 0.5, 0.7, 0, 1)));
  const base = clamp01(mapRange(p, 0.58, 0.74, 0, 1));
  const answer = easeOut(clamp01(mapRange(p, 0.74, 0.9, 0, 1)));

  return (
    <section
      ref={ref}
      className={pinned ? 'h-[300vh]' : 'py-section-sm'}
    >
      <div className={pinned ? 'sticky top-0 flex min-h-[100svh] items-center py-20' : ''}>
        <div className="max-w-shell mx-auto w-full px-5 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-20">
            {/* -------------------------------------------------------- *
             * Assembly. Vertical on purpose: a horizontal convergence
             * would need mirroring for RTL, and the vertical reading
             * order is identical in both directions.
             * -------------------------------------------------------- */}
            <div>
              <Eyebrow index="03">{pick('المعرفة', 'Knowledge')}</Eyebrow>
              <h2 className="mt-5 text-display-2 font-semibold text-main">
                {pick('علّم الـ AI عن شركتك.', 'Teach the AI about your business.')}
              </h2>

              <div className="relative mt-10 ps-6">
                {/* The rail grows as the fragments land, tying them together
                    without drawing a box around anything. */}
                <span
                  aria-hidden="true"
                  className="absolute start-[3px] top-2 w-px bg-ink-300 dark:bg-ink-700"
                  style={{ height: `${round(railTo * 100)}%` }}
                />

                <div className="space-y-4">
                  {FRAGMENTS.map((fragment, index) => {
                    const enter = easeOut(clamp01(mapRange(p, 0.08 + index * 0.08, 0.2 + index * 0.08, 0, 1)));
                    return (
                      <div
                        key={fragment.labelEn}
                        className="relative"
                        style={{
                          // Fragments recede rather than vanish: they are still
                          // the evidence for the answer below.
                          opacity: round(enter * (1 - merge * 0.62), 3),
                          transform: `translate3d(0, ${round(
                            (1 - enter) * 10 - merge * (FRAGMENTS.length - index) * 3
                          )}px, 0) scale(${round(1 - merge * 0.03, 3)})`,
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute -start-6 top-2 h-1.5 w-1.5 -translate-x-px rounded-full bg-ink-300 dark:bg-ink-700"
                        />
                        <div className="text-eyebrow font-medium uppercase text-subtle">
                          {pick(fragment.labelAr, fragment.labelEn)}
                        </div>
                        <p dir="auto" className="mt-1 text-[13px] leading-relaxed text-main">
                          {pick(fragment.ar, fragment.en)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Everything above resolves into one line. */}
                <div
                  className="mt-6 flex items-center gap-2.5"
                  style={{
                    opacity: round(base, 3),
                    transform: `translate3d(0, ${round((1 - base) * 8)}px, 0)`,
                  }}
                >
                  <span aria-hidden="true" className="h-px w-5 bg-brand-600 dark:bg-brand-400" />
                  <span className="text-[13px] font-medium text-main">
                    {pick('قاعدة معرفة الشركة', 'Company knowledge base')}
                  </span>
                  <span className="num ms-auto text-[11px] text-brand">
                    {pick('جاهزة 94%', '94% ready')}
                  </span>
                </div>

                {/* The answer the fragments add up to. */}
                <div
                  className="mt-4 rounded-xl border border-brand-600/20 bg-brand-bg p-3.5"
                  style={{
                    opacity: round(answer, 3),
                    clipPath: answer < 0.99 ? `inset(0 0 ${round((1 - answer) * 100, 1)}% 0)` : undefined,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-brand" />
                    <span className="text-[11px] font-medium text-brand">
                      {pick('رد الـ AI', 'AI answer')}
                    </span>
                  </div>
                  <p dir="auto" className="mt-2 text-[13px] leading-relaxed text-main">
                    {pick(
                      'تشطيب 150 متر بمستوى متوسط يبدأ من حوالي 675,000 ج.م، والتنفيذ من 45 لـ 60 يوم عمل. الدفعة الأولى 25% عند التعاقد.',
                      'Finishing 150m² at the mid level starts around EGP 675,000 over 45–60 working days, with 25% due on signing.'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------- *
             * The alternative path, deliberately given display weight.
             * -------------------------------------------------------- */}
            <div className="lg:pt-24">
              <p className="text-display-3 font-semibold text-main">
                {pick('مش عندك ملفات؟', 'No files?')}
              </p>
              <p className="text-display-3 font-semibold text-brand">
                {pick('ولا يهمك.', 'Not a problem.')}
              </p>
              <p className="mt-5 max-w-measure text-[15px] leading-relaxed text-muted">
                {pick(
                  <>
                    اكتب معلومات شركتك ببساطة، و<span className="font-latin">Wazly</span> يتولى الباقي.
                  </>,
                  <>
                    Just write your company details and <span className="font-latin">Wazly</span> handles the rest.
                  </>
                )}
              </p>

              {/* A plain field, because that is genuinely all it takes. */}
              <div className="mt-7 rounded-xl border border-app bg-elevated p-3.5">
                <div className="text-eyebrow font-medium uppercase text-subtle">
                  {pick('معلومات شركتك', 'About your business')}
                </div>
                <p dir="auto" className="mt-2 text-[13px] leading-relaxed text-main">
                  {pick(
                    'بنعمل تشطيبات في القاهرة الجديدة والتجمع. المتر من 4,500 لـ 7,200 جنيه.',
                    'We do finishing work across New Cairo. EGP 4,500–7,200 per m².'
                  )}
                  <span className="ms-0.5 inline-block h-4 w-px translate-y-0.5 bg-brand-600 align-middle animate-blink dark:bg-brand-400" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
