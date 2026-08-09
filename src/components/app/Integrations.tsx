import { useState } from 'react';
import { Check, X, Loader, Link2, Zap, Shield } from 'lucide-react';
import { Card, Button, Badge, StatusDot, ChannelBadge } from '@/components/ui';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { useLang } from '@/lib/i18n';
import { integrations } from '@/lib/mockData';

type Integration = typeof integrations[0];

export function Integrations() {
  const { pick } = useLang();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardIntegration, setWizardIntegration] = useState<Integration | null>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const [connectStep, setConnectStep] = useState(-1);
  const reduced = usePrefersReducedMotion();

  const connectionSteps = pick(
    ['بنتصل', 'بنتحقق من الحساب', 'بنزامن البيانات', 'بنظبط الـ AI', 'اتوصل'],
    ['Connecting', 'Authenticating', 'Syncing', 'Configuring AI', 'Connected'],
  );

  const wizardSteps = [
    {
      title: pick('اربط حسابك', 'Connect your account'),
      desc: pick('سجّل دخول بحسابك عشان نبدأ.', 'Sign in to your account to get started.'),
    },
    {
      title: pick('اختار الفرع', 'Choose your business'),
      desc: pick('اختار الحساب اللي عايز تربطه.', 'Select the business profile to connect.'),
    },
    {
      title: pick('اسمح لـ Wazly يدير المحادثات', 'Allow Wazly to manage conversations'),
      desc: pick('Wazly محتاج صلاحية يقرا ويرد على رسائل عملائك.', 'Wazly needs permission to read and reply to messages.'),
    },
    {
      title: pick('فاضل خطوة…', 'Almost there…'),
      desc: pick('راجع الإعدادات واضغط اتصال.', 'Review your settings and connect.'),
    },
  ];

  const openWizard = (integration: Integration) => {
    setWizardIntegration(integration);
    setWizardStep(0);
    setWizardOpen(true);
  };

  const nextStep = () => {
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
      return;
    }

    setConnecting(true);
    setConnectStep(0);

    if (reduced) {
      setConnectStep(connectionSteps.length - 1);
      setTimeout(() => {
        setConnecting(false);
        setConnectStep(-1);
        setWizardOpen(false);
      }, 500);
      return;
    }

    for (let i = 1; i < connectionSteps.length; i++) {
      setTimeout(() => setConnectStep(i), i * 900);
    }
    setTimeout(() => {
      setConnecting(false);
      setConnectStep(-1);
      setWizardOpen(false);
    }, connectionSteps.length * 900 + 800);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-main">{pick('الربط والتكاملات', 'Integrations')}</h2>
        <p className="text-sm text-muted mt-1">
          {pick('اربط قنواتك وأدواتك بـ Wazly.', 'Connect your channels and tools to Wazly.')}
        </p>
      </div>

      {/* Channel summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {integrations.filter(i => i.channel).map(integ => (
          <Card key={integ.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              {integ.channel && <ChannelBadge channel={integ.channel} size="md" />}
              <StatusDot status={integ.connected ? 'connected' : 'warning'} />
            </div>
            {/* Brand names are never translated, hence font-latin in both languages */}
            <div className="text-sm font-semibold text-main font-latin">{integ.name}</div>
            <div className="text-xs text-muted mt-0.5">
              {integ.connected ? pick('متوصّل', 'Connected') : pick('مش متوصّل', 'Not connected')}
            </div>
          </Card>
        ))}
      </div>

      {/* All integrations */}
      <div className="grid md:grid-cols-2 gap-4">
        {integrations.map(integ => (
          <Card key={integ.id} className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                {integ.channel ? <ChannelBadge channel={integ.channel} size="md" /> : <Link2 className="w-5 h-5 text-muted" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-main font-latin">{integ.name}</span>
                  {integ.connected && <Badge variant="success" size="xs">{pick('متوصّل', 'Connected')}</Badge>}
                </div>
                <p className="text-xs text-muted mt-1 leading-[1.8]">
                  {pick(integ.description, integ.descriptionEn)}
                </p>
                <div className="mt-3">
                  {integ.connected ? (
                    <Button variant="outline" size="sm">{pick('إعدادات', 'Configure')}</Button>
                  ) : (
                    <Button size="sm" onClick={() => openWizard(integ)}>
                      <Zap className="w-3.5 h-3.5" /> {pick('اربط', 'Connect')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Wizard */}
      {wizardOpen && wizardIntegration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 animate-fade-in"
          onClick={() => !connecting && setWizardOpen(false)}
        >
          <div
            className="bg-app border border-app rounded-2xl shadow-large w-full max-w-md overflow-hidden animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-app gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {wizardIntegration.channel && <ChannelBadge channel={wizardIntegration.channel} size="sm" />}
                <span className="text-sm font-semibold text-main truncate">
                  {pick(`ربط ${wizardIntegration.name}`, `Connect ${wizardIntegration.name}`)}
                </span>
              </div>
              {!connecting && (
                <button
                  onClick={() => setWizardOpen(false)}
                  className="text-muted hover:text-main transition-colors shrink-0"
                  aria-label={pick('إغلاق', 'Close')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="p-5 sm:p-6">
              {!connecting ? (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    {wizardSteps.map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-colors duration-300 ${i <= wizardStep ? 'bg-brand-500' : 'bg-muted'}`}
                      />
                    ))}
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-xs text-brand font-medium mb-2">
                      {pick(`خطوة ${wizardStep + 1} من 4`, `Step ${wizardStep + 1} of 4`)}
                    </div>
                    <h3 className="text-lg font-semibold text-main">{wizardSteps[wizardStep].title}</h3>
                    <p className="text-sm text-muted mt-1 leading-[1.8]">{wizardSteps[wizardStep].desc}</p>
                  </div>

                  <div className="bg-subtle border border-app rounded-xl p-4 mb-6 min-h-[80px] flex items-center justify-center">
                    {wizardStep === 0 && (
                      <div className="w-full space-y-2 animate-fade-in">
                        <div className="h-10 rounded-lg bg-muted flex items-center px-3 text-sm text-subtle force-ltr text-start">
                          sales@elkayan.com
                        </div>
                        <div className="h-10 rounded-lg bg-muted flex items-center px-3 text-sm text-subtle tracking-widest">
                          ••••••••
                        </div>
                      </div>
                    )}
                    {wizardStep === 1 && (
                      <div className="w-full space-y-2 animate-fade-in">
                        {pick(
                          ['المقر الرئيسي', 'فرع التجمع الخامس', 'معرض المهندسين'],
                          ['Head office', 'Fifth Settlement branch', 'Mohandessin showroom'],
                        ).map((b, i) => (
                          <div
                            key={b}
                            className={`h-10 rounded-lg border flex items-center px-3 text-sm ${
                              i === 0 ? 'border-brand-500 bg-brand-bg text-brand' : 'border-app text-muted'
                            }`}
                          >
                            {i === 0 && <Check className="w-4 h-4 me-2 shrink-0" />}{b}
                          </div>
                        ))}
                      </div>
                    )}
                    {wizardStep === 2 && (
                      <div className="w-full space-y-2 animate-fade-in">
                        {pick(
                          ['قراءة الرسائل', 'إرسال الردود', 'إدارة المحادثات'],
                          ['Read messages', 'Send replies', 'Manage conversations'],
                        ).map(p => (
                          <div key={p} className="flex items-center gap-2 text-sm text-main">
                            <Check className="w-4 h-4 text-brand shrink-0" /> {p}
                          </div>
                        ))}
                      </div>
                    )}
                    {wizardStep === 3 && (
                      <div className="text-center animate-fade-in">
                        <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center mx-auto mb-2">
                          <Shield className="w-6 h-6 text-brand" />
                        </div>
                        <div className="text-sm text-muted">{pick('جاهز للربط بأمان', 'Ready to connect securely')}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {wizardStep > 0 && (
                      <Button variant="outline" size="md" className="flex-1" onClick={() => setWizardStep(wizardStep - 1)}>
                        {pick('رجوع', 'Back')}
                      </Button>
                    )}
                    <Button size="md" className="flex-1" onClick={nextStep}>
                      {wizardStep < 3
                        ? pick('يلا نكمل', 'Continue')
                        : pick(`اربط ${wizardIntegration.name}`, `Connect ${wizardIntegration.name}`)}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-4">
                  <div className="space-y-3">
                    {connectionSteps.map((step, i) => {
                      const done = connectStep > i;
                      const current = connectStep === i;
                      const isLast = i === connectionSteps.length - 1;
                      return (
                        <div
                          key={step}
                          className={`flex items-center gap-3 transition-all duration-300 ${
                            connectStep >= i ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-1'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0 ${
                              done || current ? 'bg-brand-600 dark:bg-brand-500' : 'bg-muted'
                            }`}
                          >
                            {done || (current && isLast) ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : current ? (
                              <Loader className="w-4 h-4 text-white animate-spin" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-subtle" />
                            )}
                          </div>
                          <span className={`text-sm ${current || done ? 'text-main font-medium' : 'text-subtle'}`}>{step}</span>
                          {current && !isLast && (
                            <span className="flex gap-1 ms-1">
                              <span className="typing-dot" style={{ width: 4, height: 4 }} />
                              <span className="typing-dot" style={{ width: 4, height: 4 }} />
                              <span className="typing-dot" style={{ width: 4, height: 4 }} />
                            </span>
                          )}
                          {done && isLast && <Badge variant="success" size="xs">{pick('اتوصّل', 'Connected')}</Badge>}
                        </div>
                      );
                    })}
                  </div>

                  {connectStep >= connectionSteps.length - 1 && (
                    <div className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 animate-fade-in-up">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-green-700 dark:text-green-400">
                          {pick(`تم ربط ${wizardIntegration.name}`, `${wizardIntegration.name} connected`)}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-500">
                          {pick('الـ AI بقى بيتعامل مع محادثات القناة دي.', 'AI is now handling conversations on this channel.')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
