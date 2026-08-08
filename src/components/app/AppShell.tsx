import { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Inbox, Users, Bot, BookOpen, BarChart3, Plug, CreditCard,
  LayoutDashboard, ChevronDown, ChevronRight, Sun, Moon, Bell, Search, Settings, Target,
  type LucideIcon,
} from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useLang, LanguageSwitcher, type TKey } from '@/lib/i18n';
import { StatusDot } from '@/components/ui';
import { company, notificationTemplates } from '@/lib/mockData';

export type AppView = 'overview' | 'inbox' | 'customers' | 'leads' | 'ai' | 'knowledge' | 'analytics' | 'integrations' | 'team' | 'billing';

interface NavItem {
  id: AppView;
  labelKey: TKey;
  icon: LucideIcon;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'overview', labelKey: 'app.nav.overview', icon: LayoutDashboard },
  { id: 'inbox', labelKey: 'app.nav.inbox', icon: Inbox, badge: 3 },
  { id: 'customers', labelKey: 'app.nav.customers', icon: Users },
  { id: 'leads', labelKey: 'app.nav.leads', icon: Target },
  { id: 'ai', labelKey: 'app.nav.ai', icon: Bot },
  { id: 'knowledge', labelKey: 'app.nav.knowledge', icon: BookOpen },
  { id: 'analytics', labelKey: 'app.nav.analytics', icon: BarChart3 },
  { id: 'integrations', labelKey: 'app.nav.integrations', icon: Plug },
  { id: 'team', labelKey: 'app.nav.team', icon: Users },
  { id: 'billing', labelKey: 'app.nav.billing', icon: CreditCard },
];

const notifDotColor: Record<string, string> = {
  lead: 'bg-brand-500',
  handoff: 'bg-accent-500',
  integration: 'bg-green-500',
  knowledge: 'bg-brand-500',
};

interface AppShellProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onExitToLanding: () => void;
  children: React.ReactNode;
}

export function AppShell({ currentView, onViewChange, onExitToLanding, children }: AppShellProps) {
  const { theme, toggle } = useTheme();
  const { t, pick } = useLang();
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) setWorkspaceOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentItem = navItems.find(n => n.id === currentView);

  return (
    <div className="flex h-screen bg-app overflow-hidden">
      {/* Sidebar — `border-e` keeps the divider on the inner edge in both directions */}
      <aside className={`flex flex-col border-e border-app bg-subtle transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-60'}`}>
        {/* Workspace switcher */}
        <div ref={workspaceRef} className="relative p-3 border-b border-app">
          <button
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-muted transition-colors duration-200"
          >
            <div className="w-7 h-7 rounded-lg bg-brand-600 dark:bg-brand-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex-1 text-start min-w-0">
                  <div className="text-sm font-semibold text-main truncate">
                    {pick(company.shortName, company.shortNameEn)}
                  </div>
                  <div className="text-[10px] text-subtle">{pick('باقة الأعمال', 'Business plan')}</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-200 ${workspaceOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

          {workspaceOpen && !sidebarCollapsed && (
            <div className="absolute top-full start-3 end-3 mt-1 bg-app border border-app rounded-lg shadow-large z-50 overflow-hidden animate-scale-in origin-top">
              <div className="p-2 hover:bg-muted cursor-pointer transition-colors">
                <div className="text-sm font-medium text-main">{pick(company.shortName, company.shortNameEn)}</div>
                <div className="text-[10px] text-subtle">{pick('الحالي', 'Current')}</div>
              </div>
              <div className="p-2 hover:bg-muted cursor-pointer transition-colors border-t border-app">
                <div className="text-sm text-muted">{pick('+ إنشاء مساحة عمل', '+ Create workspace')}</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentView === item.id;
            const label = t(item.labelKey);
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-all duration-200 relative group ${
                  active ? 'bg-brand-bg text-brand font-medium' : 'text-muted hover:text-main hover:bg-muted'
                }`}
                title={sidebarCollapsed ? label : undefined}
              >
                {active && (
                  <span className="absolute start-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand rounded-e-full" />
                )}
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand' : ''}`} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-start">{label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand-600 text-white dark:bg-brand-500 dark:text-brand-950 num">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge && (
                  <span className="absolute top-0.5 end-0.5 w-2 h-2 rounded-full bg-brand-600" />
                )}
              </button>
            );
          })}
        </nav>

        {/* System status */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-app">
            <div className="px-2.5 py-2 rounded-lg bg-muted">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-muted">
                  {pick('حالة النظام', 'System status')}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">{pick('كل القنوات', 'All channels')}</span>
                  <StatusDot status="operational" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">{pick('محرك الـ AI', 'AI engine')}</span>
                  <StatusDot status="operational" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">{pick('معرفة الشركة', 'Knowledge')}</span>
                  <StatusDot status="ready" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapse + exit */}
        <div className="p-2 border-t border-app space-y-0.5">
          <button
            onClick={() => setSidebarCollapsed(v => !v)}
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-muted hover:text-main hover:bg-muted transition-colors duration-200"
            title={pick('طي القائمة', 'Collapse sidebar')}
          >
            <ChevronRight className={`w-4 h-4 shrink-0 flip-rtl transition-transform duration-200 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            {!sidebarCollapsed && <span>{pick('طي القائمة', 'Collapse')}</span>}
          </button>
          <button
            onClick={onExitToLanding}
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-muted hover:text-main hover:bg-muted transition-colors duration-200"
            title={sidebarCollapsed ? t('app.topbar.exit') : undefined}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>{t('app.topbar.exit')}</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-app bg-app flex items-center justify-between px-4 sm:px-6 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-base font-semibold text-main truncate">{currentItem ? t(currentItem.labelKey) : ''}</h1>
            {/* Live indicator — quiet, but signals a running system */}
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" />
              {t('common.live')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted w-64">
              <Search className="w-3.5 h-3.5 text-subtle shrink-0" />
              <input
                type="text"
                placeholder={t('app.topbar.search')}
                className="bg-transparent text-sm text-main placeholder:text-subtle outline-none flex-1 min-w-0"
              />
              <kbd className="text-[10px] text-subtle px-1 py-0.5 rounded border border-app bg-app force-ltr shrink-0">⌘K</kbd>
            </div>

            {/* Language — present but not competing for attention */}
            <LanguageSwitcher className="hidden sm:inline-flex" />

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                aria-label={t('app.topbar.notifications')}
                className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-main hover:bg-muted transition-colors duration-200"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-brand-500 animate-pulse-dot" />
              </button>

              {notifOpen && (
                <div className="absolute end-0 top-full mt-1 w-80 bg-app border border-app rounded-xl shadow-large z-50 overflow-hidden animate-scale-in origin-top">
                  <div className="p-3 border-b border-app flex items-center justify-between">
                    <span className="text-sm font-semibold text-main">{t('app.topbar.notifications')}</span>
                    <button className="text-xs text-brand hover:underline">
                      {pick('تعليم الكل كمقروء', 'Mark all read')}
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notificationTemplates.map((n, i) => (
                      <div key={i} className="p-3 border-b border-app last:border-b-0 hover:bg-muted cursor-pointer transition-colors">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${notifDotColor[n.type] ?? 'bg-brand-500'} mt-1.5 shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-main">{pick(n.title, n.titleEn)}</div>
                            <div className="text-xs text-muted mt-0.5">{pick(n.body, n.bodyEn)}</div>
                            <div className="text-[10px] text-subtle mt-1">{pick(n.time, n.timeEn)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label={pick('تبديل المظهر', 'Toggle theme')}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-main hover:bg-muted transition-colors duration-200"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Settings */}
            <button
              aria-label={t('app.nav.settings')}
              className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-muted hover:text-main hover:bg-muted transition-colors duration-200"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center text-white text-sm font-semibold cursor-pointer shrink-0">
              م
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
