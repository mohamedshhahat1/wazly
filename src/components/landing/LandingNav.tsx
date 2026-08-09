import { useEffect, useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { Button } from '@/components/ui';

interface LandingNavProps {
  onLaunchApp: () => void;
}

/**
 * Section anchors are declared here rather than pulled from i18n keys: two of
 * these labels have no existing translation key, and inventing keys means a
 * compile error against `TKey` if the guess is wrong. `pick` is checked by
 * construction.
 */
const navLinks = [
  { id: 'home', ar: 'الرئيسية', en: 'Home' },
  { id: 'features', ar: 'المميزات', en: 'Features' },
  { id: 'how', ar: 'كيف يعمل', en: 'How it works' },
  { id: 'integrations', ar: 'التكاملات', en: 'Integrations' },
  { id: 'pricing', ar: 'الأسعار', en: 'Pricing' },
];

/**
 * Two rounded squares, offset and overlapping, the upper one teal. Several
 * inputs resolving into one surface — the product, not an abstract AI mark.
 * The overlap produces a third tone, which is the only place in the identity
 * where colours layer.
 */
function WazlyMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <rect x="1" y="4.5" width="11" height="11" rx="3.2" className="fill-ink-900 dark:fill-ink-100" />
      <rect
        x="8"
        y="4.5"
        width="11"
        height="11"
        rx="3.2"
        fillOpacity="0.9"
        className="fill-brand-600 dark:fill-brand-400"
      />
    </svg>
  );
}

export function LandingNav({ onLaunchApp }: LandingNavProps) {
  const { theme, toggle } = useTheme();
  const { lang, setLang, pick } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll spy. One observer for every section, watching a thin band roughly a
  // quarter of the way down the viewport, so "active" means "the section you
  // are reading" rather than "any section currently on screen".
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const els = navLinks
      .map(link => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(entry => entry.isIntersecting);
        if (visible.length === 0) return;
        // When two sections straddle the band, the lower one is the one being
        // entered, so prefer the greatest top offset.
        const current = visible.reduce((best, entry) =>
          entry.boundingClientRect.top > best.boundingClientRect.top ? entry : best
        );
        setActiveId(current.target.id);
      },
      { rootMargin: '-22% 0px -70% 0px', threshold: 0 }
    );

    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ease-smooth ${
        scrolled ? 'glass border-b border-app' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-shell mx-auto px-5 sm:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-400 ease-smooth ${
            scrolled ? 'h-14' : 'h-16'
          }`}
        >
          <a href="#home" className="flex items-center gap-2.5 shrink-0 group">
            <WazlyMark className="w-[19px] h-[19px]" />
            <span className="text-[17px] font-semibold text-main font-latin tracking-tight">Wazly</span>
          </a>

          <nav className="hidden md:flex items-center" aria-label={pick('التنقل الرئيسي', 'Main navigation')}>
            {navLinks.map(link => {
              const active = activeId === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  aria-current={active ? 'true' : undefined}
                  className={`relative px-3.5 py-2 text-[13px] transition-colors duration-200 ${
                    active ? 'text-main' : 'text-muted hover:text-main'
                  }`}
                >
                  {pick(link.ar, link.en)}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3.5 bottom-0.5 h-px bg-brand-600 dark:bg-brand-400 transition-all duration-300 ease-smooth ${
                      active ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            {/* "العربية | EN" — the switch stays quiet, never a primary control. */}
            <div className="hidden sm:flex items-center gap-2 text-xs me-2">
              <button
                onClick={() => setLang('ar')}
                className={`transition-colors duration-200 ${
                  lang === 'ar' ? 'text-main font-medium' : 'text-subtle hover:text-muted'
                }`}
              >
                العربية
              </button>
              <span aria-hidden="true" className="text-border-strong">|</span>
              <button
                onClick={() => setLang('en')}
                className={`font-latin transition-colors duration-200 ${
                  lang === 'en' ? 'text-main font-medium' : 'text-subtle hover:text-muted'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={toggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-subtle hover:text-main transition-colors duration-200"
              aria-label={pick('تبديل المظهر', 'Toggle theme')}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={onLaunchApp}>
              {pick('تسجيل الدخول', 'Sign in')}
            </Button>
            <Button size="sm" onClick={onLaunchApp} className="hidden sm:inline-flex">
              {pick('ابدأ مجانًا', 'Start free')}
            </Button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={pick('القائمة', 'Menu')}
              aria-expanded={mobileOpen}
              className="md:hidden w-9 h-9 -me-1.5 rounded-lg flex items-center justify-center text-muted"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 pt-1 border-t border-app animate-fade-in">
            <nav className="flex flex-col">
              {navLinks.map(link => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 text-sm border-b border-app last:border-0 ${
                    activeId === link.id ? 'text-main font-medium' : 'text-muted'
                  }`}
                >
                  {pick(link.ar, link.en)}
                </a>
              ))}
            </nav>
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setLang('ar')}
                  className={lang === 'ar' ? 'text-main font-medium' : 'text-subtle'}
                >
                  العربية
                </button>
                <span aria-hidden="true" className="text-border-strong">|</span>
                <button
                  onClick={() => setLang('en')}
                  className={`font-latin ${lang === 'en' ? 'text-main font-medium' : 'text-subtle'}`}
                >
                  EN
                </button>
              </div>
              <Button size="sm" onClick={onLaunchApp}>
                {pick('ابدأ مجانًا', 'Start free')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
