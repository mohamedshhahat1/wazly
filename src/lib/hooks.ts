import { useEffect, useRef, useState, useCallback } from 'react';

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
 * Typewriter effect that reveals text progressively.
 * Respects reduced motion (shows full text immediately).
 */
export function useTypewriter(text: string, active: boolean, speed = 28) {
  const [displayed, setDisplayed] = useState('');
  const reduced = usePrefersReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    return () => clearTimeout(timerRef.current);
  }, [text, active, speed, reduced]);

  return displayed;
}

/**
 * Sequenced timeline runner — steps through an array of steps with delays.
 * Returns the current step index and a "done" flag.
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
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let cumulative = startDelay;

    if (reduced) {
      setStep(steps.length - 1);
      return;
    }

    setStep(-1);
    cumulative += 0;

    for (let i = 0; i < steps.length; i++) {
      cumulative += steps[i].duration;
      const idx = i;
      timeouts.push(
        setTimeout(() => setStep(idx), cumulative - steps[i].duration)
      );
    }

    if (loop) {
      timeouts.push(
        setTimeout(() => setStep(-1), cumulative + 1500)
      );
      // restart
      timeouts.push(
        setTimeout(() => {
          // This triggers re-run via effect dependency on a counter
        }, cumulative + 1600)
      );
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
    let timeouts: ReturnType<typeof setTimeout>[] = [];
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
 * Interval that runs only when component is mounted and visible.
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
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
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
 * Stable callback that doesn't change identity.
 */
export function useStableCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  }, [fn]);
  return useCallback((...args: any[]) => ref.current(...args), []) as T;
}
