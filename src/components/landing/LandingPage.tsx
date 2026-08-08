import { Sparkles, Zap, MessageCircle, Brain, BarChart3, GitBranch, Users, Clock } from 'lucide-react';
import { HeroConversation } from './HeroConversation';
import { OmnichannelAnimation } from './OmnichannelAnimation';
import { HandoffAnimation } from './HandoffAnimation';
import { KnowledgeAnimation } from './KnowledgeAnimation';
import { AnalyticsPreview } from './AnalyticsPreview';
import { LandingNav } from './LandingNav';
import { Button } from '@/components/ui';
import { useReveal } from '@/lib/hooks';
import { pricingPlans } from '@/lib/mockData';
import { ArrowRight, Check } from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: () => void;
}

export function LandingPage({ onLaunchApp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-app">
      <LandingNav onLaunchApp={onLaunchApp} />
      <HeroSection onLaunchApp={onLaunchApp} />
      <LogoStrip />
      <OmnichannelSection />
      <HowItWorksSection />
      <HandoffSection />
      <KnowledgeSection />
      <AnalyticsSection />
      <PricingSection onLaunchApp={onLaunchApp} />
      <CTASection onLaunchApp={onLaunchApp} />
      <Footer />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────
function HeroSection({ onLaunchApp }: { onLaunchApp: () => void }) {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/30 to-transparent dark:from-brand-950/10 pointer-events-none" />
      <div className="noise-overlay" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-bg border border-brand-200/30 text-xs font-medium text-brand mb-6 animate-fade-in-down">
              <Sparkles className="w-3.5 h-3.5" />
              AI-powered customer support, on every channel
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-main tracking-tight leading-[1.1] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Your AI answers customers.
              <br />
              <span className="text-gradient-brand">You close the leads.</span>
            </h1>

            <p className="mt-6 text-lg text-muted leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Wazly handles conversations across WhatsApp, Instagram, Messenger, and Facebook.
              AI gives instant answers from your knowledge base — and hands off to your team when it matters.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <Button size="lg" onClick={onLaunchApp} className="group">
                Launch Wazly
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button size="lg" variant="outline" onClick={onLaunchApp}>
                See it in action
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-xs text-subtle animate-fade-in" style={{ animationDelay: '500ms' }}>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand" /> No credit card needed
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand" /> Setup in 5 minutes
              </span>
            </div>
          </div>

          {/* Right: live conversation */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="absolute -inset-4 bg-gradient-to-br from-brand-200/20 to-brand-400/10 dark:from-brand-900/20 dark:to-brand-700/5 rounded-3xl blur-2xl" />
            <div className="relative">
              <HeroConversation />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Logo strip ───────────────────────────────────────────────────
function LogoStrip() {
  const stats = [
    { value: '12K+', label: 'Conversations handled' },
    { value: '87%', label: 'AI resolution rate' },
    { value: '3.8s', label: 'Average response time' },
    { value: '4', label: 'Channels connected' },
  ];
  return (
    <section className="py-10 border-y border-app bg-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={s.label} className="text-center" style={{ opacity: 0, animation: `fadeInUp 0.5s ease-out ${i * 100}ms forwards` }}>
              <div className="text-2xl md:text-3xl font-bold text-main">{s.value}</div>
              <div className="text-xs text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Omnichannel ──────────────────────────────────────────────────
function OmnichannelSection() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.15 });
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div ref={ref}>
            <SectionLabel icon={MessageCircle}>Omnichannel</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold text-main tracking-tight mt-3 mb-4">
              Every conversation, one inbox
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-6">
              WhatsApp, Instagram, Messenger, and Facebook comments — all connected to Wazly.
              Messages flow in from every channel, AI responds instantly, and you see everything in one place.
            </p>
            <div className="space-y-3">
              {[
                { title: 'Unified inbox', desc: 'All channels in a single view' },
                { title: 'Instant routing', desc: 'AI responds in seconds, not hours' },
                { title: 'Channel analytics', desc: 'See which channels drive the most leads' },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 transition-all duration-500"
                  style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-12px)', transitionDelay: `${i * 150 + 200}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-brand-bg flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-brand" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-main">{item.title}</div>
                    <div className="text-sm text-muted">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={visible ? 'animate-fade-in' : 'opacity-0'} style={{ transitionDelay: '200ms' }}>
            <OmnichannelAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────
function HowItWorksSection() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const steps = [
    { icon: MessageCircle, title: 'Customer sends a message', desc: 'Across any channel — WhatsApp, Instagram, Messenger, or Facebook.' },
    { icon: Brain, title: 'AI understands & searches', desc: 'Wazly reads the message and finds the relevant information in your knowledge base.' },
    { icon: Zap, title: 'AI responds instantly', desc: 'Your customer gets an accurate answer in seconds, 24/7.' },
    { icon: Users, title: 'Human takes over when needed', desc: 'Complex cases seamlessly hand off to your team with full context.' },
    { icon: BarChart3, title: 'Leads & analytics update', desc: 'Every conversation is tracked, scored, and turned into actionable insight.' },
  ];
  return (
    <section id="how" className="py-24 bg-subtle">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionLabel icon={GitBranch}>How it works</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-main tracking-tight mt-3">
            From message to resolved — automatically
          </h2>
        </div>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="flex items-start gap-6 transition-all duration-600"
                  style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-20px)', transitionDelay: `${i * 200}ms` }}
                >
                  <div className="relative z-10 w-12 h-12 rounded-xl bg-brand-600 dark:bg-brand-500 flex items-center justify-center shadow-md shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="pt-1">
                    <div className="text-xs font-mono text-brand mb-1">STEP {i + 1}</div>
                    <h3 className="text-lg font-semibold text-main">{step.title}</h3>
                    <p className="text-sm text-muted mt-1">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Handoff ──────────────────────────────────────────────────────
function HandoffSection() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.15 });
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={visible ? 'order-2 lg:order-1 animate-fade-in' : 'order-2 lg:order-1 opacity-0'} style={{ transitionDelay: '200ms' }}>
            <HandoffAnimation />
          </div>
          <div ref={ref} className="order-1 lg:order-2">
            <SectionLabel icon={Users}>AI → Human handoff</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold text-main tracking-tight mt-3 mb-4">
              Seamless handoff when it matters
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-6">
              AI handles the routine. When a customer needs a human, Wazly smoothly transfers
              the conversation to the right team member — with full context so nobody repeats themselves.
            </p>
            <div className="space-y-3">
              {[
                { title: 'Smart detection', desc: 'AI recognizes when a conversation needs a human' },
                { title: 'Full context transfer', desc: 'Operators see the entire conversation history' },
                { title: 'Auto-assignment', desc: 'Route to the right team member automatically' },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 transition-all duration-500"
                  style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(12px)', transitionDelay: `${i * 150 + 200}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-brand-bg flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-brand" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-main">{item.title}</div>
                    <div className="text-sm text-muted">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Knowledge ────────────────────────────────────────────────────
function KnowledgeSection() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.15 });
  return (
    <section className="py-24 bg-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div ref={ref}>
            <SectionLabel icon={Brain}>AI Knowledge</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold text-main tracking-tight mt-3 mb-4">
              Teach Wazly about your business
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-6">
              Upload your company info, products, FAQs, and policies. Wazly learns from them
              and answers customer questions accurately — in your brand's voice.
            </p>
            <div className="space-y-3">
              {[
                { title: 'Any document type', desc: 'PDFs, text, FAQs, product catalogs' },
                { title: 'Always learning', desc: 'Add new information anytime — AI updates instantly' },
                { title: 'Source citations', desc: 'Every AI answer shows where it came from' },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 transition-all duration-500"
                  style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-12px)', transitionDelay: `${i * 150 + 200}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-brand-bg flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-brand" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-main">{item.title}</div>
                    <div className="text-sm text-muted">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={visible ? 'animate-fade-in' : 'opacity-0'} style={{ transitionDelay: '200ms' }}>
            <KnowledgeAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Analytics ────────────────────────────────────────────────────
function AnalyticsSection() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.15 });
  return (
    <section id="analytics" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SectionLabel icon={BarChart3}>Analytics</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-main tracking-tight mt-3">
            See exactly how your business is performing
          </h2>
          <p className="text-muted text-lg mt-3 max-w-2xl mx-auto">
            Real-time insights into conversations, AI performance, leads, and response times.
          </p>
        </div>
        <div ref={ref} className={visible ? 'animate-fade-in-up' : 'opacity-0'}>
          <AnalyticsPreview />
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────
function PricingSection({ onLaunchApp }: { onLaunchApp: () => void }) {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.1 });
  return (
    <section id="pricing" className="py-24 bg-subtle">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SectionLabel icon={Zap}>Pricing</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-main tracking-tight mt-3">
            Plans that scale with your conversations
          </h2>
          <p className="text-muted text-lg mt-3">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pricingPlans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative bg-app border rounded-2xl p-6 transition-all duration-500 ${
                plan.highlighted ? 'border-brand-500 shadow-lg ring-1 ring-brand-500/20' : 'border-app shadow-soft'
              } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-600 dark:bg-brand-500 text-white text-xs font-medium rounded-full">
                  Most popular
                </div>
              )}
              <div className="text-sm font-semibold text-main mb-1">{plan.name}</div>
              <div className="flex items-baseline gap-1 mb-4">
                {plan.price !== null ? (
                  <>
                    <span className="text-3xl font-bold text-main">{plan.price.toLocaleString()}</span>
                    <span className="text-sm text-muted">{plan.period}</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-main">Custom</span>
                )}
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlighted ? 'primary' : 'outline'}
                size="md"
                className="w-full"
                onClick={onLaunchApp}
              >
                {plan.price === null ? 'Contact sales' : 'Get started'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────
function CTASection({ onLaunchApp }: { onLaunchApp: () => void }) {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.2 });
  return (
    <section className="py-24">
      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 dark:from-brand-800 dark:to-ink-950 p-12 text-center transition-all duration-700 ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="absolute inset-0 dot-pattern opacity-10" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white mb-6">
              <Clock className="w-3.5 h-3.5" />
              Start in 5 minutes
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Your AI support agent is waiting.
            </h2>
            <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">
              Connect your channels, teach Wazly about your business, and watch it handle customers instantly.
            </p>
            <Button
              size="lg"
              onClick={onLaunchApp}
              className="group bg-white text-brand-700 hover:bg-brand-50 dark:bg-white dark:text-brand-700"
            >
              Launch Wazly
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-app py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-main">Wazly</span>
            </div>
            <p className="text-sm text-muted">AI-powered customer support across every channel.</p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Analytics'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Status'] },
          ].map(col => (
            <div key={col.title}>
              <div className="text-sm font-semibold text-main mb-3">{col.title}</div>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted hover:text-main transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-app text-center text-xs text-subtle">
          © 2026 Wazly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── Reusable label ───────────────────────────────────────────────
function SectionLabel({ children, icon: Icon }: { children: React.ReactNode; icon: any }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-bg border border-brand-200/30 text-xs font-medium text-brand">
      <Icon className="w-3.5 h-3.5" />
      {children}
    </div>
  );
}
