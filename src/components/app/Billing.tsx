import { useState } from 'react';
import { CreditCard, TrendingUp, Check, ArrowRight, Zap, X } from 'lucide-react';
import { Card, Button, Badge, ProgressBar } from '@/components/ui';
import { useReveal, useCountUp, usePrefersReducedMotion } from '@/lib/hooks';
import { pricingPlans } from '@/lib/mockData';

export function Billing() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const reduced = usePrefersReducedMotion();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Growth');
  const [upgrading, setUpgrading] = useState(false);

  const usageCount = useCountUp(8240, visible, 1500);
  const limit = 10000;
  const pct = (Math.round(usageCount) / limit) * 100;

  const usageState = pct >= 100 ? 'full' : pct >= 90 ? 'critical' : pct >= 80 ? 'warning' : 'normal';

  const usageColor: 'brand' | 'amber' | 'red' =
    usageState === 'full' || usageState === 'critical' ? 'red'
    : usageState === 'warning' ? 'amber'
    : 'brand';

  const usageMessage =
    usageState === 'full' ? 'Plan limit reached'
    : usageState === 'critical' ? 'Consider upgrading your plan'
    : usageState === 'warning' ? "You're approaching your plan limit"
    : 'Usage is within normal range';

  const handleUpgrade = () => {
    setUpgrading(true);
    setTimeout(() => {
      setUpgrading(false);
      setUpgradeOpen(false);
    }, reduced ? 200 : 1800);
  };

  return (
    <div ref={ref} className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-main">Billing & Usage</h2>
        <p className="text-sm text-muted mt-1">Monitor your usage and manage your plan.</p>
      </div>

      {/* Current plan */}
      <Card className="p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-muted">Current Plan</span>
              <Badge variant="brand" size="xs">Active</Badge>
            </div>
            <div className="text-2xl font-bold text-main">Growth</div>
            <div className="text-sm text-muted mt-1">999 EGP/month \u00b7 Renews on Sep 8, 2026</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Manage payment</Button>
            <Button size="sm" onClick={() => setUpgradeOpen(true)}>
              <Zap className="w-3.5 h-3.5" /> Upgrade
            </Button>
          </div>
        </div>
      </Card>

      {/* Usage */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand" />
            <span className="text-sm font-semibold text-main">AI Conversations</span>
          </div>
          <span className="text-xs text-muted">Resets monthly</span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-bold text-main tabular-nums count-up">{Math.round(usageCount).toLocaleString()}</span>
          <span className="text-sm text-muted">/ {limit.toLocaleString()}</span>
        </div>
        <ProgressBar value={pct} color={usageColor} animated className="mb-3" />
        <div className={`flex items-center gap-2 text-sm ${
          usageState === 'normal' ? 'text-muted' :
          usageState === 'warning' ? 'text-amber-600 dark:text-amber-400' :
          'text-red-600 dark:text-red-400'
        }`}>
          {usageState !== 'normal' && (
            <div className={`w-2 h-2 rounded-full ${usageState === 'full' || usageState === 'critical' ? 'bg-red-500 animate-pulse-dot' : 'bg-amber-500 animate-pulse-dot'}`} />
          )}
          <span>{usageMessage}</span>
        </div>
        {usageState !== 'normal' && (
          <Button size="sm" className="mt-3" onClick={() => setUpgradeOpen(true)}>
            Upgrade plan <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </Card>

      {/* Usage breakdown */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'AI Responses', value: Math.round(usageCount * 0.87), total: limit, color: 'brand' as const },
          { label: 'Human Handoffs', value: 240, total: 500, color: 'brand' as const },
          { label: 'Leads Captured', value: 342, total: 1000, color: 'green' as const },
        ].map(item => (
          <Card key={item.label} className="p-4" hover>
            <div className="text-xs text-muted mb-1">{item.label}</div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-xl font-bold text-main tabular-nums">{item.value.toLocaleString()}</span>
              <span className="text-xs text-muted">/ {item.total.toLocaleString()}</span>
            </div>
            <ProgressBar value={(item.value / item.total) * 100} color={item.color} animated />
          </Card>
        ))}
      </div>

      {/* Billing history */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-brand" />
          <span className="text-sm font-semibold text-main">Billing History</span>
        </div>
        <div className="space-y-2">
          {[
            { date: 'Aug 8, 2026', amount: '999 EGP', plan: 'Growth', status: 'Paid' },
            { date: 'Jul 8, 2026', amount: '999 EGP', plan: 'Growth', status: 'Paid' },
            { date: 'Jun 8, 2026', amount: '499 EGP', plan: 'Starter', status: 'Paid' },
          ].map(inv => (
            <div key={inv.date} className="flex items-center justify-between py-2 border-b border-app last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-muted" />
                </div>
                <div>
                  <div className="text-sm font-medium text-main">{inv.plan} \u00b7 {inv.amount}</div>
                  <div className="text-xs text-subtle">{inv.date}</div>
                </div>
              </div>
              <Badge variant="success" size="xs">{inv.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Upgrade modal */}
      {upgradeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 animate-fade-in" onClick={() => !upgrading && setUpgradeOpen(false)}>
          <div className="bg-app border border-app rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-app">
              <span className="text-sm font-semibold text-main">Choose a plan</span>
              {!upgrading && (
                <button onClick={() => setUpgradeOpen(false)} className="text-muted hover:text-main transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="p-6">
              {!upgrading ? (
                <>
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    {pricingPlans.slice(0, 3).map(plan => (
                      <div
                        key={plan.name}
                        onClick={() => setSelectedPlan(plan.name)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          selectedPlan === plan.name
                            ? 'border-brand-500 ring-1 ring-brand-500/20 bg-brand-bg'
                            : 'border-app hover:border-strong'
                        } ${plan.highlighted ? 'ring-1 ring-brand-500/10' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-main">{plan.name}</span>
                          {plan.highlighted && <Badge variant="brand" size="xs">Popular</Badge>}
                        </div>
                        <div className="flex items-baseline gap-1 mb-3">
                          <span className="text-2xl font-bold text-main">{plan.price?.toLocaleString()}</span>
                          <span className="text-xs text-muted">{plan.period}</span>
                        </div>
                        <ul className="space-y-1.5">
                          {plan.features.slice(0, 3).map(f => (
                            <li key={f} className="flex items-start gap-1.5 text-xs text-muted">
                              <Check className="w-3 h-3 text-brand shrink-0 mt-0.5" />{f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-subtle mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted">From</span>
                      <span className="font-medium text-main">Growth</span>
                      <ArrowRight className="w-3.5 h-3.5 text-brand" />
                      <span className="font-semibold text-brand">{selectedPlan}</span>
                    </div>
                  </div>
                  <Button size="lg" className="w-full" onClick={handleUpgrade}>
                    Upgrade to {selectedPlan}
                  </Button>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-bg flex items-center justify-center mx-auto mb-4">
                    {!reduced && <div className="w-7 h-7 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />}
                  </div>
                  <div className="text-sm font-semibold text-main">Upgrading to {selectedPlan}\u2026</div>
                  <div className="text-xs text-muted mt-1">Updating your plan and limits</div>
                </div>
              )}
              {upgrading && (
                <div className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 animate-fade-in-up">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">Plan upgraded successfully!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
