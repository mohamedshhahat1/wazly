import { useLang } from '@/lib/i18n';
import { useScrollProgress, usePrefersReducedMotion, useIsCompact } from '@/lib/hooks';
import { clamp01, easeOut, mapRange, round } from '@/lib/motion';
import { ChannelBadge, Eyebrow } from '@/components/ui';
import { brandColor, channelBrand } from '@/components/BrandIcons';
import type { ChannelType } from '@/lib/mockData';

/* ------------------------------------------------------------------ *
 * Rail geometry.
 *
 * The SVG holds only the connector curves and is stretched with
 * preserveAspectRatio="none", so its coordinate space is a layout grid rather
 * than a drawing. Discs and pips are HTML overlays positioned as percentages of
 * that same grid, which keeps them perfectly round no matter how the box is
 * stretched.
 * ------------------------------------------------------------------ */
const W = 680;
const H = 132;
const NODE_Y = 38;
const HUB_X = W / 2;
const NODE_XS = [92, 258, 422, 588];

type Pt = { x: number; y: number };

/**
 * Point on a cubic bezier at t. Evaluating the curve directly is what lets the
 * pip travel without measuring a path in a ref or relying on CSS offset-path.
 */
function cubicPoint(t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

/** Control points for a channel's connector: straight down, then into the hub. */
function curveFor(x: number): [Pt, Pt, Pt, Pt] {
  return [
    { x, y: NODE_Y + 16 },
    { x, y: NODE_Y + 62 },
    { x: HUB_X, y: H - 34 },
    { x: HUB_X, y: H },
  ];
}

type Node = {
  channel: ChannelType;
  ar: string;
  en: string;
  msgAr: string;
  msgEn: string;
  time: string;
  /** Progress at which this channel's mark appears. */
  at: number;
  /** Scattered offset for the message row before it settles, in px. */
  dx: number;
  dy: number;
  rotate: number;
};

const NODES: Node[] = [
  {
    channel: 'whatsapp',
    ar: 'محمد أحمد',
    en: 'Mohamed Ahmed',
    msgAr: 'عايز أعرف تكلفة تشطيب شقة 150 متر',
    msgEn: 'What would finishing a 150m apartment cost?',
    time: '10:24',
    at: 0.03,
    dx: -104,
    dy: -26,
    rotate: -1.4,
  },
  {
    channel: 'instagram',
    ar: 'سارة أحمد',
    en: 'Sara Ahmed',
    msgAr: 'الباقات بتشمل السباكة والكهرباء؟',
    msgEn: 'Do the packages include plumbing and electrics?',
    time: '10:19',
    at: 0.1,
    dx: 112,
    dy: -8,
    rotate: 1.1,
  },
  {
    channel: 'messenger',
    ar: 'محمود السيد',
    en: 'Mahmoud El Sayed',
    msgAr: 'ممكن موعد لزيارة الموقع؟',
    msgEn: 'Could we book a site visit?',
    time: '10:11',
    at: 0.17,
    dx: -92,
    dy: 14,
    rotate: 1.5,
  },
  {
    channel: 'comments',
    ar: 'نورهان عادل',
    en: 'Nourhan Adel',
    msgAr: 'بتشتغلوا في التجمع الخامس؟',
    msgEn: 'Do you work in New Cairo?',
    time: '09:58',
    at: 0.24,
    dx: 98,
    dy: 30,
    rotate: -1.2,
  },
];

export function ChannelFlow() {
  const { pick, isRTL } = useLang();
  const reduced = usePrefersReducedMotion();
  const compact = useIsCompact();
  // On a phone the rail and the inbox need more than one short viewport, so the
  // section leaves the sticky frame rather than becoming a squeezed desktop.
  const pinned = !reduced && !compact;
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    mode: pinned ? 'sticky' : 'through',
    disabled: reduced,
  });

  const p = reduced ? 1 : progress;
  const sign = isRTL ? -1 : 1;

  // In Arabic the first channel should lead from the right, so mirror the grid.
  const xs = NODE_XS.map(raw => (isRTL ? W - raw : raw));

  const beats = NODES.map(n => ({
    // The mark arrives first: it is the source of everything that follows.
    enter: easeOut(clamp01(mapRange(p, n.at, n.at + 0.07, 0, 1))),
    // Then its route to the inbox draws itself.
    draw: easeOut(clamp01(mapRange(p, n.at + 0.02, n.at + 0.13, 0, 1))),
    // Then a message travels down that route.
    pip: clamp01(mapRange(p, n.at + 0.07, n.at + 0.22, 0, 1)),
    // And lands as a row in the inbox.
    row: easeOut(clamp01(mapRange(p, n.at + 0.11, n.at + 0.21, 0, 1))),
  }));

  const arrived = beats.filter(b => b.pip >= 1).length;

  // Convergence: the scatter resolves, rotation unwinds, the stack tightens.
  const conv = easeOut(clamp01(mapRange(p, 0.46, 0.78, 0, 1)));
  // The inbox is built by the convergence rather than waiting for it.
  const shell = clamp01(mapRange(p, 0.5, 0.76, 0, 1));
  const settled = p > 0.82;
  const aiIn = clamp01(mapRange(p, 0.84, 0.98, 0, 1));

  return (
    <section
      id="features"
      ref={ref}
      className={pinned ? 'h-[280vh] sm:h-[320vh]' : 'py-section-sm'}
    >
      <div className={pinned ? 'sticky top-0 flex min-h-[100svh] items-center py-14' : ''}>
        <div className="max-w-shell mx-auto w-full px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16">
            {/* -------------------------------------------------------- *
             * Statement. Narrow measure, off to the logical start: the
             * composition is the section, not the copy.
             * -------------------------------------------------------- */}
            <div>
              <Eyebrow index="01">{pick('القنوات', 'Channels')}</Eyebrow>
              <h2 className="mt-5 text-display-2 font-semibold text-main">
                {pick('عملاؤك بيكتبوا من كل حتة.', 'They write from everywhere.')}
                <br />
                <span className="text-muted">
                  {pick(
                    <>
                      <span className="font-latin">Wazly</span> بيجمّعهم في مكان واحد.
                    </>,
                    <>
                      <span className="font-latin">Wazly</span> brings them into one place.
                    </>
                  )}
                </span>
              </h2>
              <p className="mt-5 max-w-measure text-[15px] leading-relaxed text-muted">
                {pick(
                  'واتساب، إنستجرام، ماسنجر وتعليقات فيسبوك — كل رسالة بتوصل لنفس الصندوق، وبترد عليها من مكان واحد.',
                  'WhatsApp, Instagram, Messenger and Facebook comments — every message lands in the same inbox, answered from one place.'
                )}
              </p>

              {/* Counts up as each channel's message actually arrives, so the
                  number is a readout of the animation rather than decoration. */}
              <div className="mt-9 flex items-baseline gap-3 border-t border-app pt-6">
                <span className="num text-display-3 font-semibold leading-none text-main">
                  {arrived}
                </span>
                <span className="text-sm text-muted">
                  {pick('قنوات وصلت للصندوق', 'channels reaching the inbox')}
                </span>
              </div>
            </div>

            {/* -------------------------------------------------------- *
             * The rail: brand marks, their connector curves, and the
             * messages travelling down them into the inbox.
             * -------------------------------------------------------- */}
            <div>
              <div className="relative h-[116px] sm:h-[132px]">
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  {NODES.map((n, i) => {
                    const [p0, p1, p2, p3] = curveFor(xs[i]);
                    const color = brandColor[channelBrand[n.channel]];
                    const d = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
                    return (
                      <path
                        key={n.channel}
                        d={d}
                        fill="none"
                        stroke={color}
                        strokeWidth={1.25}
                        strokeLinecap="round"
                        // Constant hairline however the box is stretched.
                        vectorEffect="non-scaling-stroke"
                        // pathLength normalises the dash to 0..1, so the draw
                        // needs no measured length.
                        pathLength={1}
                        strokeDasharray={1}
                        strokeDashoffset={round(1 - beats[i].draw, 3)}
                        opacity={round(0.2 + beats[i].draw * 0.28, 3)}
                      />
                    );
                  })}
                </svg>

                {/* Brand marks */}
                {NODES.map((n, i) => {
                  const b = beats[i];
                  const color = brandColor[channelBrand[n.channel]];
                  return (
                    <span
                      key={n.channel}
                      className="absolute"
                      style={{
                        left: `${round((xs[i] / W) * 100, 2)}%`,
                        top: `${round((NODE_Y / H) * 100, 2)}%`,
                        // One combined transform: a utility class for the
                        // centring would be overridden by this inline scale.
                        transform: `translate(-50%, -50%) scale(${round(0.72 + b.enter * 0.28, 3)})`,
                        opacity: round(b.enter, 3),
                        filter: b.enter < 1 ? `blur(${round((1 - b.enter) * 3, 2)}px)` : undefined,
                      }}
                    >
                      <ChannelBadge
                        channel={n.channel}
                        size="lg"
                        tone="plain"
                        // Pulses while it is sending, and again once the inbox
                        // is live, so the marks never look inert.
                        pulse={(b.pip > 0.02 && b.pip < 0.98) || settled}
                      />
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 left-1/2 h-px -translate-x-1/2"
                        style={{
                          width: round(18 * b.enter),
                          backgroundColor: color,
                          opacity: 0.5,
                        }}
                      />
                    </span>
                  );
                })}

                {/* Messages in flight */}
                {NODES.map((n, i) => {
                  const b = beats[i];
                  if (b.pip <= 0.01 || b.pip >= 0.99) return null;
                  const [p0, p1, p2, p3] = curveFor(xs[i]);
                  const at = cubicPoint(b.pip, p0, p1, p2, p3);
                  const color = brandColor[channelBrand[n.channel]];
                  return (
                    <span
                      key={`${n.channel}-pip`}
                      aria-hidden="true"
                      className="absolute rounded-full"
                      style={{
                        left: `${round((at.x / W) * 100, 2)}%`,
                        top: `${round((at.y / H) * 100, 2)}%`,
                        width: 7,
                        height: 7,
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: color,
                        // Fades in and out at the ends of the run.
                        opacity: round(Math.sin(b.pip * Math.PI), 3),
                        boxShadow: `0 0 0 3px color-mix(in srgb, ${color} 20%, transparent)`,
                      }}
                    />
                  );
                })}

                {/* The hub the curves resolve into, sitting on the inbox edge. */}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 h-2 w-2 rounded-full bg-brand-600 dark:bg-brand-400"
                  style={{
                    top: '100%',
                    transform: 'translate(-50%, -50%)',
                    opacity: round(shell, 3),
                  }}
                />
              </div>

              {/* ---------------------------------------------------- *
               * The inbox. Border and background are mixed in
               * proportion to `shell`, so the container materialises
               * around the messages as they land instead of being a
               * card that was always there.
               * ---------------------------------------------------- */}
              <div
                className="rounded-2xl border"
                style={{
                  borderColor: `color-mix(in srgb, var(--border) ${round(shell * 100)}%, transparent)`,
                  backgroundColor: `color-mix(in srgb, var(--bg-elevated) ${round(shell * 100)}%, transparent)`,
                  boxShadow: `0 ${round(shell * 14)}px ${round(shell * 40)}px hsl(var(--shadow-color) / ${round(
                    shell * 0.07,
                    3
                  )})`,
                }}
              >
                <div
                  className="flex items-center justify-between border-b px-4 py-3"
                  style={{
                    opacity: round(shell, 3),
                    borderColor: `color-mix(in srgb, var(--border) ${round(shell * 100)}%, transparent)`,
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-brand-600 opacity-50 animate-ping dark:bg-brand-400" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />
                    </span>
                    <span className="text-[13px] font-medium text-main">
                      {pick('صندوق وارد واحد', 'One shared inbox')}
                    </span>
                  </div>
                  <span className="num text-[11px] text-subtle">
                    {pick(`${arrived} محادثات`, `${arrived} conversations`)}
                  </span>
                </div>

                <div className="p-2 sm:p-2.5">
                  {NODES.map((n, i) => {
                    const enter = beats[i].row;
                    const scatter = 1 - conv;
                    const x = round(n.dx * scatter * sign + (1 - enter) * 22 * sign);
                    const y = round(n.dy * scatter);
                    const rot = round(n.rotate * scatter, 2);
                    return (
                      <div
                        key={n.channel}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                        style={{
                          opacity: round(enter, 3),
                          transform: `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${round(
                            0.965 + conv * 0.035,
                            3
                          )})`,
                          // Each message carries its own surface while
                          // scattered, then dissolves into the inbox.
                          backgroundColor: `color-mix(in srgb, var(--bg-elevated) ${round(scatter * 100)}%, transparent)`,
                          boxShadow:
                            scatter > 0.02
                              ? `0 ${round(scatter * 10)}px ${round(scatter * 26)}px hsl(var(--shadow-color) / ${round(
                                  scatter * 0.08,
                                  3
                                )})`
                              : undefined,
                          willChange: 'transform',
                        }}
                      >
                        <ChannelBadge channel={n.channel} size="md" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="truncate text-[13px] font-medium text-main">
                              {pick(n.ar, n.en)}
                            </span>
                            <span className="num shrink-0 text-[11px] text-subtle">{n.time}</span>
                          </div>
                          <p dir="auto" className="mt-0.5 truncate text-[12px] text-muted">
                            {pick(n.msgAr, n.msgEn)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Wazly → AI. The flow continues past the inbox. */}
                <div
                  className="flex items-center gap-3 border-t px-4 py-3"
                  style={{
                    opacity: round(aiIn, 3),
                    borderColor: `color-mix(in srgb, var(--border) ${round(aiIn * 100)}%, transparent)`,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="h-px bg-brand-600 dark:bg-brand-400"
                    style={{ width: `${round(aiIn * 28)}px` }}
                  />
                  <span className="text-[12px] font-medium text-brand">
                    {pick('الـ AI يرد تلقائيًا', 'AI replies automatically')}
                  </span>
                  <span className="ms-auto num text-[11px] text-subtle">
                    {pick('متوسط الرد 1.8 د', 'Avg reply 1.8m')}
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
