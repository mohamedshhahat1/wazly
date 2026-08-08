import { useEffect, useState } from 'react';
import { Sparkles, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useLang, LanguageSwitcher, type TKey } from '@/lib/i18n';
import { Button } from '@/components/ui';

interface LandingNavProps {
  onLaunchApp: () => void;
}

const navLinks: Array<{ key: TKey; href: string }> = [
  { key: 'nav.features', href: '#features' },
  { key: 'nav.how', href: '#how' },
  { key: 'nav.analytics', href: '#analytics' },
  { key: 'nav.pricing', href: '#pricing' },
];

export function LandingNav({ onLaunchApp }: LandingNavProps) {
  const { theme, toggle } = useTheme();
  const { t, pick } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-app' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — the wordmark stays Latin */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-main font-latin">Wazly</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-muted hover:text-main transition-colors duration-200 rounded-lg hover:bg-muted"
              >
                {t(link.key)}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden sm:inline-flex me-1" />
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-main hover:bg-muted transition-colors duration-200"
              aria-label={pick('تبديل المظهر', 'Toggle theme')}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={onLaunchApp}>
              {pick('تسجيل الدخول', 'Sign in')}
            </Button>
            <Button size="sm" onClick={onLaunchApp} className="hidden sm:inline-flex">
              {t('nav.launch')}
            </Button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={pick('القائمة', 'Menu')}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:bg-muted"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-3 space-y-1 animate-fade-in-down border-t border-app">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm text-muted hover:text-main hover:bg-muted rounded-lg"
              >
                {t(link.key)}
              </a>
            ))}
            <div className="flex items-center justify-between px-3 pt-2">
              <LanguageSwitcher />
              <Button size="sm" onClick={onLaunchApp}>
                {t('nav.launch')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
