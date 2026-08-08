import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/lib/theme';
import { LanguageProvider, useLang } from '@/lib/i18n';
import { LandingPage } from '@/components/landing/LandingPage';
import { AppShell, type AppView } from '@/components/app/AppShell';
import { Overview } from '@/components/app/Overview';
import { LiveInbox } from '@/components/app/LiveInbox';
import { AIPlayground } from '@/components/app/AIPlayground';
import { Analytics } from '@/components/app/Analytics';
import { Integrations } from '@/components/app/Integrations';
import { Knowledge } from '@/components/app/Knowledge';
import { LeadQualification } from '@/components/app/LeadQualification';
import { Billing } from '@/components/app/Billing';
import { Onboarding } from '@/components/app/Onboarding';
import { Customers } from '@/components/app/Customers';
import { Team } from '@/components/app/Team';
import { useLocalStorage } from '@/lib/hooks';

type AppState = 'landing' | 'onboarding' | 'app';

/**
 * Split out so it can read from the language context, which App itself sits
 * above.
 */
function LeadsView() {
  const { t } = useLang();

  return (
    <div className="p-6 space-y-5 max-w-3xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-main">{t('leads.title')}</h2>
        <p className="text-sm text-muted mt-1">{t('leads.sub')}</p>
      </div>
      <LeadQualification />
    </div>
  );
}

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [view, setView] = useState<AppView>('overview');
  const [onboardingComplete, setOnboardingComplete] = useLocalStorage('wazly-onboarded', false);

  const launchApp = () => {
    if (onboardingComplete) {
      setAppState('app');
      setView('overview');
    } else {
      setAppState('onboarding');
    }
  };

  const completeOnboarding = () => {
    setOnboardingComplete(true);
    setAppState('app');
    setView('overview');
  };

  const exitToLanding = () => {
    setAppState('landing');
  };

  // Scroll to top when view changes
  useEffect(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
  }, [view]);

  return (
    <LanguageProvider>
      <ThemeProvider>
        {appState === 'landing' && <LandingPage onLaunchApp={launchApp} />}
        {appState === 'onboarding' && <Onboarding onComplete={completeOnboarding} />}
        {appState === 'app' && (
          <AppShell currentView={view} onViewChange={setView} onExitToLanding={exitToLanding}>
            {view === 'overview' && <Overview onViewChange={setView} />}
            {view === 'inbox' && <LiveInbox />}
            {view === 'customers' && <Customers />}
            {view === 'leads' && <LeadsView />}
            {view === 'ai' && <AIPlayground />}
            {view === 'knowledge' && <Knowledge />}
            {view === 'analytics' && <Analytics />}
            {view === 'integrations' && <Integrations />}
            {view === 'team' && <Team />}
            {view === 'billing' && <Billing />}
          </AppShell>
        )}
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
