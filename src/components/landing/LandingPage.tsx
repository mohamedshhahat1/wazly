import { useState } from 'react';
import {
  Sparkles, Zap, MessageCircle, Brain, BarChart3, Users, Clock,
  ArrowRight, Check, Quote, type LucideIcon,
} from 'lucide-react';
import { HeroConversation } from './HeroConversation';
import { OmnichannelAnimation } from './OmnichannelAnimation';
import { HandoffAnimation } from './HandoffAnimation';
import { KnowledgeAnimation } from './KnowledgeAnimation';
import { AnalyticsPreview } from './AnalyticsPreview';
import { ScrollStory } from './ScrollStory';
import { LandingNav } from './LandingNav';
import { Button } from '@/components/ui';
import { useReveal, useScrollProgress, usePrefersReducedMotion } from '@/lib/hooks';
import { mapRange, round, stagger } from '@/lib/motion';
import { useLang } from '@/lib/i18n';
import { pricingPlans, analyticsData } from '@/lib/mockData';

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
      {/* Owns the #how anchor: the scroll-driven version of how it works */}
      <ScrollStory />
      <HandoffSection />
      <KnowledgeSection />
      <AnalyticsSection />
      <TestimonialsSection />
      <PricingSection onLaunchApp={onLaunchApp} />
      <CTASection onLaunchApp={onLaunchApp} />
      <Footer />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────
function HeroSection({ onLaunchApp }: { onLaunchApp: () => void }) {
  const { pick } = useLang();
  const reduced = usePrefersReducedMotion();
  const { ref, progress } = useScrollProgress<HTMLElement>({
    mode: 'exit',
    disabled: reduced,
  });

  // Everything below is a function of scroll position, not a timer. Values are
  // deliberately small: the hero should settle as you leave it, not fly away.
  const p = reduced ? 0 : progress;
  const textY = round(mapRange(p, 0, 0.7, 0, -34), 2);
  const cardY = round(mapRange(p, 0, 0.7, 0, -14), 2);
  const cardScale = round(mapRange(p, 0, 0.45, 0.96, 1), 4);
  const cardLift = round(mapRange(p, 0, 0.45, 0, 1), 3);
  const ctaOpacity = round(mapRange(p, 0.25, 0.6, 1, 0.3), 3);
  // Background trails the foreground: 15px against 34px.
  const bgY = round(mapRange(p, 0, 0.7, 0, -15), 2);

  return (
    <section ref={ref} className="relative pt-28 pb-16 overflow-hidden">
      {/* One quiet background treatment, not three stacked on top of each other */}
      <div
        className="absolute inset-0 dot-pattern opacity-30"
        style={{ transform: `translate3d(0, ${bgY}px, 0)`, willChange: 'transform' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Deliberately not a perfect 50/50 split */}
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          <div
            className="text-center lg:text-start"
            style={{ transform: `translate3d(0, ${textY}px, 0)`, willChange: 'transform' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-bg text-xs font-medium text-brand mb-6 animate-fade-in-down">
              <Sparkles className="w-3.5 h-3.5" />
              {pick('خدمة عملاء بالـ AI على كل القنوات', 'AI customer support on every channel')}
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-main leading-[1.25] animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              {pick('خلي الـ AI يتولى خدمة عملائك', 'Let AI handle your customer service')}
            </h1>

            <p
              className="mt-5 text-lg text-muted leading-[1.9] max-w-xl mx-auto lg:mx-0 animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              {pick(
                'اربط واتساب، ماسنجر وإنستجرام، وخلي Wazly يرد على عملائك تلقائيًا، يحوّل المحادثات للموظفين عند الحاجة، ويتابع كل حاجة من مكان واحد.',
                'Connect WhatsApp, Messenger and Instagram. Wazly replies to your customers automatically, hands conversations to your team when they need a person, and keeps everything in one place.',
              )}
            </p>

            {/* Scroll opacity lives on a wrapper so it never fights the
                entrance animation for the same property. */}
            <div style={{ opacity: ctaOpacity }}>
              <div
                className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-in-up"
                style={{ animationDelay: '300ms' }}
              >
                <Button size="lg" onClick={onLaunchApp} className="group">
                  {pick('ابدأ مجانًا', 'Start free')}
                  <ArrowRight className="w-4 h-4 flip-rtl transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button size="lg" variant="outline" onClick={onLaunchApp}>
                  {pick('شوف Wazly بيشتغل إزاي', 'See how Wazly works')}
                </Button>
              </div>

              <div
                className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 justify-center lg:justify-start text-xs text-subtle animate-fade-in"
                style={{ animationDelay: '500ms' }}
              >
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-brand" />
                  {pick('من غير كرت ائتمان', 'No credit card needed')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-brand" />
                  {pick('تفعيل في 5 دقايق', 'Set up in 5 minutes')}
                </span>
              </div>
            </div>
          </div>

          {/* The live conversation is the hero visual. It grows into place and
              gains elevation as you scroll — §2's "becomes more prominent". */}
          <div
            style={{
              transform: `translate3d(0, ${cardY}px, 0) scale(${cardScale})`,
              willChange: 'transform',
            }}
          >
            <div
              className="animate-fade-in-up rounded-2xl"
              style={{
                animationDelay: '300ms',
                boxShadow: `0 ${round(6 + cardLift * 18, 1)}px ${round(
                  18 + cardLift * 34,
                  1,
                )}px -12px hsl(var(--shadow-color) / ${round(0.06 + cardLift * 0.12, 3)})`,
              }}
            >
              <HeroConversation />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stat strip ──────────────────────────────────────────────
function LogoStrip() {
  const { pick } = useLang();
  const k = analyticsData.kpis;

  // Pulled from the same data the product uses, so the two never disagree.
  const stats = [
    { value: k.conversations.value.toLocaleString('en-US'), label: pick('محادثة الشهر ده', 'Conversations this month') },
    { value: `${k.aiResolution.value}%`, label: pick('حلها الـ AI', 'Resolved by AI') },
    { value: `${k.responseTime.value}${pick('ث', 's')}`, label: pick('متوسط وقت الرد', 'Average response time') },
    { value: '4', label: pick('قنوات مربوطة', 'Connected channels') },
  ];

  return (
    <section className="py-8 border-y border-app bg-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={s.label} className="text-center" style={{ opacity: 0, animation: `fadeInUp 0.5s ease-out ${i * 100}ms forwards` }}>
              <div className="text-2xl md:text-3xl font-bold text-main num">{s.value}</div>
              <div className="text-xs text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Omnichannel ────────────────────────────────────────────
// §13 pattern: horizontal movement. The logical reveal classes flip under RTL.
function OmnichannelSection() {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const on = visible ? 'is-revealed' : '';

  const items = [
    { title: pick('صندوق واحد', 'One inbox'), desc: pick('كل القنوات في شاشة واحدة', 'Every channel in a single view') },
    { title: pick('رد فوري', 'Instant replies'), desc: pick('الـ AI بيرد في ثواني، مش ساعات', 'AI answers in seconds, not hours') },
    { title: pick('تحليل لكل قناة', 'Per-channel insight'), desc: pick('اعرف أنهي قناة بتجيبلك عملاء فعلًا', 'See which channel actually brings customers') },
  ];

  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div ref={ref} className={`reveal reveal-start ${on}`}>
            <SectionLabel icon={MessageCircle}>{pick('كل القنوات', 'Omnichannel')}</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold text-main mt-3 mb-4 leading-[1.4]">
              {pick('كل محادثات عملائك في مكان واحد', 'Every conversation in one place')}
            </h2>
            <p className="text-muted text-lg leading-[1.9] mb-6">
              {pick(
                'واتساب، إنستجرام، ماسنجر وتعليقات فيسبوك — كلهم مربوطين بـ Wazly. الرسايل بتدخل من أي قناة، والـ AI بيرد على طول.',
                'WhatsApp, Instagram, Messenger and Facebook comments all connect to Wazly. Messages arrive from any channel and the AI answers straight away.',
              )}
            </p>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div
                  key={item.title}
                  className={`flex items-start gap-3 reveal reveal-start ${on}`}
                  style={{ transitionDelay: `${stagger(i, 90, 300)}ms` }}
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
          <div className={`reveal reveal-end ${on}`} style={{ transitionDelay: '120ms' }}>
            <OmnichannelAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Handoff ───────────────────────────────────────────────
function HandoffSection() {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const on = visible ? 'is-revealed' : '';

  const items = [
    { title: pick('بيعرف إمتى يحوّل', 'Knows when to hand over'), desc: pick('الـ AI بيلاحظ لما المحادثة تحتاج موظف', 'The AI notices when a conversation needs a person') },
    { title: pick('السياق بيتنقل معاه', 'The context travels with it'), desc: pick('الموظف بيشوف المحادثة كاملة، محدش بيعيد كلامه', 'Operators see the whole thread, so nobody repeats themselves') },
    { title: pick('بيتوزع لوحده', 'Routes itself'), desc: pick('المحادثة بتروح للشخص المناسب في الفريق', 'Conversations reach the right person on your team') },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className={`order-2 lg:order-1 reveal reveal-scale ${on}`}>
            <HandoffAnimation />
          </div>
          <div ref={ref} className={`order-1 lg:order-2 reveal reveal-end ${on}`}>
            <SectionLabel icon={Users}>{pick('التحويل لموظف', 'Human handoff')}</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold text-main mt-3 mb-4 leading-[1.4]">
              {pick('اتدخل في المحادثة وقت ما تحتاج', 'Step into the conversation when you need to')}
            </h2>
            <p className="text-muted text-lg leading-[1.9] mb-6">
              {pick(
                'الـ AI بيتولى الأسئلة المتكررة. ولما العميل يحتاج يتكلم مع حد، المحادثة بتتحوّل للموظف المناسب بكل التفاصيل.',
                'The AI takes the repetitive questions. When a customer wants a person, the conversation moves to the right member of your team with everything they need.',
              )}
            </p>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div
                  key={item.title}
                  className={`flex items-start gap-3 reveal reveal-up ${on}`}
                  style={{ transitionDelay: `${stagger(i, 90, 300)}ms` }}
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

// ─── Knowledge ─────────────────────────────────────────────
// §13 pattern: elements converge. The animation itself does the converging;
// the section frames it with a settle-into-place scale.
function KnowledgeSection() {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const on = visible ? 'is-revealed' : '';

  const items = [
    { title: pick('أي نوع ملف', 'Any file type'), desc: pick('PDF، نص، أسئلة متكررة، قوائم أسعار', 'PDFs, text, FAQs, price lists') },
    { title: pick('بيتعلم على طول', 'Always current'), desc: pick('ضيف معلومة جديدة في أي وقت والـ AI يتحدّث فورًا', 'Add information any time and the AI updates immediately') },
    { title: pick('بيقولك المصدر', 'Shows its source'), desc: pick('كل رد بيوريك جاب المعلومة منفين', 'Every answer shows where it came from') },
  ];

  return (
    <section className="py-24 bg-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div ref={ref} className={`reveal reveal-rise ${on}`}>
            <SectionLabel icon={Brain}>{pick('معرفة الشركة', 'Company knowledge')}</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold text-main mt-3 mb-4 leading-[1.4]">
              {pick('علّم Wazly شغلك', 'Teach Wazly your business')}
            </h2>
            <p className="text-muted text-lg leading-[1.9] mb-6">
              {pick(
                'ارفع بيانات شركتك، خدماتك، أسعارك وشروط التعاقد. Wazly بيتعلم منهم ويرد على عملائك بمعلومة صح وبأسلوبك.',
                'Upload your company details, services, prices and terms. Wazly learns from them and answers customers accurately, in your own voice.',
              )}
            </p>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div
                  key={item.title}
                  className={`flex items-start gap-3 reveal reveal-up ${on}`}
                  style={{ transitionDelay: `${stagger(i, 90, 300)}ms` }}
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
          <div className={`reveal reveal-scale ${on}`} style={{ transitionDelay: '120ms' }}>
            <KnowledgeAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Analytics ─────────────────────────────────────────────
// §13 pattern: chart drawing, expressed as a clip-path wipe on the frame.
// §8: the dashboard travels 40px against the grid's 15px.
function AnalyticsSection() {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const reduced = usePrefersReducedMotion();
  const { ref: parallaxRef, progress } = useScrollProgress<HTMLDivElement>({
    disabled: reduced,
  });

  const p = reduced ? 0.5 : progress;
  const frontY = reduced ? 0 : round(mapRange(p, 0.15, 0.85, 20, -20), 2);
  const backY = reduced ? 0 : round(mapRange(p, 0.15, 0.85, 7.5, -7.5), 2);

  return (
    <section id="analytics" ref={parallaxRef} className="relative py-20 overflow-hidden">
      {/* The slower layer §8 asks for */}
      <div
        className="absolute inset-x-0 top-1/4 h-2/3 dot-pattern opacity-[0.22] pointer-events-none"
        style={{ transform: `translate3d(0, ${backY}px, 0)`, willChange: 'transform' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <SectionLabel icon={BarChart3}>{pick('التحليلات', 'Analytics')}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-main mt-3 leading-[1.4]">
            {pick('اعرف شغلك ماشي إزاي', 'Know how the business is doing')}
          </h2>
          <p className="text-muted text-lg mt-3 leading-[1.9]">
            {pick(
              'أرقام لحظية للمحادثات، أداء الـ AI، العملاء المحتملين ووقت الرد.',
              'Live figures for conversations, AI performance, leads and response time.',
            )}
          </p>
        </div>
        <div style={{ transform: `translate3d(0, ${frontY}px, 0)`, willChange: 'transform' }}>
          <div ref={ref} className={`reveal reveal-clip ${visible ? 'is-revealed' : ''}`}>
            <AnalyticsPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────
// §13 pattern: horizontal reveal. One stagger for the whole card, not a
// separate animation per line inside it.
function TestimonialsSection() {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const on = visible ? 'is-revealed' : '';

  const testimonials = [
    {
      quote: pick(
        'قبل Wazly كان في رسايل بتفضل بدون رد لحد تاني يوم الصبح. دلوقتي الـ AI بيرد على طول، والفريق بيتدخل بس في الحالات اللي محتاجة فعلًا.',
        'Messages used to sit unanswered until the next morning. Now the AI replies immediately and the team only steps in where it actually matters.',
      ),
      name: pick('مروان عبد الله', 'Marwan Abdallah'),
      role: pick('مدير التشغيل', 'Operations manager'),
      org: pick('شركة الكيان للتشطيبات', 'Al Kayan Finishing'),
    },
    {
      quote: pick(
        'أهم حاجة إن العميل مش مستني. ولما يطلب يتكلم مع حد من المبيعات، المحادثة بتتحوّل بكل تفاصيلها فمحدش بيعيد كلامه من الأول.',
        "What matters is that the customer isn't left waiting. When they ask for sales, the whole thread moves across, so nobody repeats themselves.",
      ),
      name: pick('هدى شاكر', 'Hoda Shaker'),
      role: pick('مسؤولة خدمة العملاء', 'Customer service lead'),
      org: pick('مفروشات النيل', 'Nile Furnishings'),
    },
    {
      quote: pick(
        'الأرقام هي اللي أقنعتني. حوالي 8 من كل 10 محادثات بيحلها الـ AI لوحده، وده وفّر علينا توظيف اتنين زيادة الموسم ده.',
        'The numbers convinced me. Roughly 8 in 10 conversations are resolved by the AI alone, which saved us two extra hires this season.',
      ),
      name: pick('طارق منصور', 'Tarek Mansour'),
      role: pick('شريك مؤسس', 'Co-founder'),
      org: pick('أوركيد للعقارات', 'Orchid Real Estate'),
    },
  ];

  return (
    <section className="py-20">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`max-w-2xl mb-10 reveal reveal-up ${on}`}>
          <SectionLabel icon={Quote}>{pick('رأي العملاء', 'Customers')}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-main mt-3 leading-[1.4]">
            {pick('شركات بتستخدم Wazly كل يوم', 'Businesses using Wazly every day')}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((item, i) => (
            <figure
              key={item.name}
              className={`bg-app border border-app rounded-2xl p-6 flex flex-col reveal reveal-end ${on}`}
              style={{ transitionDelay: `${stagger(i, 110, 330)}ms` }}
            >
              <blockquote className="text-sm text-main leading-[1.9] flex-1" dir="auto">
                {item.quote}
              </blockquote>
              <figcaption className="mt-5 pt-4 border-t border-app flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-bg text-brand flex items-center justify-center text-sm font-semibold shrink-0">
                  {item.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-main truncate">{item.name}</div>
                  <div className="text-xs text-muted truncate">
                    {item.role} · {item.org}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ───────────────────────────────────────────────
// §13 pattern: stagger reveal — opacity + translateY + a small scale, no bounce.
function PricingSection({ onLaunchApp }: { onLaunchApp: () => void }) {
  const { pick, isRTL } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const on = visible ? 'is-revealed' : '';
  const [annual, setAnnual] = useState(false);

  // Annual is ten months' price: the familiar "two months free".
  const MONTHS_BILLED = 10;

  return (
    <section id="pricing" className="py-24 bg-subtle">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 reveal reveal-up ${on}`}>
          <SectionLabel icon={Zap}>{pick('الأسعار', 'Pricing')}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-main mt-3 leading-[1.4]">
            {pick('باقات بتكبر مع شغلك', 'Plans that grow with you')}
          </h2>
          <p className="text-muted text-lg mt-3">
            {pick('ابدأ مجانًا، وارفّع لما تحتاج.', 'Start free. Upgrade when you need to.')}
          </p>
        </div>

        {/* Billing toggle. The pill slides with a transform rather than an
            animated layout property, and the direction flips under RTL. */}
        <div className={`flex justify-center mb-10 reveal reveal-up ${on}`} style={{ transitionDelay: '80ms' }}>
          <div className="relative inline-flex items-center p-1 rounded-full bg-app border border-app">
            <div
              className="absolute top-1 bottom-1 start-1 rounded-full bg-brand-600 dark:bg-brand-500 transition-transform duration-300 ease-smooth"
              style={{
                width: 'calc(50% - 0.25rem)',
                transform: annual ? `translateX(${isRTL ? '-100%' : '100%'})` : 'none',
              }}
              aria-hidden="true"
            />
            {([false, true] as const).map(isAnnual => (
              <button
                key={String(isAnnual)}
                type="button"
                onClick={() => setAnnual(isAnnual)}
                aria-pressed={annual === isAnnual}
                className={`relative z-10 px-5 py-1.5 text-sm font-medium rounded-full transition-colors duration-300 whitespace-nowrap ${
                  annual === isAnnual ? 'text-white' : 'text-muted hover:text-main'
                }`}
              >
                {isAnnual ? pick('سنويًا', 'Annual') : pick('شهريًا', 'Monthly')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pricingPlans.map((plan, i) => (
            <div
              key={plan.nameEn}
              className={`relative bg-app border rounded-2xl p-6 reveal reveal-rise ${on} ${
                plan.highlighted ? 'border-brand-500 shadow-medium' : 'border-app'
              }`}
              style={{ transitionDelay: `${stagger(i, 100, 400)}ms` }}
            >
              {/* Emphasis for the recommended plan: a brand ring that fades in
                  just after the card has landed. */}
              {plan.highlighted && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-brand-500/50 transition-opacity duration-700 ease-smooth"
                  style={{ opacity: visible ? 1 : 0, transitionDelay: '650ms' }}
                  aria-hidden="true"
                />
              )}

              {plan.highlighted && (
                <div className="absolute -top-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 px-3 py-1 bg-brand-600 dark:bg-brand-500 text-white text-xs font-medium rounded-full whitespace-nowrap">
                  {pick('الأكتر اختيارًا', 'Most popular')}
                </div>
              )}
              <div className="text-sm font-semibold text-main mb-1">{pick(plan.name, plan.nameEn)}</div>
              <div className="flex items-baseline gap-1.5 mb-5 min-h-[2.75rem]">
                {plan.price !== null ? (
                  <>
                    {/* Keyed on the billing period so the figure cross-fades
                        instead of snapping when the toggle moves. */}
                    <span
                      key={annual ? 'y' : 'm'}
                      className="text-3xl font-bold text-main num animate-fade-in"
                    >
                      {(annual ? plan.price * MONTHS_BILLED : plan.price).toLocaleString('en-US')}
                    </span>
                    <span className="text-sm text-muted">
                      {annual ? pick('/ سنة', '/year') : pick(plan.period, plan.periodEn)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-main">{pick('حسب الطلب', 'Custom')}</span>
                )}
              </div>
              <ul className="space-y-2 mb-6">
                {pick(plan.features, plan.featuresEn).map(f => (
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
                {plan.price === null ? pick('كلّم المبيعات', 'Contact sales') : pick('ابدأ دلوقتي', 'Get started')}
              </Button>
            </div>
          ))}
        </div>

        {annual && (
          <p className="text-center text-xs text-muted mt-5 animate-fade-in">
            {pick('الأسعار السنوية محسوبة على 10 شهور — شهرين مجانًا.', 'Annual pricing is billed as 10 months — two months free.')}
          </p>
        )}
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────
function CTASection({ onLaunchApp }: { onLaunchApp: () => void }) {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="py-20">
      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flat brand panel rather than a gradient */}
        <div
          className={`relative overflow-hidden rounded-2xl bg-brand-800 dark:bg-brand-900 p-10 sm:p-12 text-center reveal reveal-scale ${
            visible ? 'is-revealed' : ''
          }`}
        >
          <div className="absolute inset-0 dot-pattern opacity-10" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-medium text-white mb-6">
              <Clock className="w-3.5 h-3.5" />
              {pick('تفعيل في 5 دقايق', 'Live in 5 minutes')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-[1.4]">
              {pick('رد على عملائك أسرع، ابتداءً من النهارده', 'Answer your customers faster, starting today')}
            </h2>
            <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto leading-[1.9]">
              {pick(
                'اربط قنواتك، علّم Wazly على شغلك، وسيبه يتولى الباقي.',
                'Connect your channels, teach Wazly your business, and let it take the rest.',
              )}
            </p>
            <Button
              size="lg"
              onClick={onLaunchApp}
              className="group bg-white text-brand-700 hover:bg-brand-50 dark:bg-white dark:text-brand-700"
            >
              {pick('ابدأ مجانًا', 'Start free')}
              <ArrowRight className="w-4 h-4 flip-rtl transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────
function Footer() {
  const { pick } = useLang();

  const columns = [
    {
      title: pick('المنتج', 'Product'),
      links: pick(
        ['المميزات', 'الأسعار', 'الربط', 'التحليلات'],
        ['Features', 'Pricing', 'Integrations', 'Analytics'],
      ),
    },
    {
      title: pick('الشركة', 'Company'),
      links: pick(['من إحنا', 'المدونة', 'وظائف', 'تواصل معانا'], ['About', 'Blog', 'Careers', 'Contact']),
    },
    {
      title: pick('قانوني', 'Legal'),
      links: pick(['الخصوصية', 'الشروط', 'الأمان', 'حالة الخدمة'], ['Privacy', 'Terms', 'Security', 'Status']),
    },
  ];

  return (
    <footer className="border-t border-app py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-main font-latin">Wazly</span>
            </div>
            <p className="text-sm text-muted leading-[1.8]">
              {pick('خدمة عملاء بالـ AI على كل القنوات.', 'AI customer support across every channel.')}
            </p>
          </div>
          {columns.map(col => (
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
          {pick('© 2026 Wazly. كل الحقوق محفوظة.', '© 2026 Wazly. All rights reserved.')}
        </div>
      </div>
    </footer>
  );
}

// ─── Reusable label ──────────────────────────────────────────
function SectionLabel({ children, icon: Icon }: { children: React.ReactNode; icon: LucideIcon }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-bg text-xs font-medium text-brand">
      <Icon className="w-3.5 h-3.5" />
      {children}
    </div>
  );
}
