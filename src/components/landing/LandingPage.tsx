import { LandingNav } from './LandingNav';
import { HeroStory } from './HeroStory';
import { ChannelFlow } from './ChannelFlow';
import { AISection } from './AISection';
import { KnowledgeAssembly } from './KnowledgeAssembly';
import { HandoffMoment } from './HandoffMoment';
import { AnalyticsBoard } from './AnalyticsBoard';
import { Testimonials } from './Testimonials';
import { IntegrationsBand } from './IntegrationsBand';
import { PricingSelector } from './PricingSelector';
import { FinalCTA } from './FinalCTA';
import { useLang } from '@/lib/i18n';

interface LandingPageProps {
  onLaunchApp: () => void;
}

/**
 * Section order follows the navigation and reads as a single argument:
 * a customer arrives, every channel lands in one inbox, the assistant answers
 * from company knowledge, a person takes over when it matters, here are the
 * results, here are customers saying so, here is what it connects to, here is
 * what it costs.
 *
 * Each section owns its own motion pattern. None of them is a heading followed
 * by three cards.
 */
export function LandingPage({ onLaunchApp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-app">
      <LandingNav onLaunchApp={onLaunchApp} />

      {/* #home — sticky cinematic story, eight stages */}
      <HeroStory onLaunchApp={onLaunchApp} />

      {/* #features — channels converge into one inbox */}
      <ChannelFlow />

      {/* #how — sources collapse into the answer */}
      <AISection />

      {/* fragments assemble into a knowledge base */}
      <KnowledgeAssembly />

      {/* the interface changes hands */}
      <HandoffMoment />

      {/* #analytics — counters and self-drawing charts */}
      <AnalyticsBoard />

      {/* horizontal editorial rail */}
      <Testimonials />

      {/* #integrations — connection state */}
      <IntegrationsBand />

      {/* #pricing — selector and one detail panel */}
      <PricingSelector onLaunchApp={onLaunchApp} />

      <FinalCTA onLaunchApp={onLaunchApp} />
      <Footer />
    </div>
  );
}

function Footer() {
  const { pick } = useLang();

  const columns: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
    {
      title: pick('المنتج', 'Product'),
      links: [
        { label: pick('المميزات', 'Features'), href: '#features' },
        { label: pick('كيف يعمل', 'How it works'), href: '#how' },
        { label: pick('التكاملات', 'Integrations'), href: '#integrations' },
        { label: pick('الأسعار', 'Pricing'), href: '#pricing' },
      ],
    },
    {
      title: pick('الشركة', 'Company'),
      links: [
        { label: pick('من إحنا', 'About'), href: '#' },
        { label: pick('وظائف', 'Careers'), href: '#' },
        { label: pick('تواصل معانا', 'Contact'), href: '#' },
      ],
    },
    {
      title: pick('قانوني', 'Legal'),
      links: [
        { label: pick('الخصوصية', 'Privacy'), href: '#' },
        { label: pick('الشروط', 'Terms'), href: '#' },
        { label: pick('الأمان', 'Security'), href: '#' },
      ],
    },
  ];

  return (
    <footer className="border-t border-app py-14">
      <div className="max-w-shell mx-auto px-5 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            {/* Same offset-squares mark as the navigation. */}
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
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
              <span className="font-latin text-[15px] font-semibold tracking-tight text-main">Wazly</span>
            </div>
            <p className="mt-4 max-w-measure text-[13px] leading-relaxed text-muted">
              {pick(
                'منصة محادثات للشركات — واتساب وماسنجر وإنستجرام في صندوق واحد، ورد يفهم نشاطك.',
                'A conversation platform for businesses — WhatsApp, Messenger and Instagram in one inbox, with replies that know your business.'
              )}
            </p>
          </div>

          {columns.map(column => (
            <div key={column.title}>
              <div className="text-eyebrow font-medium uppercase text-subtle">{column.title}</div>
              <ul className="mt-4 space-y-2.5">
                {column.links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-muted transition-colors duration-200 hover:text-main"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-app pt-6">
          <span className="text-[11px] text-subtle">
            {pick('© 2026 Wazly. كل الحقوق محفوظة.', '© 2026 Wazly. All rights reserved.')}
          </span>
          <span className="text-[11px] text-subtle">
            {pick('مصنوع للأعمال في مصر والمنطقة', 'Built for businesses in Egypt and the region')}
          </span>
        </div>
      </div>
    </footer>
  );
}
