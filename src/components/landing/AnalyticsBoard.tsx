import { useLang } from '@/lib/i18n';
import { useScrollProgress, usePrefersReducedMotion } from '@/lib/hooks';
import { clamp01, easeOut, mapRange, round } from '@/lib/motion';
import { ChannelBadge, Eyebrow } from '@/components/ui';
import { analyticsData } from '@/lib/mockData';

/**
 * `value` stays numeric and `format` takes a number. Handing a
 * pre-formatted string to a numeric formatter is what produced
 * `v.toFixed is not a function` and a blank page earlier in this project.
 */
type Kpi = {
  ar: string;
  en: string;
  value: number;
  format: (v: number) => string;
  unitAr?: string;
  unitEn?: string;
};

const KPIS: Kpi[] = [
  {
    ar: 'محادثة',
    en: 'Conversations',
    value: 3842,
    format: v => Math.round(v).toLocaleString('en-US'),
  },
  { ar: 'حلها الـ AI', en: 'Resolved by AI', value: 86, format: v => `${Math.round(v)}%` },
  { ar: 'عميل محتمل', en: 'Leads', value: 337, format: v => Math.round(v).toLocaleString('en-US') },
  {
    ar: 'متوسط وقت الرد',
    en: 'Avg response',
    value: 1.8,
    format: v => v.toFixed(1),
    unitAr: 'د',
    unitEn: 'm',
  },
];

const W = 680;
const H = 168;
const PAD_X = 6;
const PAD_Y = 12;

/**
 * SVG has no notion of `direction`, so a right-to-left chart has to be
 * mirrored in coordinate space. The day labels below are laid out with normal
 * flex, which RTL already reverses, so the two line up.
 */
function buildPath(values: number[], max: number, isRTL: boolean) {
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_Y * 2;
  const last = values.length - 1;
  return values
    .map((v, i) => {
      const raw = PAD_X + (last === 0 ? innerW / 2 : (i / last) * innerW);
      const x = isRTL ? W - raw : raw;
      const y = PAD_Y + innerH - (v / max) * innerH;
      return `${i === 0 ? 'M' : 'L'}${round(x, 1)},${round(y, 1)}`;
    })
    .join(' ');
}

export function AnalyticsBoard() {
  const { pick, isRTL } = useLang();
  const reduced = usePrefersReducedMotion();
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    mode: 'through',
    disabled: reduced,
  });

  const p = reduced ? 1 : progress;

  // Driven straight off scroll rather than a one-shot counter: scrubbing back
  // rewinds instead of freezing, and nothing can re-trigger on re-entry.
  const count = easeOut(clamp01(mapRange(p, 0.14, 0.48, 0, 1)));
  const draw = easeOut(clamp01(mapRange(p, 0.24, 0.66, 0, 1)));
  const bars = easeOut(clamp01(mapRange(p, 0.42, 0.72, 0, 1)));

  const days = analyticsData.daily;
  const aiSeries = days.map(d => d.ai);
  const humanSeries = days.map(d => d.human);
  const max = Math.max(...aiSeries) * 1.12;

  return (
    <section id="analytics" ref={ref} className="py-section-sm sm:py-section">
      <div className="max-w-shell mx-auto px-5 sm:px-8">
        <div className="max-w-measure-lg">
          <Eyebrow index="05">{pick('النتائج', 'Results')}</Eyebrow>
          <h2 className="mt-5 text-display-2 font-semibold text-main">
            {pick('تشوف كل حاجة بتحصل.', 'See everything that happens.')}
          </h2>
        </div>

        {/* One surface. Not four cards. */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-app bg-elevated">
          <div className="flex items-center justify-between border-b border-app px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] font-medium text-main">
                {pick('نظرة عامة', 'Overview')}
              </span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-600 opacity-50 animate-ping dark:bg-brand-400" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />
              </span>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-app p-0.5">
              <span className="rounded-md bg-subtle px-2 py-1 text-[11px] font-medium text-main">
                {pick('آخر 7 أيام', 'Last 7 days')}
              </span>
              <span className="px-2 py-1 text-[11px] text-subtle">{pick('الشهر', 'Month')}</span>
            </div>
          </div>

          {/* KPI row: a snapping strip on phones, a divided row from sm up. */}
          <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto border-b border-app sm:grid sm:grid-cols-4 sm:divide-x sm:overflow-visible sm:rtl:divide-x-reverse">
            {KPIS.map(kpi => {
              const shown = kpi.value * count;
              const unit = kpi.unitAr ? pick(kpi.unitAr, kpi.unitEn ?? '') : '';
              return (
                <div
                  key={kpi.en}
                  className="min-w-[58%] shrink-0 snap-start border-app px-4 py-5 sm:min-w-0 sm:px-5"
                >
                  <div className="flex items-baseline gap-1">
                    <span className="num text-2xl font-semibold text-main sm:text-[28px]">
                      {kpi.format(shown)}
                    </span>
                    {unit && <span className="text-sm text-muted">{unit}</span>}
                  </div>
                  <div className="mt-1.5 text-xs text-muted">{pick(kpi.ar, kpi.en)}</div>
                </div>
              );
            })}
          </div>

          {/* Chart */}
          <div className="px-4 pt-5 sm:px-5">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                <span className="h-0.5 w-3.5 rounded-full bg-brand-600 dark:bg-brand-400" />
                {pick('الـ AI', 'AI')}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                <span className="h-0.5 w-3.5 rounded-full bg-ink-400" />
                {pick('الفريق', 'Team')}
              </span>
            </div>

            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mt-3 h-[168px] w-full"
              preserveAspectRatio="none"
              role="img"
              aria-label={pick('المحادثات آخر 7 أيام', 'Conversations over the last 7 days')}
            >
              {[0.25, 0.5, 0.75].map(fraction => (
                <line
                  key={fraction}
                  x1={0}
                  x2={W}
                  y1={round(PAD_Y + (H - PAD_Y * 2) * fraction, 1)}
                  y2={round(PAD_Y + (H - PAD_Y * 2) * fraction, 1)}
                  stroke="var(--border)"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              <path
                d={buildPath(humanSeries, max, isRTL)}
                fill="none"
                stroke="var(--text-subtle)"
                strokeWidth={1.5}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={round(1 - draw, 3)}
              />
              <path
                d={buildPath(aiSeries, max, isRTL)}
                fill="none"
                stroke="var(--brand)"
                strokeWidth={2}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={round(1 - draw, 3)}
              />
            </svg>

            <div className="mt-2 flex justify-between pb-4 text-[10px] text-subtle">
              {days.map(day => (
                <span key={day.dayEn}>{pick(day.day, day.dayEn)}</span>
              ))}
            </div>
          </div>

          {/* Channel distribution */}
          <div className="border-t border-app px-4 py-4 sm:px-5">
            <div className="space-y-3">
              {analyticsData.channelDistribution.map(row => (
                <div key={row.channel} className="flex items-center gap-3">
                  <ChannelBadge channel={row.channel} />
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand-600 dark:bg-brand-400"
                      style={{ width: `${round(row.percentage * bars, 2)}%` }}
                    />
                  </div>
                  <span className="num w-9 text-end text-[11px] text-muted">
                    {round(row.percentage * bars)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
