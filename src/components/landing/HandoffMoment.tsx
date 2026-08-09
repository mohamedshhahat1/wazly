import { useLang } from '@/lib/i18n';
import { useScrollProgress, usePrefersReducedMotion } from '@/lib/hooks';
import { clamp01, easeOut, mapRange, round } from '@/lib/motion';
import { Avatar, ChannelBadge, Eyebrow } from '@/components/ui';
import { Check } from 'lucide-react';

type LineKind = 'customer' | 'ai' | 'operator';

const LINES: Array<{ id: string; at: number; kind: LineKind; ar: string; en: string }> = [
  {
    id: 'c1',
    at: 0.16,
    kind: 'customer',
    ar: 'ممكن أكلم حد من فريق المبيعات؟',
    en: 'Could I speak to someone in sales?',
  },
  {
    id: 'a1',
    at: 0.28,
    kind: 'ai',
    ar: 'طبعًا، هحوّلك لأحد أعضاء الفريق.',
    en: 'Of course — I will pass you to a team member.',
  },
  {
    id: 'o1',
    at: 0.62,
    kind: 'operator',
    ar: 'أهلاً أستاذ محمد، معاك ياسمين من فريق المبيعات. شوفت طلبك وهجهزلك عرض السعر النهاردة.',
    en: 'Hello Mohamed, Yasmin from sales here. I have seen your request and will prepare the quote today.',
  },
];

export function HandoffMoment() {
  const { pick, isRTL } = useLang();
  const reduced = usePrefersReducedMotion();
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    mode: 'through',
    disabled: reduced,
  });

  const p = reduced ? 0.95 : progress;
  const sign = isRTL ? -1 : 1;

  // The moment responsibility moves. Everything else keys off this.
  const morph = easeOut(clamp01(mapRange(p, 0.4, 0.58, 0, 1)));
  const divider = clamp01(mapRange(p, 0.42, 0.54, 0, 1));
  const received = clamp01(mapRange(p, 0.76, 0.88, 0, 1));

  return (
    <section ref={ref} className="py-section-sm sm:py-section">
      <div className="max-w-shell mx-auto px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div>
            <Eyebrow index="04">{pick('التحويل', 'Handoff')}</Eyebrow>
            <h2 className="mt-5 text-display-2 font-semibold text-main">
              {pick('لما العميل يحتاج بني آدم.', 'When a customer needs a person.')}
            </h2>
            <p className="mt-6 max-w-measure-lg text-[15px] leading-relaxed text-muted">
              {pick(
                'التحويل بيحصل في ثانية، والمحادثة بالكامل بتروح مع الموظف — مش بيسأل العميل من الأول تاني.',
                'The handoff takes a second, and the whole conversation goes with it — nobody asks the customer to start over.'
              )}
            </p>

            {/* Who is answering, as a two-state readout. */}
            <div className="mt-9 flex items-center gap-4">
              <div className="grid">
                <span
                  className="col-start-1 row-start-1 inline-flex items-center rounded-md border border-brand-600/15 bg-brand-bg px-2.5 py-1 text-xs font-medium text-brand"
                  style={{ opacity: round(1 - morph, 3) }}
                >
                  {pick('الـ AI بيرد', 'AI is answering')}
                </span>
                <span
                  className="col-start-1 row-start-1 inline-flex items-center whitespace-nowrap rounded-md bg-ink-900 px-2.5 py-1 text-xs font-medium text-white dark:bg-ink-100 dark:text-ink-900"
                  style={{ opacity: round(morph, 3) }}
                >
                  {pick('ياسمين طارق — المبيعات', 'Yasmin Tarek — Sales')}
                </span>
              </div>
              <span
                aria-hidden="true"
                className="h-px bg-ink-300 dark:bg-ink-700"
                style={{ width: `${round(28 + morph * 16)}px` }}
              />
              <span className="text-[11px] text-subtle">
                {pick('نفس المحادثة', 'Same conversation')}
              </span>
            </div>
          </div>

          {/* ------------------------------------------------------------ *
           * The panel. Its chrome changes hands mid-conversation.
           * ------------------------------------------------------------ */}
          <div className="bg-elevated border border-app rounded-2xl overflow-hidden">
            {/* Two headers, one grid cell. Cross-fading complete variants is
                the only dependable way to interpolate background and text
                colour at once, and it guarantees no reflow at the switch. */}
            <div className="grid">
              <div
                className="col-start-1 row-start-1 flex items-center gap-3 border-b border-app px-4 py-3"
                style={{ opacity: round(1 - morph, 3) }}
              >
                <Avatar initial="م" tone="muted" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[13px] font-medium text-main">
                      {pick('محمد أحمد', 'Mohamed Ahmed')}
                    </span>
                    <ChannelBadge channel="whatsapp" />
                  </div>
                  <div className="mt-0.5 text-[11px] text-subtle">
                    {pick('مساعد Wazly', 'Wazly assistant')}
                  </div>
                </div>
                <span className="rounded-md border border-brand-600/15 bg-brand-bg px-2 py-0.5 text-[11px] font-medium text-brand">
                  {pick('الـ AI', 'AI')}
                </span>
              </div>

              <div
                className="col-start-1 row-start-1 flex items-center gap-3 bg-ink-900 px-4 py-3 dark:bg-ink-950"
                style={{ opacity: round(morph, 3) }}
              >
                <span
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white"
                  style={{ transform: `scale(${round(0.85 + morph * 0.15, 3)})` }}
                  aria-hidden="true"
                >
                  ي
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-white">
                    {pick('ياسمين طارق', 'Yasmin Tarek')}
                  </div>
                  <div className="mt-0.5 text-[11px] text-white/55">
                    {pick('المبيعات · بترد على محمد أحمد', 'Sales · replying to Mohamed Ahmed')}
                  </div>
                </div>
                <span className="rounded-md bg-white/12 px-2 py-0.5 text-[11px] font-medium text-white">
                  {pick('موظف', 'Human')}
                </span>
              </div>
            </div>

            <div className="min-h-[240px] space-y-3 px-4 py-4">
              {LINES.map(line => {
                const enter = easeOut(clamp01(mapRange(p, line.at, line.at + 0.09, 0, 1)));
                if (enter <= 0) return null;
                const isCustomer = line.kind === 'customer';
                const isOperator = line.kind === 'operator';

                // The assignment divider sits between the AI reply and the
                // operator's, the way an agent console records it.
                return (
                  <div key={line.id}>
                    {isOperator && (
                      <div
                        className="mb-3 flex items-center gap-3"
                        style={{ opacity: round(divider, 3) }}
                      >
                        <span aria-hidden="true" className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
                        <span className="text-[10px] text-subtle">
                          {pick('تم تحويل المحادثة إلى ياسمين', 'Assigned to Yasmin')}
                        </span>
                        <span aria-hidden="true" className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
                      </div>
                    )}
                    <div
                      className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}
                      style={{
                        opacity: round(Math.min(1, enter * 1.3), 3),
                        clipPath: enter < 0.99 ? `inset(0 0 ${round((1 - enter) * 100, 1)}% 0)` : undefined,
                        transform: `translate3d(${round((1 - enter) * 6 * (isCustomer ? sign : -sign))}px, 0, 0)`,
                      }}
                    >
                      <div className={`flex max-w-[88%] items-end gap-2 ${isCustomer ? '' : 'flex-row-reverse'}`}>
                        {isOperator && <Avatar initial="ي" tone="ink" size="sm" />}
                        <div
                          dir="auto"
                          className={`px-3 py-2 text-[13px] leading-relaxed ${
                            isCustomer
                              ? 'bubble-in bg-subtle text-main'
                              : isOperator
                                ? 'bubble-out bg-ink-900 text-white dark:bg-ink-100 dark:text-ink-900'
                                : 'bubble-out bg-brand-600 text-white dark:bg-brand-500 dark:text-brand-950'
                          }`}
                        >
                          {pick(line.ar, line.en)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div
                className="flex items-center gap-1.5 pt-1 text-[11px] font-medium text-brand"
                style={{
                  opacity: round(received, 3),
                  transform: `scale(${round(0.96 + received * 0.04, 3)})`,
                }}
              >
                <Check className="h-3.5 w-3.5" />
                {pick('تم استلام المحادثة', 'Conversation picked up')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
