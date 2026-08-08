import {
  Sparkles, Zap, MessageCircle, Brain, BarChart3, GitBranch, Users, Clock,
  ArrowRight, Check, type LucideIcon,
} from 'lucide-react';
import { HeroConversation } from './HeroConversation';
import { OmnichannelAnimation } from './OmnichannelAnimation';
import { HandoffAnimation } from './HandoffAnimation';
import { KnowledgeAnimation } from './KnowledgeAnimation';
import { AnalyticsPreview } from './AnalyticsPreview';
import { LandingNav } from './LandingNav';
import { Button } from '@/components/ui';
import { useReveal } from '@/lib/hooks';
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

// ─── Hero ─────────────────────────────────────────────────
function HeroSection({ onLaunchApp }: { onLaunchApp: () => void }) {
  const { pick } = useLang();

  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      {/* One quiet background treatment, not three stacked on top of each other */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Deliberately not a perfect 50/50 split */}
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-start">
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

          {/* The live conversation is the hero visual */}
          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <HeroConversation />
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
function OmnichannelSection() {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.15 });

  const items = [
    { title: pick('صندوق واحد', 'One inbox'), desc: pick('كل القنوات في شاشة واحدة', 'Every channel in a single view') },
    { title: pick('رد فوري', 'Instant replies'), desc: pick('الـ AI بيرد في ثواني، مش ساعات', 'AI answers in seconds, not hours') },
    { title: pick('تحليل لكل قناة', 'Per-channel insight'), desc: pick('اعرف أنهي قناة بتجيبلك عملاء فعلًا', 'See which channel actually brings customers') },
  ];

  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div ref={ref}>
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
                  className="flex items-start gap-3 transition-all duration-500"
                  style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)', transitionDelay: `${i * 150 + 200}ms` }}
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
          <div className={visible ? 'animate-fade-in' : 'opacity-0'}>
            <OmnichannelAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How it works ───────────────────────────────────────────
function HowItWorksSection() {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.15 });

  const steps = [
    {
      icon: MessageCircle,
      title: pick('العميل بيبعت رسالة', 'A customer sends a message'),
      desc: pick('من أي قناة — واتساب، إنستجرام، ماسنجر أو تعليقات فيسبوك.', 'From any channel — WhatsApp, Instagram, Messenger or Facebook comments.'),
    },
    {
      icon: Brain,
      title: pick('الـ AI بيفهم ويدوّر', 'The AI reads and searches'),
      desc: pick('بيقرا الرسالة ويدوّر على المعلومة في معرفة الشركة.', 'It reads the message and finds the answer in your company knowledge.'),
    },
    {
      icon: Zap,
      title: pick('بيرد في ثواني', 'It answers in seconds'),
      desc: pick('عميلك بياخد رد صح في أي وقت، طول اليوم.', 'Your customer gets an accurate answer at any hour.'),
    },
    {
      icon: Users,
      title: pick('موظفك بيتدخل وقت ما يلزم', 'Your team steps in when needed'),
      desc: pick('الحالات اللي محتاجة بني آدم بتتحوّل للفريق بكل سياق المحادثة.', 'Anything that needs a person moves to your team with the full history.'),
    },
    {
      icon: BarChart3,
      title: pick('العملاء والتحليلات بتتحدّث', 'Leads and analytics update'),
      desc: pick('كل محادثة بتتسجل وتتقيّم وتتحوّل لمعلومة تقدر تشتغل عليها.', 'Every conversation is logged, scored and turned into something you can act on.'),
    },
  ];

  return (
    <section id="how" className="py-24 bg-subtle">
      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionLabel icon={GitBranch}>{pick('إزاي بيشتغل', 'How it works')}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-main mt-3 leading-[1.4]">
            {pick('من رسالة لعميل — أوتوماتيك', 'From a message to a customer — automatically')}
          </h2>
        </div>
        <div className="relative">
          {/* Rail sits on the leading edge in both directions */}
          <div className="absolute start-6 top-2 bottom-2 w-px bg-border" />
          <div className="space-y-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="flex items-start gap-5 transition-all duration-500"
                  style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transitionDelay: `${i * 150}ms` }}
                >
                  <div className="relative z-10 w-12 h-12 rounded-xl bg-brand-600 dark:bg-brand-500 flex items-center justify-center shadow-soft shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="pt-1.5">
                    <div className="text-xs font-medium text-brand mb-1">
                      {pick(`خطوة ${i + 1}`, `Step ${i + 1}`)}
                    </div>
                    <h3 className="text-lg font-semibold text-main">{step.title}</h3>
                    <p className="text-sm text-muted mt-1 leading-[1.8]">{step.desc}</p>
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

// ─── Handoff ───────────────────────────────────────────────
function HandoffSection() {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.15 });

  const items = [
    { title: pick('بيعرف إمتى يحوّل', 'Knows when to hand over'), desc: pick('الـ AI بيلاحظ لما المحادثة تحتاج موظف', 'The AI notices when a conversation needs a person') },
    { title: pick('السياق بيتنقل معاه', 'The context travels with it'), desc: pick('الموظف بيشوف المحادثة كاملة، محدش بيعيد كلامه', 'Operators see the whole thread, so nobody repeats themselves') },
    { title: pick('بيتوزع لوحده', 'Routes itself'), desc: pick('المحادثة بتروح للشخص المناسب في الفريق', 'Conversations reach the right person on your team') },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className={`order-2 lg:order-1 ${visible ? 'animate-fade-in' : 'opacity-0'}`}>
            <HandoffAnimation />
          </div>
          <div ref={ref} className="order-1 lg:order-2">
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
                  className="flex items-start gap-3 transition-all duration-500"
                  style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)', transitionDelay: `${i * 150 + 200}ms` }}
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
function KnowledgeSection() {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.15 });

  const items = [
    { title: pick('أي نوع ملف', 'Any file type'), desc: pick('PDF، نص، أسئلة متكررة، قوائم أسعار', 'PDFs, text, FAQs, price lists') },
    { title: pick('بيتعلم على طول', 'Always current'), desc: pick('ضيف معلومة جديدة في أي وقت والـ AI يتحدّث فورًا', 'Add information any time and the AI updates immediately') },
    { title: pick('بيقولك المصدر', 'Shows its source'), desc: pick('كل رد بيوريك جاب المعلومة منفين', 'Every answer shows where it came from') },
  ];

  return (
    <section className="py-24 bg-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div ref={ref}>
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
                  className="flex items-start gap-3 transition-all duration-500"
                  style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)', transitionDelay: `${i * 150 + 200}ms` }}
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
          <div className={visible ? 'animate-fade-in' : 'opacity-0'}>
            <KnowledgeAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Analytics ─────────────────────────────────────────────
function AnalyticsSection() {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section id="analytics" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div ref={ref} className={visible ? 'animate-fade-in-up' : 'opacity-0'}>
          <AnalyticsPreview />
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ───────────────────────────────────────────────
function PricingSection({ onLaunchApp }: { onLaunchApp: () => void }) {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="pricing" className="py-24 bg-subtle">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SectionLabel icon={Zap}>{pick('الأسعار', 'Pricing')}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-main mt-3 leading-[1.4]">
            {pick('باقات بتكبر مع شغلك', 'Plans that grow with you')}
          </h2>
          <p className="text-muted text-lg mt-3">
            {pick('ابدأ مجانًا، وارفّع لما تحتاج.', 'Start free. Upgrade when you need to.')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pricingPlans.map((plan, i) => (
            <div
              key={plan.nameEn}
              className={`relative bg-app border rounded-2xl p-6 transition-all duration-500 ${
                plan.highlighted ? 'border-brand-500 shadow-medium' : 'border-app'
              } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 px-3 py-1 bg-brand-600 dark:bg-brand-500 text-white text-xs font-medium rounded-full whitespace-nowrap">
                  {pick('الأكتر اختيارًا', 'Most popular')}
                </div>
              )}
              <div className="text-sm font-semibold text-main mb-1">{pick(plan.name, plan.nameEn)}</div>
              <div className="flex items-baseline gap-1.5 mb-5">
                {plan.price !== null ? (
                  <>
                    <span className="text-3xl font-bold text-main num">{plan.price.toLocaleString('en-US')}</span>
                    <span className="text-sm text-muted">{pick(plan.period, plan.periodEn)}</span>
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
          className={`relative overflow-hidden rounded-2xl bg-brand-800 dark:bg-brand-900 p-10 sm:p-12 text-center transition-all duration-500 ${
            visible ? 'opacity-100' : 'opacity-0'
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
