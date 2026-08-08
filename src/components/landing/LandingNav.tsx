import { useEffect, useState } from 'react';
import { Sparkles, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { Button } from '@/components/ui';

interface LandingNavProps {
  onLaunchApp: () => void;
}

export function LandingNav({ onLaunchApp }: LandingNavProps) {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how' },
    { label: 'Analytics', href: '#analytics' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-app shadow-soft' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-main tracking-tight">Wazly</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-muted hover:text-main transition-colors duration-200 rounded-lg hover:bg-muted"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-main hover:bg-muted transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={onLaunchApp}>
              Sign in
            </Button>
            <Button size="sm" onClick={onLaunchApp} className="hidden sm:inline-flex">
              Launch App
            </Button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:bg-muted"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-3 space-y-1 animate-fade-in-down">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm text-muted hover:text-main hover:bg-muted rounded-lg"
              >
                {link.label}
              </a>
            ))}
            <Button size="sm" className="w-full mt-2" onClick={onLaunchApp}>
              Launch App
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
