import { useLang } from '@/lib/i18n';
import { useScrollProgress, usePrefersReducedMotion } from '@/lib/hooks';
import { clamp01, easeOut, mapRange, round } from '@/lib/motion';
import { ChannelBadge, Eyebrow } from '@/components/ui';
import type { ChannelType } from '@/lib/mockData';

type Row = {
  channel: ChannelType;
  ar: string;
  en: string;
  msgAr: string;
  msgEn: string;
  time: string;
  /** Progress at which this channel arrives. */
  at: number;
  /** Scattered offset before convergence, in px. dx is sign-flipped for RTL. */
  dx: number;
  dy: number;
  rotate: number;
};

const ROWS: Row[] = [
  {
    channel: 'whatsapp',
    ar: 'محمد أحمد',
    en: 'Mohamed Ahmed',
    msgAr: 'عايز أعرف تكلفة تشطيب شقة 150 متر',
    msgEn: 'What would finishing a 150m apartment cost?',
    time: '10:24',
    at: 0.06,
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
    at: 0.16,
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
    at: 0.26,
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
    at: 0.36,
    dx: 98,
    dy: 30,
    rotate: -1.2,
  },
];

export function ChannelFlow() {
  const { pick, isRTL } = useLang();
  const reduced = usePrefersReducedMotion();
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    mode: 'sticky',
    disabled: reduced,
  });

  const p = reduced ? 1 : progress;
  const sign = isRTL ? -1 : 1;

  // Convergence: the scatter resolves, rotation unwinds, the stack tightens.
  const conv = easeOut(clamp01(mapRange(p, 0.44, 0.8, 0, 1)));
  // The inbox is built by the convergence rather than waiting for it.
  const shell = clamp01(mapRange(p, 0.5, 0.76, 0, 1));
  const aiIn = clamp01(mapRange(p, 0.82, 0.97, 0, 1));

  return (
    <section
      id="features"
      ref={ref}
      className={reduced ? 'py-section-sm' : 'h-[260vh] sm:h-[300vh]'}
    >
      <div className={reduced ? '' : 'sticky top-0 flex min-h-[100svh] items-center py-20'}>
        <div className="max-w-shell mx-auto w-full px-5 sm:px-8">
          {/* Heading sits narrow and off to the logical start; the composition
              is the section, not the copy. */}
          <div className="max-w-measure-lg">
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
          </div>

          {/* ------------------------------------------------------------ *
           * The inbox. Border and background are mixed in proportion to
           * `shell`, so the container materialises around the messages as
           * they land instead of being a card that was always there.
           * ------------------------------------------------------------ */}
          <div
            className="mt-14 rounded-2xl border"
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
              <span className="text-[11px] text-subtle">
                {pick('4 محادثات', '4 conversations')}
              </span>
            </div>

            <div className="p-2 sm:p-3">
              {ROWS.map(row => {
                const enter = easeOut(clamp01(mapRange(p, row.at, row.at + 0.11, 0, 1)));
                const scatter = 1 - conv;
                const x = round(row.dx * scatter * sign + (1 - enter) * 22 * sign);
                const y = round(row.dy * scatter);
                const rot = round(row.rotate * scatter, 2);
                return (
                  <div
                    key={row.channel}
                    className="flex items-center gap-3 rounded-xl px-3 py-3"
                    style={{
                      opacity: round(enter, 3),
                      transform: `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${round(
                        0.965 + conv * 0.035,
                        3
                      )})`,
                      // Each message carries its own surface while scattered,
                      // then dissolves into the inbox as it lands.
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
                    <ChannelBadge channel={row.channel} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="truncate text-[13px] font-medium text-main">
                          {pick(row.ar, row.en)}
                        </span>
                        <span className="num shrink-0 text-[11px] text-subtle">{row.time}</span>
                      </div>
                      <p dir="auto" className="mt-0.5 truncate text-[12px] text-muted">
                        {pick(row.msgAr, row.msgEn)}
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
              <span className="ms-auto text-[11px] text-subtle">
                {pick('متوسط الرد 1.8 د', 'Avg reply 1.8m')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
