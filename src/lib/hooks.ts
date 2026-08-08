import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Environment-agnostic timeout handle: resolves to `number` in the DOM lib and
 * to `NodeJS.Timeout` when @types/node is present in node_modules/@types.
 */
type TimeoutId = ReturnType<typeof setTimeout>;

/**
 * Intersection-based reveal trigger for scroll animations.
 * Returns a ref and whether the element has entered the viewport.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; rootMargin?: string; once?: boolean }
) {
  const { threshold = 0.15, rootMargin = '0px 0px -10% 0px', once = true } = options || {};
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Without IntersectionObserver, reveal immediately rather than leaving the
    // content permanently at opacity 0.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, visible };
}

/**
 * Detect prefers-reduced-motion from the user's OS.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

/**
 * True when the viewport is at or below Tailwind's `sm` breakpoint.
 * Used to shorten travel distances rather than switch motion off.
 */
export function useIsCompact(maxWidth = 640) {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [maxWidth]);
  return compact;
}

/**
 * How progress through an element is measured.
 *
 * - `through`: 0 when the element sits just below the viewport, 1 when it has
 *   just passed above it. The natural measure for parallax.
 * - `sticky`: 0 the moment a tall container's top reaches the viewport top
 *   (i.e. sticky engages), 1 when its bottom reaches the viewport bottom
 *   (sticky releases). The correct measure for scroll-driven stories.
 */
export type ScrollMode = 'through' | 'sticky';

function readProgress(el: HTMLElement, mode: ScrollMode): number {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;

  if (mode === 'sticky') {
    const travel = rect.height - vh;
    // Container shorter than the viewport: nothing to scrub through.
    if (travel <= 0) return rect.top <= 0 ? 1 : 0;
    const p = -rect.top / travel;
    return p < 0 ? 0 : p > 1 ? 1 : p;
  }

  const total = vh + rect.height;
  if (total <= 0) return 0;
  const p = (vh - rect.top) / total;
  return p < 0 ? 0 : p > 1 ? 1 : p;
}

/**
 * Scroll progress through an element, 0…1.
 *
 * Performance notes, because this runs on every scroll event:
 * - the listener is passive and does nothing but schedule a frame;
 * - all measurement happens inside one rAF callback;
 * - the value is quantised to ~500 steps, so React only re-renders when the
 *   number changes by an amount that could actually be seen.
 *
 * Pass `disabled` (e.g. for reduced motion) to stop listening entirely.
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(
  options?: { mode?: ScrollMode; disabled?: boolean }
) {
  const { mode = 'through', disabled = false } = options || {};
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const frame = useRef<number>(0);
  const last = useRef(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const read = () => {
      frame.current = 0;
      const next = readProgress(el, mode);
      const quantised = Math.round(next * 500) / 500;
      if (quantised !== last.current) {
        last.current = quantised;
        setProgress(quantised);
      }
    };

    const schedule = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [mode, disabled]);

  return { ref, progress };
}

/**
 * Subtle parallax offset in pixels.
 *
 * The offset is 0 when the element is centred in the viewport, so nothing is
 * displaced at rest — it only drifts as you scroll past. Distance is halved on
 * small screens and zeroed for reduced motion.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(distance = 24) {
  const reduced = usePrefersReducedMotion();
  const compact = useIsCompact();
  const { ref, progress } = useScrollProgress<T>({ disabled: reduced });
  const travel = compact ? distance * 0.5 : distance;
  const offset = reduced ? 0 : (0.5 - progress) * 2 * travel;
  return { ref, offset, progress };
}

/**
 * Count up from 0 to target when `active` becomes true.
 * Respects reduced motion (jumps to final value).
 */
export function useCountUp(target: number, active: boolean, duration = 1500) {
  const [value, setValue] = useState(0);
  const reduced = usePrefersReducedMotion();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, active, duration, reduced]);

  return value;
}

/**
 * Count toward a target that itself changes — animates from wherever the
 * display currently sits rather than restarting from zero. Used for the
 * stepped knowledge-readiness figure (0 → 42 → 76 → 94).
 */
export function useCountTo(target: number, duration = 700) {
  const [value, setValue] = useState(target);
  const reduced = usePrefersReducedMotion();
  const rafRef = useRef<number>(0);
  const fromRef = useRef(target);

  useEffect(() => {
    if (reduced) {
      fromRef.current = target;
      setValue(target);
      return;
    }
    const from = fromRef.current;
    if (from === target) return;

    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = from + (target - from) * eased;
      setValue(next);
      fromRef.current = next;
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
        setValue(target);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, reduced]);

  return value;
}

/**
 * Typewriter effect that reveals text progressively.
 * Respects reduced motion (shows full text immediately).
 */
export function useTypewriter(text: string, active: boolean, speed = 28) {
  const [displayed, setDisplayed] = useState('');
  const reduced = usePrefersReducedMotion();
  const timerRef = useRef<TimeoutId | null>(null);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setDisplayed(text);
      return;
    }
    setDisplayed('');
    let i = 0;
    const tick = () => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
        timerRef.current = setTimeout(tick, speed);
      }
    };
    timerRef.current = setTimeout(tick, speed);
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, active, speed, reduced]);

  return displayed;
}

/**
 * Sequenced timeline runner — steps through an array of steps with delays.
 * Returns the index of the active step (-1 before the first step runs).
 */
export function useTimeline(
  steps: { duration: number }[],
  options?: { loop?: boolean; startDelay?: number; active?: boolean }
) {
  const { loop = false, startDelay = 0, active = true } = options || {};
  const [step, setStep] = useState(-1);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!active) return;

    if (reduced) {
      setStep(steps.length - 1);
      return;
    }

    const timeouts: TimeoutId[] = [];
    let cumulative = startDelay;

    setStep(-1);

    for (let i = 0; i < steps.length; i++) {
      const idx = i;
      timeouts.push(setTimeout(() => setStep(idx), cumulative));
      cumulative += steps[i].duration;
    }

    if (loop) {
      // Clear the sequence once it finishes so the caller can restart it.
      timeouts.push(setTimeout(() => setStep(-1), cumulative + 1500));
    }

    return () => timeouts.forEach(clearTimeout);
  }, [steps.length, loop, startDelay, active, reduced]);

  return step;
}

/**
 * Looping timeline that re-runs automatically.
 */
export function useLoopingTimeline(
  steps: { duration: number }[],
  cycleGap = 2000,
  startDelay = 600
) {
  const [step, setStep] = useState(-1);
  const [cycle, setCycle] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setStep(steps.length - 1);
      return;
    }
    const timeouts: TimeoutId[] = [];
    let cumulative = startDelay;

    for (let i = 0; i < steps.length; i++) {
      const idx = i;
      const startTime = cumulative;
      timeouts.push(setTimeout(() => setStep(idx), startTime));
      cumulative += steps[i].duration;
    }

    // Reset and loop
    timeouts.push(
      setTimeout(() => {
        setStep(-1);
        setCycle((c) => c + 1);
      }, cumulative + cycleGap)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [steps.length, cycleGap, startDelay, reduced, cycle]);

  return { step, cycle };
}

/**
 * Interval that runs only while `delay` is non-null.
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Local storage backed state.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write failures (private mode, quota exceeded, …)
    }
  }, [key, value]);

  return [value, setValue] as const;
}

/**
 * Previous value tracker — useful for animating changes.
 */
export function usePrevious<T>(value: T) {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

/**
 * Stable callback that keeps a constant identity across renders.
 */
export function useStableCallback<Args extends unknown[], R>(fn: (...args: Args) => R) {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  }, [fn]);
  return useCallback((...args: Args) => ref.current(...args), []);
}
