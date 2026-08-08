import { useState } from 'react';
import { Check, X, Loader, Link2, Zap, Shield } from 'lucide-react';
import { Card, Button, Badge, StatusDot, ChannelBadge } from '@/components/ui';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { integrations } from '@/lib/mockData';

const connectionSteps = [
  'Connecting',
  'Authenticating',
  'Syncing',
  'Configuring AI',
  'Connected',
];

export function Integrations() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardIntegration, setWizardIntegration] = useState<typeof integrations[0] | null>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const [connectStep, setConnectStep] = useState(-1);
  const reduced = usePrefersReducedMotion();

  const openWizard = (integration: typeof integrations[0]) => {
    setWizardIntegration(integration);
    setWizardStep(0);
    setWizardOpen(true);
  };

  const nextStep = () => {
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
    } else {
      // Start connecting animation
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
      }, connectionSteps.length * 900 + 500);
    }
  };

  const wizardSteps = [
    { title: 'Connect your account', desc: 'Sign in to your account to get started.' },
    { title: 'Choose your business', desc: 'Select the business profile you want to connect.' },
    { title: 'Allow Wazly to manage conversations', desc: 'Wazly needs permission to read and reply to customer messages.' },
    { title: 'Almost there\u2026', desc: 'Review your settings and connect.' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-main">Integrations</h2>
        <p className="text-sm text-muted mt-1">Connect your channels and tools to Wazly.</p>
      </div>

      {/* Connected channels summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {integrations.filter(i => i.channel).map(integ => (
          <Card key={integ.id} className="p-4" hover>
            <div className="flex items-center justify-between mb-2">
              {integ.channel && <ChannelBadge channel={integ.channel} size="md" />}
              <StatusDot status={integ.connected ? 'connected' : 'warning'} />
            </div>
            <div className="text-sm font-semibold text-main">{integ.name}</div>
            <div className="text-xs text-muted mt-0.5">{integ.connected ? 'Connected' : 'Not connected'}</div>
          </Card>
        ))}
      </div>

      {/* All integrations */}
      <div className="grid md:grid-cols-2 gap-4">
        {integrations.map(integ => (
          <Card key={integ.id} className="p-5" hover>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                {integ.channel ? (
                  <ChannelBadge channel={integ.channel} size="md" />
                ) : (
                  <Link2 className="w-5 h-5 text-muted" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-main">{integ.name}</span>
                  {integ.connected && <Badge variant="success" size="xs">Connected</Badge>}
                </div>
                <p className="text-xs text-muted mt-1">{integ.description}</p>
                <div className="mt-3">
                  {integ.connected ? (
                    <Button variant="outline" size="sm">Configure</Button>
                  ) : (
                    <Button size="sm" onClick={() => openWizard(integ)}>
                      <Zap className="w-3.5 h-3.5" /> Connect
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Wizard modal */}
      {wizardOpen && wizardIntegration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 animate-fade-in"
          onClick={() => !connecting && setWizardOpen(false)}
        >
          <div
            className="bg-app border border-app rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-app">
              <div className="flex items-center gap-2">
                {wizardIntegration.channel && <ChannelBadge channel={wizardIntegration.channel} size="sm" />}
                <span className="text-sm font-semibold text-main">Connect {wizardIntegration.name}</span>
              </div>
              {!connecting && (
                <button onClick={() => setWizardOpen(false)} className="text-muted hover:text-main transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-6">
              {!connecting ? (
                <>
                  {/* Step indicator */}
                  <div className="flex items-center gap-2 mb-6">
                    {wizardSteps.map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                          i <= wizardStep ? 'bg-brand-500' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-xs text-brand font-medium mb-2">Step {wizardStep + 1} of 4</div>
                    <h3 className="text-lg font-semibold text-main">{wizardSteps[wizardStep].title}</h3>
                    <p className="text-sm text-muted mt-1">{wizardSteps[wizardStep].desc}</p>
                  </div>

                  {/* Mock UI per step */}
                  <div className="bg-subtle border border-app rounded-xl p-4 mb-6 min-h-[80px] flex items-center justify-center">
                    {wizardStep === 0 && (
                      <div className="w-full space-y-2 animate-fade-in">
                        <div className="h-10 rounded-lg bg-muted flex items-center px-3 text-sm text-subtle">you@example.com</div>
                        <div className="h-10 rounded-lg bg-muted flex items-center px-3 text-sm text-subtle">\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022</div>
                      </div>
                    )}
                    {wizardStep === 1 && (
                      <div className="w-full space-y-2 animate-fade-in">
                        {['My Business', 'Second Location', 'Test Store'].map((b, i) => (
                          <div key={b} className={`h-10 rounded-lg border flex items-center px-3 text-sm ${i === 0 ? 'border-brand-500 bg-brand-bg text-brand' : 'border-app text-muted'}`}>
                            {i === 0 && <Check className="w-4 h-4 mr-2" />}{b}
                          </div>
                        ))}
                      </div>
                    )}
                    {wizardStep === 2 && (
                      <div className="w-full space-y-2 animate-fade-in">
                        {['Read messages', 'Send replies', 'Manage conversations'].map(p => (
                          <div key={p} className="flex items-center gap-2 text-sm text-main">
                            <Check className="w-4 h-4 text-brand" /> {p}
                          </div>
                        ))}
                      </div>
                    )}
                    {wizardStep === 3 && (
                      <div className="text-center animate-fade-in">
                        <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center mx-auto mb-2">
                          <Shield className="w-6 h-6 text-brand" />
                        </div>
                        <div className="text-sm text-muted">Ready to connect securely</div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {wizardStep > 0 && (
                      <Button variant="outline" size="md" className="flex-1" onClick={() => setWizardStep(wizardStep - 1)}>Back</Button>
                    )}
                    <Button size="md" className="flex-1" onClick={nextStep}>
                      {wizardStep < 3 ? 'Continue' : `Connect ${wizardIntegration.name}`}
                    </Button>
                  </div>
                </>
              ) : (
                /* Connecting animation */
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
                            connectStep >= i ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-2'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                            done ? 'bg-brand-600 dark:bg-brand-500'
                            : current ? 'bg-brand-600 dark:bg-brand-500'
                            : 'bg-muted'
                          }`}>
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
                            <span className="flex gap-1 ml-1">
                              <span className="typing-dot" style={{ width: 4, height: 4 }} />
                              <span className="typing-dot" style={{ width: 4, height: 4 }} />
                              <span className="typing-dot" style={{ width: 4, height: 4 }} />
                            </span>
                          )}
                          {done && isLast && (
                            <Badge variant="success" size="xs">Connected</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {connectStep >= connectionSteps.length - 1 && (
                    <div className="mt-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 animate-fade-in-up">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-green-700 dark:text-green-400">{wizardIntegration.name} Connected</div>
                        <div className="text-xs text-green-600 dark:text-green-500">AI is now handling conversations on this channel.</div>
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
