import { useLang } from '@/lib/i18n';
import { useScrollProgress, usePrefersReducedMotion } from '@/lib/hooks';
import { clamp01, easeOut, mapRange, round } from '@/lib/motion';
import { ChannelBadge, Eyebrow, StatusDot } from '@/components/ui';
import { BrandGlyph, brandColor, integrationBrand } from '@/components/BrandIcons';
import { integrations } from '@/lib/mockData';

export function IntegrationsBand() {
  const { pick, isRTL } = useLang();
  const reduced = usePrefersReducedMotion();
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    mode: 'through',
    disabled: reduced,
  });

  const p = reduced ? 1 : progress;
  const sign = isRTL ? -1 : 1;

  return (
    <section id="integrations" ref={ref} className="py-section-sm sm:py-section">
      <div className="max-w-shell mx-auto px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
          <div>
            <Eyebrow index="08">{pick('التكاملات', 'Integrations')}</Eyebrow>
            <h2 className="mt-5 text-display-3 font-semibold text-main">
              {pick('بيشتغل مع اللي عندك.', 'Works with what you already use.')}
            </h2>
            <p className="mt-4 max-w-measure text-sm leading-relaxed text-muted">
              {pick(
                'اربط القنوات في دقايق، وكمّل شغلك من غير ما تغير حاجة في طريقة شغل فريقك.',
                'Connect your channels in minutes and carry on without changing how your team works.'
              )}
            </p>
          </div>

          {/* Rows on hairlines. Each one enters from the logical start, then
              resolves its connection state as the section passes. */}
          <ul className="divide-y divide-app border-y border-app">
            {integrations.map((integration, index) => {
              const enter = easeOut(
                clamp01(mapRange(p, 0.1 + index * 0.035, 0.24 + index * 0.035, 0, 1))
              );
              const settle = clamp01(
                mapRange(p, 0.24 + index * 0.045, 0.42 + index * 0.045, 0, 1)
              );
              const online = integration.connected && settle >= 1;
              const brandKey = integrationBrand[integration.name];

              return (
                <li
                  key={integration.id}
                  className="flex items-center gap-4 py-3.5"
                  style={{
                    opacity: round(enter, 3),
                    transform: `translate3d(${round((1 - enter) * 16 * sign)}px, 0, 0)`,
                  }}
                >
                  {integration.channel ? (
                    <ChannelBadge channel={integration.channel} />
                  ) : brandKey ? (
                    <span
                      aria-label={integration.name}
                      role="img"
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-app bg-elevated"
                      style={{ color: brandColor[brandKey] }}
                    >
                      <BrandGlyph brand={brandKey} className="h-3 w-3" />
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-app bg-subtle text-[9px] font-medium text-muted"
                    >
                      {integration.name.charAt(0)}
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium font-latin text-main">
                      {integration.name}
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-subtle">
                      {pick(integration.description, integration.descriptionEn)}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {integration.connected ? (
                      online ? (
                        <StatusDot status="connected" label={pick('متصل', 'Connected')} />
                      ) : (
                        /* Connecting shown as work in progress rather than as a
                           word that never changes. */
                        <span className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="block h-px w-7 overflow-hidden bg-muted"
                          >
                            <span
                              className="block h-full bg-brand-600 dark:bg-brand-400"
                              style={{ width: `${round(settle * 100)}%` }}
                            />
                          </span>
                          <span className="text-[11px] text-subtle">
                            {pick('جاري الربط...', 'Connecting…')}
                          </span>
                        </span>
                      )
                    ) : (
                      <span
                        className="text-[11px] text-muted"
                        style={{ opacity: round(0.4 + enter * 0.6, 3) }}
                      >
                        {pick('متاح', 'Available')}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
