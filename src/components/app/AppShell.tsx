import { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Inbox, Users, Bot, BookOpen, BarChart3, Plug, CreditCard,
  LayoutDashboard, ChevronDown, Sun, Moon, Bell, Search, Settings, Target,
  type LucideIcon,
} from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { StatusDot } from '@/components/ui';

export type AppView = 'overview' | 'inbox' | 'customers' | 'leads' | 'ai' | 'knowledge' | 'analytics' | 'integrations' | 'team' | 'billing';

interface NavItem {
  id: AppView;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'inbox', label: 'Inbox', icon: Inbox, badge: 3 },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'leads', label: 'Lead Qualification', icon: Target },
  { id: 'ai', label: 'AI Assistant', icon: Bot },
  { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

interface AppShellProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onExitToLanding: () => void;
  children: React.ReactNode;
}

export function AppShell({ currentView, onViewChange, onExitToLanding, children }: AppShellProps) {
  const { theme, toggle } = useTheme();
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
      {/* Sidebar */}
      <aside className={`flex flex-col border-r border-app bg-subtle transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-60'}`}>
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
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-semibold text-main truncate">Wazly Workspace</div>
                  <div className="text-[10px] text-subtle">Business Plan</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-200 ${workspaceOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

          {workspaceOpen && !sidebarCollapsed && (
            <div className="absolute top-full left-3 right-3 mt-1 bg-app border border-app rounded-lg shadow-large z-50 overflow-hidden animate-scale-in origin-top">
              <div className="p-2 hover:bg-muted cursor-pointer transition-colors">
                <div className="text-sm font-medium text-main">Wazly Workspace</div>
                <div className="text-[10px] text-subtle">Current</div>
              </div>
              <div className="p-2 hover:bg-muted cursor-pointer transition-colors border-t border-app">
                <div className="text-sm text-muted">+ Create workspace</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-all duration-200 relative group ${
                  active ? 'bg-brand-bg text-brand font-medium' : 'text-muted hover:text-main hover:bg-muted'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand rounded-r-full" />
                )}
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand' : ''}`} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand-600 text-white dark:bg-brand-500 dark:text-brand-950 animate-scale-in">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-brand-600" />
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
                <span className="text-[10px] font-medium text-muted uppercase tracking-wider">System Status</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">All channels</span>
                  <StatusDot status="operational" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">AI Engine</span>
                  <StatusDot status="operational" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Knowledge</span>
                  <StatusDot status="ready" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exit to landing */}
        <div className="p-2 border-t border-app">
          <button
            onClick={onExitToLanding}
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-muted hover:text-main hover:bg-muted transition-colors duration-200"
            title={sidebarCollapsed ? 'Back to site' : undefined}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Back to site</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-app bg-app flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold text-main">{currentItem?.label}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted w-56">
              <Search className="w-3.5 h-3.5 text-subtle" />
              <input
                type="text"
                placeholder="Search…"
                className="bg-transparent text-sm text-main placeholder:text-subtle outline-none flex-1"
              />
              <kbd className="text-[10px] text-subtle px-1 py-0.5 rounded border border-app bg-app">⌘K</kbd>
            </div>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-main hover:bg-muted transition-colors duration-200"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-pulse-dot" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-app border border-app rounded-xl shadow-xl z-50 overflow-hidden animate-scale-in origin-top-right">
                  <div className="p-3 border-b border-app flex items-center justify-between">
                    <span className="text-sm font-semibold text-main">Notifications</span>
                    <span className="text-xs text-brand cursor-pointer">Mark all read</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {[
                      { title: 'New lead detected', body: 'Ahmed is interested in your Premium Package.', time: 'Just now', color: 'bg-brand-500' },
                      { title: 'Human handoff', body: 'Customer requested a human operator.', time: '2m ago', color: 'bg-accent-500' },
                      { title: 'WhatsApp connected', body: 'WhatsApp integration is now active.', time: '1h ago', color: 'bg-green-500' },
                      { title: 'Knowledge indexed', body: 'New FAQ document added to AI knowledge.', time: '3h ago', color: 'bg-brand-500' },
                    ].map((n, i) => (
                      <div key={i} className="p-3 border-b border-app hover:bg-muted cursor-pointer transition-colors">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${n.color} mt-1.5 shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-main">{n.title}</div>
                            <div className="text-xs text-muted mt-0.5">{n.body}</div>
                            <div className="text-[10px] text-subtle mt-1">{n.time}</div>
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
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-main hover:bg-muted transition-colors duration-200"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Settings */}
            <button className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-main hover:bg-muted transition-colors duration-200">
              <Settings className="w-4 h-4" />
            </button>

            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm font-semibold cursor-pointer ring-2 ring-transparent hover:ring-brand-200 dark:hover:ring-brand-700 transition-all">
              A
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
