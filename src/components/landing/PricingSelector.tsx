import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import { useReveal } from '@/lib/hooks';
import { stagger } from '@/lib/motion';
import { Button, Eyebrow } from '@/components/ui';

type Plan = {
  id: string;
  ar: string;
  en: string;
  /** Monthly price in EGP. `null` means "talk to us". */
  price: number | null;
  forAr: string;
  forEn: string;
  recommended?: boolean;
  specs: Array<{ ar: string; en: string }>;
};

const SPEC_ROWS: Array<{ ar: string; en: string }> = [
  { ar: 'عدد المحادثات', en: 'Conversations' },
  { ar: 'القنوات', en: 'Channels' },
  { ar: 'المستخدمين', en: 'Users' },
  { ar: 'استخدام الـ AI', en: 'AI usage' },
  { ar: 'المعرفة', en: 'Knowledge' },
  { ar: 'التحليلات', en: 'Analytics' },
];

const PLANS: Plan[] = [
  {
    id: 'starter',
    ar: 'البداية',
    en: 'Starter',
    price: 499,
    forAr: 'للبدايات والمشاريع الصغيرة',
    forEn: 'For small teams getting started',
    specs: [
      { ar: '1,000 محادثة شهريًا', en: '1,000 conversations / month' },
      { ar: 'قناتين', en: 'Two channels' },
      { ar: 'مستخدمين', en: '2 users' },
      { ar: 'ردود أساسية', en: 'Standard replies' },
      { ar: '20 ملف', en: '20 files' },
      { ar: 'تقارير أساسية', en: 'Core reports' },
    ],
  },
  {
    id: 'growth',
    ar: 'النمو',
    en: 'Growth',
    price: 999,
    forAr: 'للشركات اللي بتكبر',
    forEn: 'For growing businesses',
    specs: [
      { ar: '5,000 محادثة شهريًا', en: '5,000 conversations / month' },
      { ar: '4 قنوات', en: 'Four channels' },
      { ar: '6 مستخدمين', en: '6 users' },
      { ar: 'ردود متقدمة + تحويل للفريق', en: 'Advanced replies + handoff' },
      { ar: '200 ملف', en: '200 files' },
      { ar: 'تقارير كاملة', en: 'Full reporting' },
    ],
  },
  {
    id: 'business',
    ar: 'الأعمال',
    en: 'Business',
    price: 1999,
    forAr: 'للفرق اللي بتتعامل مع حجم كبير',
    forEn: 'For teams handling real volume',
    recommended: true,
    specs: [
      { ar: '20,000 محادثة شهريًا', en: '20,000 conversations / month' },
      { ar: 'كل القنوات', en: 'Every channel' },
      { ar: '20 مستخدم', en: '20 users' },
      { ar: 'تخصيص كامل للردود', en: 'Fully tuned replies' },
      { ar: 'ملفات غير محدودة', en: 'Unlimited files' },
      { ar: 'تقارير كاملة + تصدير', en: 'Full reporting + export' },
    ],
  },
  {
    id: 'enterprise',
    ar: 'المأسسات',
    en: 'Enterprise',
    price: null,
    forAr: 'للمؤسسات والمتطلبات الخاصة',
    forEn: 'For organisations with specific needs',
    specs: [
      { ar: 'محادثات غير محدودة', en: 'Unlimited conversations' },
      { ar: 'كل القنوات', en: 'Every channel' },
      { ar: 'مستخدمين غير محدودين', en: 'Unlimited users' },
      { ar: 'موديل مخصص لنشاطك', en: 'Model tuned to your business' },
      { ar: 'معرفة غير محدودة', en: 'Unlimited knowledge' },
      { ar: 'تقارير + وصول API', en: 'Reporting + API access' },
    ],
  },
];

/** Yearly bills ten months and gives two away. */
const MONTHS_BILLED = 10;

interface PricingSelectorProps {
  onLaunchApp: () => void;
}

export function PricingSelector({ onLaunchApp }: PricingSelectorProps) {
  const { pick, n } = useLang();
  const [activeId, setActiveId] = useState('business');
  const [yearly, setYearly] = useState(false);
  const { ref, visible } = useReveal<HTMLDivElement>();

  const activeIndex = Math.max(0, PLANS.findIndex(plan => plan.id === activeId));
  const plan = PLANS[activeIndex];

  // Arrow keys move between tabs, as a tablist should.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    // Logical order: in RTL the visually-left arrow advances the list.
    const forward = event.key === 'ArrowLeft';
    const next = (activeIndex + (forward ? 1 : -1) + PLANS.length) % PLANS.length;
    setActiveId(PLANS[next].id);
  };

  return (
    <section id="pricing" className="py-section-sm sm:py-section">
      <div className="max-w-shell mx-auto px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-measure-lg">
            <Eyebrow index="07">{pick('الأسعار', 'Pricing')}</Eyebrow>
            <h2 className="mt-5 text-display-2 font-semibold text-main">
              {pick('اختار اللي يناسب حجمك.', 'Pick what fits your volume.')}
            </h2>
          </div>

          {/* Billing period */}
          <div
            className="flex items-center gap-1 rounded-lg border border-app p-0.5"
            role="group"
            aria-label={pick('دورة الفوترة', 'Billing period')}
          >
            <button
              type="button"
              onClick={() => setYearly(false)}
              aria-pressed={!yearly}
              className={`focus-ring rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                yearly ? 'text-muted hover:text-main' : 'bg-subtle text-main'
              }`}
            >
              {pick('شهري', 'Monthly')}
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              aria-pressed={yearly}
              className={`focus-ring inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                yearly ? 'bg-subtle text-main' : 'text-muted hover:text-main'
              }`}
            >
              {pick('سنوي', 'Yearly')}
              <span className="text-brand">{pick('شهرين مجانًا', '2 months free')}</span>
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- *
         * The selector. Four plans as a row of tabs on one hairline, not
         * four competing cards.
         * ---------------------------------------------------------------- */}
        <div
          role="tablist"
          aria-label={pick('الباقات', 'Plans')}
          onKeyDown={onKeyDown}
          className="mt-12 grid grid-cols-2 border-t border-app sm:grid-cols-4"
        >
          {PLANS.map(item => {
            const active = item.id === activeId;
            return (
              <button
                key={item.id}
                role="tab"
                type="button"
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                onClick={() => setActiveId(item.id)}
                className="focus-ring group relative px-4 py-5 text-start transition-colors duration-200"
              >
                {/* Selected marker sits on the shared rule above. */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -top-px h-px transition-colors duration-300 ${
                    active ? 'bg-brand-600 dark:bg-brand-400' : 'bg-transparent'
                  }`}
                />
                <span className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium transition-colors duration-200 ${
                      active ? 'text-main' : 'text-muted group-hover:text-main'
                    }`}
                  >
                    {pick(item.ar, item.en)}
                  </span>
                  {item.recommended && (
                    <span className="text-[10px] font-medium text-brand">
                      {pick('الأنسب', 'Recommended')}
                    </span>
                  )}
                </span>
                <span className="mt-1.5 block text-[11px] text-subtle">
                  {item.price === null
                    ? pick('حسب الاتفاق', 'Custom')
                    : pick(`من ${n(item.price)} ج.م`, `From EGP ${n(item.price)}`)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail panel for the selected plan. */}
        <div ref={ref} className="border-t border-app pt-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <div>
              <div className="flex items-baseline gap-2">
                {plan.price === null ? (
                  <span className="text-display-3 font-semibold text-main">
                    {pick('نتكلم سوا', "Let's talk")}
                  </span>
                ) : (
                  <>
                    <span className="num text-display-2 font-semibold text-main">
                      {n(yearly ? plan.price * MONTHS_BILLED : plan.price)}
                    </span>
                    <span className="text-sm text-muted">
                      {yearly ? pick('ج.م / سنة', 'EGP / year') : pick('ج.م / شهر', 'EGP / month')}
                    </span>
                  </>
                )}
              </div>
              <p className="mt-3 max-w-measure text-sm leading-relaxed text-muted">
                {pick(plan.forAr, plan.forEn)}
              </p>
              <div className="mt-7">
                <Button size="lg" variant={plan.recommended ? 'primary' : 'secondary'} onClick={onLaunchApp}>
                  {plan.price === null
                    ? pick('احجز عرضًا', 'Book a demo')
                    : pick('ابدأ مجانًا', 'Start free')}
                </Button>
              </div>
            </div>

            {/* Specs as rows on hairlines: a table reads faster than boxes. */}
            <dl className="divide-y divide-app border-t border-app">
              {SPEC_ROWS.map((row, index) => (
                <div
                  key={row.en}
                  className={`reveal reveal-up flex items-baseline justify-between gap-6 py-3.5 ${
                    visible ? 'is-revealed' : ''
                  }`}
                  style={{ transitionDelay: `${stagger(index, 60, 360)}ms` }}
                >
                  <dt className="text-[13px] text-muted">{pick(row.ar, row.en)}</dt>
                  <dd className="text-[13px] font-medium text-end text-main">
                    {pick(plan.specs[index].ar, plan.specs[index].en)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
