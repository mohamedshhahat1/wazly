import { useState } from 'react';
import { CreditCard, TrendingUp, Check, ArrowRight, Zap, X } from 'lucide-react';
import { Card, Button, Badge, ProgressBar } from '@/components/ui';
import { useReveal, useCountUp, usePrefersReducedMotion } from '@/lib/hooks';
import { useLang } from '@/lib/i18n';
import { pricingPlans } from '@/lib/mockData';

export function Billing() {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const reduced = usePrefersReducedMotion();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Growth');
  const [phase, setPhase] = useState<'idle' | 'pending' | 'done'>('idle');

  const usageCount = useCountUp(8240, visible, 1500);
  const limit = 10000;
  const pct = (Math.round(usageCount) / limit) * 100;

  const usageState = pct >= 100 ? 'full' : pct >= 90 ? 'critical' : pct >= 80 ? 'warning' : 'normal';

  const usageColor: 'brand' | 'amber' | 'red' =
    usageState === 'full' || usageState === 'critical' ? 'red'
      : usageState === 'warning' ? 'amber'
        : 'brand';

  const usageMessage =
    usageState === 'full' ? pick('وصلت لحد الباقة', 'Plan limit reached')
      : usageState === 'critical' ? pick('يفضل ترفّع الباقة', 'Consider upgrading')
        : usageState === 'warning' ? pick('قرّبت توصل لحد الباقة', "You're close to your limit")
          : pick('الاستخدام طبيعي', 'Usage is normal');

  const selectedPlanLabel = (() => {
    const plan = pricingPlans.find(p => p.nameEn === selectedPlan);
    return plan ? pick(plan.name, plan.nameEn) : selectedPlan;
  })();

  const handleUpgrade = () => {
    setPhase('pending');
    setTimeout(() => setPhase('done'), reduced ? 200 : 1600);
    setTimeout(() => {
      setPhase('idle');
      setUpgradeOpen(false);
    }, reduced ? 600 : 3000);
  };

  const busy = phase !== 'idle';
  const currency = pick('ج.م', 'EGP');

  return (
    <div ref={ref} className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-main">{pick('الفواتير والاستخدام', 'Billing & usage')}</h2>
        <p className="text-sm text-muted mt-1">
          {pick('تابع استهلاكك وادير باقتك.', 'Monitor your usage and manage your plan.')}
        </p>
      </div>

      {/* Current plan */}
      <Card className="p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-muted">{pick('باقتك الحالية', 'Current plan')}</span>
              <Badge variant="brand" size="xs">{pick('فعّالة', 'Active')}</Badge>
            </div>
            <div className="text-2xl font-bold text-main">{pick('النمو', 'Growth')}</div>
            <div className="text-sm text-muted mt-1">
              <span className="num">999</span> {currency}
              {pick(' / الشهر', '/month')} ·{' '}
              {pick('بيتجدد 8 سبتمبر 2026', 'Renews on Sep 8, 2026')}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">{pick('إدارة الدفع', 'Manage payment')}</Button>
            <Button size="sm" onClick={() => setUpgradeOpen(true)}>
              <Zap className="w-3.5 h-3.5" /> {pick('رفّع الباقة', 'Upgrade')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Usage */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3 gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand flip-rtl" />
            <span className="text-sm font-semibold text-main">{pick('محادثات الـ AI', 'AI conversations')}</span>
          </div>
          <span className="text-xs text-muted shrink-0">{pick('بيتصفر كل شهر', 'Resets monthly')}</span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-bold text-main num">{Math.round(usageCount).toLocaleString('en-US')}</span>
          <span className="text-sm text-muted num">/ {limit.toLocaleString('en-US')}</span>
        </div>
        <ProgressBar value={pct} color={usageColor} animated className="mb-3" />
        <div className={`flex items-center gap-2 text-sm ${
          usageState === 'normal' ? 'text-muted'
            : usageState === 'warning' ? 'text-amber-600 dark:text-amber-400'
              : 'text-red-600 dark:text-red-400'
        }`}>
          {usageState !== 'normal' && (
            <div className={`w-2 h-2 rounded-full shrink-0 ${
              usageState === 'full' || usageState === 'critical' ? 'bg-red-500' : 'bg-amber-500'
            }`} />
          )}
          <span>{usageMessage}</span>
        </div>
        {usageState !== 'normal' && (
          <Button size="sm" className="mt-3" onClick={() => setUpgradeOpen(true)}>
            {pick('رفّع الباقة', 'Upgrade plan')} <ArrowRight className="w-3.5 h-3.5 flip-rtl" />
          </Button>
        )}
      </Card>

      {/* Breakdown */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: pick('ردود الـ AI', 'AI responses'), value: Math.round(usageCount * 0.87), total: limit, color: 'brand' as const },
          { label: pick('تحويل لموظف', 'Handed to a person'), value: 240, total: 500, color: 'brand' as const },
          { label: pick('عملاء محتملين', 'Leads captured'), value: 342, total: 1000, color: 'green' as const },
        ].map(item => (
          <Card key={item.label} className="p-4">
            <div className="text-xs text-muted mb-1">{item.label}</div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-xl font-bold text-main num">{item.value.toLocaleString('en-US')}</span>
              <span className="text-xs text-muted num">/ {item.total.toLocaleString('en-US')}</span>
            </div>
            <ProgressBar value={(item.value / item.total) * 100} color={item.color} animated />
          </Card>
        ))}
      </div>

      {/* History */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-muted" />
          <span className="text-sm font-semibold text-main">{pick('سجل الفواتير', 'Billing history')}</span>
        </div>
        <div className="space-y-2">
          {[
            { date: pick('8 أغسطس 2026', 'Aug 8, 2026'), amount: 999, plan: pick('النمو', 'Growth') },
            { date: pick('8 يوليو 2026', 'Jul 8, 2026'), amount: 999, plan: pick('النمو', 'Growth') },
            { date: pick('8 يونيو 2026', 'Jun 8, 2026'), amount: 499, plan: pick('البداية', 'Starter') },
          ].map(inv => (
            <div key={inv.date} className="flex items-center justify-between gap-3 py-2 border-b border-app last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4 text-muted" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-main truncate">
                    {inv.plan} · <span className="num">{inv.amount}</span> {currency}
                  </div>
                  <div className="text-xs text-subtle">{inv.date}</div>
                </div>
              </div>
              <Badge variant="success" size="xs">{pick('اتدفعت', 'Paid')}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Upgrade modal */}
      {upgradeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 animate-fade-in"
          onClick={() => !busy && setUpgradeOpen(false)}
        >
          <div
            className="bg-app border border-app rounded-2xl shadow-large w-full max-w-2xl overflow-hidden animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-app">
              <span className="text-sm font-semibold text-main">{pick('اختار باقة', 'Choose a plan')}</span>
              {!busy && (
                <button
                  onClick={() => setUpgradeOpen(false)}
                  className="text-muted hover:text-main transition-colors"
                  aria-label={pick('إغلاق', 'Close')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="p-5 sm:p-6">
              {phase === 'idle' && (
                <>
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    {pricingPlans.slice(0, 3).map(plan => (
                      <div
                        key={plan.nameEn}
                        onClick={() => setSelectedPlan(plan.nameEn)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          selectedPlan === plan.nameEn
                            ? 'border-brand-500 bg-brand-bg'
                            : 'border-app hover:border-strong'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <span className="text-sm font-semibold text-main">{pick(plan.name, plan.nameEn)}</span>
                          {plan.highlighted && <Badge variant="brand" size="xs">{pick('الأكتر اختيارًا', 'Popular')}</Badge>}
                        </div>
                        <div className="flex items-baseline gap-1 mb-3">
                          <span className="text-2xl font-bold text-main num">{plan.price?.toLocaleString('en-US')}</span>
                          <span className="text-xs text-muted">{pick(plan.period, plan.periodEn)}</span>
                        </div>
                        <ul className="space-y-1.5">
                          {pick(plan.features, plan.featuresEn).slice(0, 3).map(f => (
                            <li key={f} className="flex items-start gap-1.5 text-xs text-muted">
                              <Check className="w-3 h-3 text-brand shrink-0 mt-0.5" />{f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-subtle mb-4 text-sm">
                    <span className="text-muted">{pick('من', 'From')}</span>
                    <span className="font-medium text-main">{pick('النمو', 'Growth')}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand flip-rtl" />
                    <span className="font-semibold text-brand">{selectedPlanLabel}</span>
                  </div>

                  <Button size="lg" className="w-full" onClick={handleUpgrade}>
                    {pick(`رفّع لباقة ${selectedPlanLabel}`, `Upgrade to ${selectedPlanLabel}`)}
                  </Button>
                </>
              )}

              {phase === 'pending' && (
                <div className="py-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-bg flex items-center justify-center mx-auto mb-4">
                    {!reduced && <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />}
                  </div>
                  <div className="text-sm font-semibold text-main">
                    {pick(`بنرفّع لباقة ${selectedPlanLabel}…`, `Upgrading to ${selectedPlanLabel}…`)}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {pick('بنحدّث باقتك وحدودها', 'Updating your plan and limits')}
                  </div>
                </div>
              )}

              {phase === 'done' && (
                <div className="py-8 flex flex-col items-center gap-3 animate-fade-in-up">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-950/20 flex items-center justify-center">
                    <Check className="w-7 h-7 text-green-500" />
                  </div>
                  <div className="text-sm font-semibold text-main">
                    {pick('تم رفع الباقة', 'Plan upgraded')}
                  </div>
                  <div className="text-xs text-muted">
                    {pick(`باقتك دلوقتي ${selectedPlanLabel}`, `You're now on ${selectedPlanLabel}`)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
