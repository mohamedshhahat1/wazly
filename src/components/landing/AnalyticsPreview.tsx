import { useReveal, useCountUp } from '@/lib/hooks';
import { round } from '@/lib/motion';
import { useLang } from '@/lib/i18n';
import { analyticsData, type ChannelType } from '@/lib/mockData';
import { ChannelBadge } from '@/components/ui';

/**
 * The dashboard assembles itself once, in sequence, when it first enters the
 * viewport: cards, then counters, then the trend line drawing, then bars, then
 * channel split, then AI vs team.
 *
 * `useReveal` unobserves after the first intersection, so scrolling back up and
 * down again does not replay it.
 */

const DAILY = analyticsData.daily;
const AI_TOTAL = DAILY.reduce((sum, d) => sum + d.ai, 0);
const HUMAN_TOTAL = DAILY.reduce((sum, d) => sum + d.human, 0);
const AI_PCT = Math.round((AI_TOTAL / (AI_TOTAL + HUMAN_TOTAL)) * 100);
const MAX_STACK = Math.max(...DAILY.map(d => d.ai + d.human));

// Trend line geometry. Stretched to fit by the viewBox.
const TREND_W = 300;
const TREND_H = 52;

export function AnalyticsPreview() {
  const { pick, isRTL } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.2 });

  const conversations = useCountUp(analyticsData.kpis.conversations.value, visible, 1800);
  const aiResolution = useCountUp(analyticsData.kpis.aiResolution.value, visible, 1500);
  const leads = useCountUp(analyticsData.kpis.leads.value, visible, 1400);
  const responseTime = useCountUp(analyticsData.kpis.responseTime.value, visible, 1200);
  const aiHandled = useCountUp(AI_TOTAL, visible, 1600);
  const humanHandled = useCountUp(HUMAN_TOTAL, visible, 1600);

  // `value` must stay a number — `format` is the only thing that turns it into
  // a string. Storing an already-formatted string here previously caused
  // `v.toFixed is not a function` and crashed the whole landing page.
  const kpis: Array<{
    value: number;
    label: string;
    suffix: string;
    format: (v: number) => string;
  }> = [
    { value: Math.round(conversations), label: pick('محادثة', 'Conversations'), suffix: '', format: v => v.toLocaleString('en-US') },
    { value: Math.round(aiResolution), label: pick('حلها الـ AI', 'Resolved by AI'), suffix: '%', format: v => `${v}` },
    { value: Math.round(leads), label: pick('عميل محتمل', 'Leads'), suffix: '', format: v => `${v}` },
    { value: responseTime, label: pick('متوسط الرد', 'Avg response'), suffix: pick('ث', 's'), format: v => v.toFixed(1) },
  ];

  // SVG ignores `direction`, so RTL has to be handled in the coordinates.
  const stepX = DAILY.length > 1 ? TREND_W / (DAILY.length - 1) : TREND_W;
  const trendPath = DAILY.map((d, i) => {
    const rawX = i * stepX;
    const x = isRTL ? TREND_W - rawX : rawX;
    const y = TREND_H - 6 - ((d.ai + d.human) / MAX_STACK) * (TREND_H - 12);
    return `${i === 0 ? 'M' : 'L'} ${round(x, 1)} ${round(y, 1)}`;
  }).join(' ');

  return (
    <div ref={ref} className="w-full max-w-2xl mx-auto">
      <div className="bg-app border border-app rounded-2xl shadow-medium p-5 sm:p-6 space-y-5">
        {/* 1 + 2 + 7 — cards slide in, then the figures count */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map((kpi, i) => (
            <div
              key={kpi.label}
              className="bg-subtle border border-app rounded-xl p-3.5 transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <div className="text-2xl font-bold text-main num">
                {kpi.format(kpi.value)}{kpi.suffix}
              </div>
              <div className="text-xs text-muted mt-0.5">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* 3 — the trend line draws itself */}
        <div className="bg-subtle border border-app rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2 gap-3">
            <span className="text-sm font-medium text-main">{pick('اتجاه المحادثات', 'Conversation trend')}</span>
            <span className="text-xs text-muted">{pick('آخر أسبوع', 'Last 7 days')}</span>
          </div>
          <svg
            viewBox={`0 0 ${TREND_W} ${TREND_H}`}
            className="w-full h-14 text-brand-500"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={trendPath}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: visible ? 0 : 1,
                transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1) 520ms',
              }}
            />
          </svg>
        </div>

        {/* 4 — bars grow upward. Flex rows already reverse under RTL. */}
        <div className="bg-subtle border border-app rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4 gap-3">
            <span className="text-sm font-medium text-main">{pick('المحادثات', 'Conversations')}</span>
            <div className="flex items-center gap-3 text-xs shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-brand-500" />
                <span className="text-muted">AI</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-accent-400" />
                <span className="text-muted">{pick('موظف', 'Human')}</span>
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {DAILY.map((d, i) => {
              const aiHeight = (d.ai / MAX_STACK) * 100;
              const humanHeight = (d.human / MAX_STACK) * 100;
              return (
                <div key={d.dayEn ?? d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex items-end justify-center gap-0.5 h-full">
                    <div
                      className="w-3 rounded-t bg-brand-500 transition-all duration-700 ease-smooth"
                      style={{
                        height: visible ? `${aiHeight}%` : '0%',
                        transitionDelay: `${i * 80 + 300}ms`,
                      }}
                    />
                    <div
                      className="w-3 rounded-t bg-accent-400 transition-all duration-700 ease-smooth"
                      style={{
                        height: visible ? `${humanHeight}%` : '0%',
                        transitionDelay: `${i * 80 + 450}ms`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-subtle">{pick(d.day, d.dayEn ?? d.day)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {/* 5 — channel distribution */}
          <div className="bg-subtle border border-app rounded-xl p-4">
            <div className="text-sm font-medium text-main mb-3">{pick('توزيع القنوات', 'By channel')}</div>
            <div className="space-y-2.5">
              {analyticsData.channelDistribution.map((row, i) => (
                <div key={row.channel} className="flex items-center gap-2.5">
                  <ChannelBadge channel={row.channel as ChannelType} size="sm" />
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all duration-700 ease-smooth"
                      style={{
                        width: visible ? `${row.percentage}%` : '0%',
                        transitionDelay: `${1000 + i * 90}ms`,
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-muted num w-8 text-end shrink-0">{row.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6 — AI vs team */}
          <div className="bg-subtle border border-app rounded-xl p-4">
            <div className="text-sm font-medium text-main mb-3">{pick('الـ AI مقابل الفريق', 'AI vs team')}</div>
            <div className="flex h-2 rounded-full bg-muted overflow-hidden mb-3">
              <div
                className="bg-brand-500 transition-all duration-700 ease-smooth"
                style={{ width: visible ? `${AI_PCT}%` : '0%', transitionDelay: '1350ms' }}
              />
              <div
                className="bg-accent-400 transition-all duration-700 ease-smooth"
                style={{ width: visible ? `${100 - AI_PCT}%` : '0%', transitionDelay: '1480ms' }}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="flex items-center gap-1.5 text-muted">
                  <span className="w-2.5 h-2.5 rounded-sm bg-brand-500 shrink-0" />
                  {pick('حلها الـ AI', 'Handled by AI')}
                </span>
                <span className="font-medium text-main num">{Math.round(aiHandled).toLocaleString('en-US')}</span>
              </div>
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="flex items-center gap-1.5 text-muted">
                  <span className="w-2.5 h-2.5 rounded-sm bg-accent-400 shrink-0" />
                  {pick('حلها الفريق', 'Handled by the team')}
                </span>
                <span className="font-medium text-main num">{Math.round(humanHandled).toLocaleString('en-US')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
