import { useLang } from '@/lib/i18n';
import { useScrollProgress, usePrefersReducedMotion, useIsCompact } from '@/lib/hooks';
import { clamp01, easeOut, mapRange, round } from '@/lib/motion';
import { Avatar, Button, ChannelBadge } from '@/components/ui';
import { BookOpen, Check, Send } from 'lucide-react';

interface HeroStoryProps {
  onLaunchApp: () => void;
}

type BeatKind =
  | 'customer'
  | 'ai'
  | 'operator'
  | 'thinking'
  | 'source'
  | 'ok'
  | 'handoff'
  | 'resolved';

type Beat = { id: string; at: number; kind: BeatKind; ar: string; en: string };

/**
 * The eight stages, expressed as the scroll progress at which each beat
 * begins. Spacing is deliberately uneven: the question and the answer get
 * room to be read, the machine states pass quickly. Even spacing is what
 * makes scroll stories feel mechanical.
 */
const BEATS: Beat[] = [
  {
    id: 'c1',
    at: 0.1,
    kind: 'customer',
    ar: 'مساء الخير، ممكن أعرف أسعار التشطيبات؟',
    en: 'Good evening — could I get your finishing prices?',
  },
  {
    id: 't1',
    at: 0.32,
    kind: 'thinking',
    ar: 'جاري تحليل السؤال...',
    en: 'Analysing the question…',
  },
  {
    id: 's1',
    at: 0.44,
    kind: 'source',
    ar: 'تم العزور على معلومات من قاعدة معرفة الشركة',
    en: 'Found information in your company knowledge base',
  },
  {
    id: 'a1',
    at: 0.55,
    kind: 'ai',
    ar: 'أهلاً بحضرتك إوأكيد، عندنا باقات تشطيب مختلفة حسب مساحة المشروع...',
    en: 'Hello إوOf course — we have finishing packages that vary by project size…',
  },
  { id: 'k1', at: 0.64, kind: 'ok', ar: 'تم الرد بنجاح', en: 'Replied successfully' },
  {
    id: 'h1',
    at: 0.74,
    kind: 'handoff',
    ar: 'العميل طلب التحدّث مع الفريق',
    en: 'Customer asked for the team',
  },
  {
    id: 'o1',
    at: 0.82,
    kind: 'operator',
    ar: 'أهلاً أستاذ محمد، معاك ياسمين من فريق المبيعات. تحت أمرك.',
    en: 'Hello Mohamed, this is Yasmin from sales — how can I help?',
  },
  { id: 'r1', at: 0.92, kind: 'resolved', ar: 'تم استلام المحادثة', en: 'Conversation picked up' },
];

/** Customer → Wazly → AI → Business, as a state rather than an illustration. */
const NODES: Array<{ ar: string; en: string; at: number; latin?: boolean }> = [
  { ar: 'العميل', en: 'Customer', at: 0 },
  { ar: 'Wazly', en: 'Wazly', at: 0.22, latin: true },
  { ar: 'الـ AI', en: 'AI', at: 0.44 },
  { ar: 'فريقك', en: 'Your team', at: 0.74 },
];

const WINDOW = 0.075;

export function HeroStory({ onLaunchApp }: HeroStoryProps) {
  const { pick, isRTL } = useLang();
  const reduced = usePrefersReducedMotion();
  const compact = useIsCompact();
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    mode: 'sticky',
    disabled: reduced,
  });

  // When motion is off, pin the story to its final frame so the section still
  // says everything it needs to say.
  const p = reduced ? 1 : progress;
  const sign = isRTL ? -1 : 1;

  const beatProgress = (at: number) => clamp01(mapRange(p, at, at + WINDOW, 0, 1));

  // Headline recedes rather than leaves: it is still the hero.
  const headlineY = round(mapRange(p, 0, 0.34, 0, -44));
  const headlineOpacity = round(mapRange(p, 0.16, 0.4, 1, 0.42), 3);
  const headlineBlur = round(mapRange(p, 0.2, 0.4, 0, 2.5), 2);

  // Panel arrives from the logical end side, settles, and gains depth.
  const panelIn = easeOut(clamp01(mapRange(p, 0.02, 0.18, 0, 1)));
  const panelX = round((1 - panelIn) * 36 * sign);
  const panelScale = round(mapRange(p, 0.03, 0.34, compact ? 0.97 : 0.93, 1), 3);
  const lift = clamp01(mapRange(p, 0.04, 0.34, 0, 1));
  const composerIn = clamp01(mapRange(p, 0.24, 0.36, 0, 1));

  const handedOff = p >= 0.78;
  const activeNode = NODES.reduce((acc, node, index) => (p >= node.at ? index : acc), 0);

  return (
    <section
      id="home"
      ref={ref}
      className={reduced ? 'pt-28 pb-20' : 'h-[380vh] sm:h-[520vh]'}
    >
      <div
        className={
          reduced
            ? ''
            : 'sticky top-0 flex min-h-[100svh] items-center overflow-hidden pt-20 pb-10'
        }
      >
        <div className="max-w-shell mx-auto w-full px-5 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
            {/* ---------------------------------------------------------- *
             * Headline column. First in DOM order, so it lands on the
             * right in Arabic and the left in English without any
             * direction-specific classes.
             * ---------------------------------------------------------- */}
            <div
              style={{
                transform: `translate3d(0, ${headlineY}px, 0)`,
                opacity: headlineOpacity,
                filter: headlineBlur > 0.05 ? `blur(${headlineBlur}px)` : undefined,
              }}
            >
              <h1 className="text-display-1 font-semibold text-main">
                {pick('عملاؤك بيسألوا.', 'Your customers ask.')}
                <br />
                <span className="text-muted">
                  {pick(
                    <>
                      <span className="font-latin">Wazly</span> بيردّ.
                    </>,
                    <>
                      <span className="font-latin">Wazly</span> answers.
                    </>
                  )}
                </span>
              </h1>

              <p className="mt-6 max-w-measure-lg text-[15px] leading-relaxed text-muted">
                {pick(
                  'واتساب وماسنجر وإنستجرام في صندوق واحد، ورد يفهم نشاط شركتك — مش إجابات جاهزة.',
                  'WhatsApp, Messenger and Instagram in one inbox, with replies that actually know your business — not canned answers.'
                )}
              </p>

              {/* One CTA and one quiet link, offset rather than a matched
                  pair of buttons. */}
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
                <Button size="lg" onClick={onLaunchApp}>
                  {pick('ابدأ مجانًا', 'Start free')}
                </Button>
                <a
                  href="#how"
                  className="text-sm text-muted underline decoration-app decoration-1 underline-offset-4 transition-colors duration-200 hover:text-main"
                >
                  {pick('شوف Wazly بيشتغل إزاي', 'See how it works')}
                </a>
              </div>

              {/* Pipeline. Lights up as the story advances, so the hero states
                  the product's shape without an illustration. */}
              <div className="mt-12 hidden items-center gap-2 sm:flex">
                {NODES.map((node, index) => {
                  const on = index <= activeNode;
                  const current = index === activeNode;
                  return (
                    <div key={node.en} className="flex items-center gap-2">
                      {index > 0 && (
                        <span
                          aria-hidden="true"
                          className="h-px w-6 transition-colors duration-400"
                          style={{
                            backgroundColor: on ? 'var(--brand)' : 'var(--border)',
                          }}
                        />
                      )}
                      <span
                        className={`text-xs transition-colors duration-400 ${node.latin ? 'font-latin' : ''} ${
                          current ? 'text-brand font-medium' : on ? 'text-muted' : 'text-subtle'
                        }`}
                      >
                        {pick(node.ar, node.en)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ---------------------------------------------------------- *
             * Live conversation.
             * ---------------------------------------------------------- */}
            <div
              style={{
                transform: `translate3d(${panelX}px, 0, 0) scale(${panelScale})`,
                opacity: round(mapRange(p, 0.01, 0.12, compact ? 0.6 : 0.25, 1), 3),
                willChange: 'transform',
              }}
            >
              <div
                className="bg-elevated border border-app rounded-2xl overflow-hidden"
                style={{
                  boxShadow: `0 ${round(lift * 16)}px ${round(lift * 44)}px hsl(var(--shadow-color) / ${round(
                    lift * 0.09,
                    3
                  )})`,
                }}
              >
                {/* Header: customer identity, channel, and the badge that
                    carries the whole handoff moment. */}
                <div className="flex items-center gap-3 border-b border-app px-4 py-3">
                  <Avatar initial="م" tone="muted" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[13px] font-medium text-main">
                        {pick('محمد أحمد', 'Mohamed Ahmed')}
                      </span>
                      <ChannelBadge channel="whatsapp" />
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-subtle">
                      <span className="font-latin">WhatsApp</span>
                      <span aria-hidden="true">·</span>
                      <span>{pick('الآن', 'Just now')}</span>
                    </div>
                  </div>

                  {/* Both chips occupy one grid cell and cross-fade, so the
                      header never reflows when responsibility changes hands. */}
                  <div className="grid shrink-0">
                    <span
                      className="col-start-1 row-start-1 inline-flex items-center gap-1 rounded-md border border-brand-600/15 bg-brand-bg px-2 py-0.5 text-[11px] font-medium text-brand"
                      style={{ opacity: handedOff ? 0 : 1, transition: 'opacity 320ms var(--ease-state)' }}
                    >
                      {pick('الـ AI', 'AI')}
                    </span>
                    <span
                      className="col-start-1 row-start-1 inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-ink-900 px-2 py-0.5 text-[11px] font-medium text-white dark:bg-ink-100 dark:text-ink-900"
                      style={{ opacity: handedOff ? 1 : 0, transition: 'opacity 320ms var(--ease-state)' }}
                    >
                      {pick('ياسمين — المبيعات', 'Yasmin — Sales')}
                    </span>
                  </div>
                </div>

                {/* Message area. Fixed minimum height: beats appearing must
                    not shift the panel under the cursor. */}
                <div className="min-h-[268px] space-y-2.5 px-4 py-4 sm:min-h-[312px]">
                  {BEATS.map(beat => {
                    const local = beatProgress(beat.at);
                    if (local <= 0) return null;
                    const e = easeOut(local);
                    return (
                      <BeatRow key={beat.id} beat={beat} e={e} sign={sign} pick={pick} />
                    );
                  })}
                </div>

                {/* Composer. Appears as the conversation expands — product
                    chrome, not decoration. */}
                <div
                  className="flex items-center gap-2 border-t border-app px-4 py-3"
                  style={{ opacity: round(composerIn, 3) }}
                >
                  <div className="flex-1 truncate text-[12px] text-subtle">
                    {pick('اكتب رسالة...', 'Write a message…')}
                  </div>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white dark:bg-brand-500 dark:text-brand-950">
                    <Send className="h-3.5 w-3.5 flip-rtl" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * One beat. Each kind gets its own entrance: eight of the same fade-up is
 * exactly the pattern the redesign is meant to remove.
 */
function BeatRow({
  beat,
  e,
  sign,
  pick,
}: {
  beat: Beat;
  e: number;
  sign: number;
  pick: <T>(ar: T, en: T) => T;
}) {
  const text = pick(beat.ar, beat.en);

  // Machine states: quiet single lines that slide in from the logical start.
  if (beat.kind === 'thinking' || beat.kind === 'source' || beat.kind === 'ok' || beat.kind === 'handoff') {
    const isSource = beat.kind === 'source';
    const isHandoff = beat.kind === 'handoff';
    return (
      <div
        className="flex items-center gap-2 py-0.5"
        style={{
          opacity: round(e, 3),
          transform: `translate3d(${round((1 - e) * 12 * sign)}px, 0, 0)`,
        }}
      >
        {beat.kind === 'thinking' && (
          <span className="flex gap-1 text-brand">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </span>
        )}
        {isSource && (
          <span
            className="inline-flex items-center gap-1.5 rounded-md border border-app bg-subtle px-2 py-1"
            style={{
              // Scales out of a blur rather than sliding: retrieval should
              // read as something resolving, not arriving.
              transform: `scale(${round(0.92 + e * 0.08, 3)})`,
              filter: e < 0.98 ? `blur(${round((1 - e) * 3.5, 2)}px)` : undefined,
            }}
          >
            <BookOpen className="h-3 w-3 text-brand" />
            <span className="text-[11px] text-muted">{text}</span>
          </span>
        )}
        {beat.kind === 'ok' && (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-brand">
            <Check className="h-3.5 w-3.5" />
            {text}
          </span>
        )}
        {isHandoff && (
          <span className="inline-flex items-center gap-2 text-[11px] text-muted">
            <span aria-hidden="true" className="h-px w-4 bg-ink-300 dark:bg-ink-700" />
            {text}
          </span>
        )}
        {beat.kind === 'thinking' && <span className="text-[11px] text-muted">{text}</span>}
      </div>
    );
  }

  if (beat.kind === 'resolved') {
    return (
      <div
        className="flex items-center gap-1.5 pt-1 text-[11px] font-medium text-brand"
        style={{ opacity: round(e, 3), transform: `scale(${round(0.96 + e * 0.04, 3)})` }}
      >
        <Check className="h-3.5 w-3.5" />
        {text}
      </div>
    );
  }

  const isCustomer = beat.kind === 'customer';
  const isOperator = beat.kind === 'operator';

  return (
    <div
      className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}
      style={{
        opacity: round(Math.min(1, e * 1.4), 3),
        // Unrolls downward instead of sliding: a message being written, not a
        // card being placed.
        clipPath: e < 0.99 ? `inset(0 0 ${round((1 - e) * 100, 1)}% 0)` : undefined,
        transform: `translate3d(0, ${round((1 - e) * 8)}px, 0)`,
      }}
    >
      <div className={`flex max-w-[86%] items-end gap-2 ${isCustomer ? '' : 'flex-row-reverse'}`}>
        {isOperator && <Avatar initial="ي" tone="ink" size="sm" />}
        <div
          dir="auto"
          className={`px-3 py-2 text-[13px] leading-relaxed ${
            isCustomer
              ? 'bubble-in bg-subtle text-main'
              : isOperator
                ? 'bubble-out bg-ink-900 text-white dark:bg-ink-100 dark:text-ink-900'
                : 'bubble-out bg-brand-600 text-white dark:bg-brand-500 dark:text-brand-950'
          }`}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
