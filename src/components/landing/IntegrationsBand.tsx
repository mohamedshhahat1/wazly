import { useLang } from '@/lib/i18n';
import { useScrollProgress, usePrefersReducedMotion } from '@/lib/hooks';
import { clamp01, mapRange, round } from '@/lib/motion';
import { ChannelBadge, Eyebrow, StatusDot } from '@/components/ui';
import { integrations } from '@/lib/mockData';

export function IntegrationsBand() {
  const { pick } = useLang();
  const reduced = usePrefersReducedMotion();
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    mode: 'through',
    disabled: reduced,
  });

  const p = reduced ? 1 : progress;

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

          {/* Rows on hairlines. Connection state resolves per row as the
              section passes — the state is the only motion here. */}
          <ul className="divide-y divide-app border-y border-app">
            {integrations.map((integration, index) => {
              const settle = clamp01(mapRange(p, 0.2 + index * 0.05, 0.32 + index * 0.05, 0, 1));
              const online = integration.connected && settle > 0.6;
              return (
                <li key={integration.id} className="flex items-center gap-4 py-3.5">
                  {integration.channel ? (
                    <ChannelBadge channel={integration.channel} />
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

                  <div className="shrink-0" style={{ opacity: round(0.35 + settle * 0.65, 3) }}>
                    {integration.connected ? (
                      online ? (
                        <StatusDot status="connected" label={pick('متصل', 'Connected')} />
                      ) : (
                        <span className="text-[11px] text-subtle">
                          {pick('جاري الربط...', 'Connecting…')}
                        </span>
                      )
                    ) : (
                      <span className="text-[11px] text-muted">{pick('متاح', 'Available')}</span>
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
