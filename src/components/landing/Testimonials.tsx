import { useLang } from '@/lib/i18n';
import { Eyebrow } from '@/components/ui';

type Quote = {
  id: string;
  ar: string;
  en: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  results: Array<{ figure: string; ar: string; en: string }>;
};

const QUOTES: Quote[] = [
  {
    id: 'marwan',
    ar: 'الرد على العملاء بقى أسرع بشكل واضح، وفريق المبيعات بقى يركز على العملاء المهمين.',
    en: 'Replies got noticeably faster, and the sales team now spends its time on the customers that matter.',
    nameAr: 'مروان عبد الله',
    nameEn: 'Marwan Abdullah',
    roleAr: 'مدير التسويق ، شركة الكيان للتشطيبات',
    roleEn: 'Marketing lead, Al Kayan Finishing',
    results: [
      { figure: '+37%', ar: 'عملاء محتملين', en: 'leads' },
      { figure: '−52%', ar: 'وقت الرد', en: 'response time' },
    ],
  },
  {
    id: 'hoda',
    ar: 'كنت باسيب كومنتات إنستجرام أيام بدون رد. دلوقتي مفيش رسالة بتفوت.',
    en: 'Instagram comments used to sit for days. Now nothing slips through.',
    nameAr: 'هدى شاكر',
    nameEn: 'Hoda Shaker',
    roleAr: 'صاحبة براند ، أتيليه هدى',
    roleEn: 'Founder, Atelier Hoda',
    results: [
      { figure: '×2.4', ar: 'ردود أسرع', en: 'faster replies' },
      { figure: '0', ar: 'رسالة متسيبة', en: 'missed messages' },
    ],
  },
  {
    id: 'tarek',
    ar: 'أول مرة أقدر أشوف كل محادثات الفروع في مكان واحد وأعرف مين محتاج متابعة.',
    en: 'For the first time I can see every branch conversation in one place and know who needs following up.',
    nameAr: 'طارق منصور',
    nameEn: 'Tarek Mansour',
    roleAr: 'مدير المبيعات ، النخبة للأثاث',
    roleEn: 'Sales director, Al Nokhba Furniture',
    results: [
      { figure: '+48%', ar: 'محادثات مأهلة', en: 'qualified chats' },
      { figure: '24/7', ar: 'تغطية', en: 'coverage' },
    ],
  },
];

export function Testimonials() {
  const { pick } = useLang();

  return (
    <section className="py-section-sm sm:py-section">
      <div className="max-w-shell mx-auto px-5 sm:px-8">
        <Eyebrow index="06">{pick('عملاء Wazly', 'Customers')}</Eyebrow>
      </div>

      {/* Native scroll-snap: swipes on touch, scrolls with a trackpad, is
          keyboard reachable, and gets RTL direction right without any work. */}
      <div
        className="no-scrollbar edge-fade mt-10 flex snap-x snap-mandatory gap-8 overflow-x-auto px-5 pb-2 sm:gap-12 sm:px-8"
        tabIndex={0}
        role="region"
        aria-label={pick('رأي العملاء', 'Customer quotes')}
      >
        {QUOTES.map(quote => (
          <figure
            key={quote.id}
            className="w-[86vw] shrink-0 snap-start sm:w-[62vw] lg:w-[44vw] lg:max-w-[34rem]"
          >
            <blockquote
              dir="auto"
              className="text-display-3 font-medium leading-snug text-main"
            >
              {pick(quote.ar, quote.en)}
            </blockquote>

            <figcaption className="mt-8 border-t border-app pt-5">
              <div className="text-[13px] font-medium text-main">
                {pick(quote.nameAr, quote.nameEn)}
              </div>
              <div className="mt-0.5 text-[12px] text-subtle">
                {pick(quote.roleAr, quote.roleEn)}
              </div>

              <div className="mt-5 flex gap-8">
                {quote.results.map(result => (
                  <div key={result.en}>
                    <div className="num text-lg font-semibold text-brand">{result.figure}</div>
                    <div className="mt-0.5 text-[11px] text-muted">{pick(result.ar, result.en)}</div>
                  </div>
                ))}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
