import { useReveal, useCountUp } from '@/lib/hooks';
import { useLang } from '@/lib/i18n';
import { analyticsData } from '@/lib/mockData';

export function AnalyticsPreview() {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.2 });

  const conversations = useCountUp(analyticsData.kpis.conversations.value, visible, 1800);
  const aiResolution = useCountUp(analyticsData.kpis.aiResolution.value, visible, 1500);
  const leads = useCountUp(analyticsData.kpis.leads.value, visible, 1400);
  const responseTime = useCountUp(analyticsData.kpis.responseTime.value, visible, 1200);

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

  const maxVal = Math.max(...analyticsData.daily.map(d => d.ai + d.human));

  return (
    <div ref={ref} className="w-full max-w-2xl mx-auto">
      <div className="bg-app border border-app rounded-2xl shadow-medium p-5 sm:p-6 space-y-5">
        {/* KPIs */}
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

        {/* Chart */}
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
            {analyticsData.daily.map((d, i) => {
              const aiHeight = (d.ai / maxVal) * 100;
              const humanHeight = (d.human / maxVal) * 100;
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
      </div>
    </div>
  );
}
