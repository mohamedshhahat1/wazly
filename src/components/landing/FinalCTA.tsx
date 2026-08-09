import { useLang } from '@/lib/i18n';
import { useScrollProgress, usePrefersReducedMotion } from '@/lib/hooks';
import { clamp01, easeOut, mapRange, round } from '@/lib/motion';
import { Button } from '@/components/ui';

interface FinalCTAProps {
  onLaunchApp: () => void;
}

export function FinalCTA({ onLaunchApp }: FinalCTAProps) {
  const { pick } = useLang();
  const reduced = usePrefersReducedMotion();
  const { ref, progress } = useScrollProgress<HTMLDivElement>({
    mode: 'through',
    disabled: reduced,
  });

  const p = reduced ? 1 : progress;

  // Radius and scale only. Animating margin or width here would relayout the
  // band on every frame for the same visual result.
  const grow = easeOut(clamp01(mapRange(p, 0.15, 0.55, 0, 1)));
  const rise = clamp01(mapRange(p, 0.2, 0.6, 0, 1));

  return (
    <section ref={ref} className="px-5 pb-20 pt-8 sm:px-8">
      <div
        className="max-w-shell mx-auto overflow-hidden bg-deep-700 px-6 py-20 sm:px-14 sm:py-28"
        style={{
          borderRadius: `${round(26 - grow * 18)}px`,
          transform: `scale(${round(0.975 + grow * 0.025, 4)})`,
        }}
      >
        <div
          className="max-w-measure-lg"
          style={{
            opacity: round(0.25 + rise * 0.75, 3),
            transform: `translate3d(0, ${round((1 - rise) * 18)}px, 0)`,
          }}
        >
          <h2 className="text-display-1 font-semibold text-white">
            {pick('خلّي كل رسالة فرصة.', 'Make every message an opportunity.')}
          </h2>
          <p className="mt-5 text-[15px] text-white/60">
            {pick(
              <>
                ابدأ باستخدام <span className="font-latin">Wazly</span> اليوم.
              </>,
              <>
                Start using <span className="font-latin">Wazly</span> today.
              </>
            )}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button size="lg" variant="inverted" onClick={onLaunchApp}>
              {pick('ابدأ مجانًا', 'Start free')}
            </Button>
            {/* Written out rather than reusing a light-surface variant, which
                would not read on the deep band. */}
            <button
              type="button"
              onClick={onLaunchApp}
              className="focus-ring inline-flex items-center rounded-xl border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all duration-200 ease-smooth hover:-translate-y-px hover:border-white/40 hover:bg-white/5 active:translate-y-0"
            >
              {pick('احجز عرضًا', 'Book a demo')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
