/**
 * Pure motion math shared by the scroll-driven sections.
 *
 * Everything here is dependency-free and side-effect-free so it can be called
 * during render without cost. The scroll hooks in `hooks.ts` produce a raw
 * 0…1 progress value; these helpers shape it into something a style can use.
 */

/** Clamp to the 0…1 range. */
export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Clamp to an arbitrary range. */
export function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

/**
 * Re-map `v` from one range to another, clamped at both ends.
 *
 * This is the workhorse of the whole scroll system. Read it out loud:
 * `mapRange(p, 0.1, 0.4, 0.96, 1)` is "between 10% and 40% scrolled,
 * scale from 0.96 to 1, and hold outside that window".
 */
export function mapRange(
  v: number,
  inMin: number,
  inMax: number,
  outMin = 0,
  outMax = 1
): number {
  if (inMax === inMin) return outMin;
  return outMin + clamp01((v - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/** ease-out cubic — the default settling curve for entrances. */
export function easeOut(t: number): number {
  return 1 - Math.pow(1 - clamp01(t), 3);
}

/** ease-in-out cubic — for values that travel out and back. */
export function easeInOut(t: number): number {
  const c = clamp01(t);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

/**
 * Split a 0…1 progress value into `count` discrete stages.
 *
 * `hold` reserves a slice of the track at the end so the final stage stays on
 * screen for a beat instead of flicking past at the very bottom of the scroll.
 */
export function stageFrom(progress: number, count: number, hold = 0.12): number {
  if (count <= 0) return 0;
  const usable = clamp01(progress / (1 - hold));
  return Math.min(count - 1, Math.floor(usable * count));
}

/**
 * Progress *within* the current stage, 0…1. Lets a sub-animation (a typing
 * indicator, a growing bar) complete before the stage itself advances.
 */
export function stageProgress(progress: number, count: number, hold = 0.12): number {
  if (count <= 0) return 0;
  const scaled = clamp01(progress / (1 - hold)) * count;
  return clamp01(scaled - Math.floor(scaled));
}

/** Round for inline styles — keeps the emitted style strings short and stable. */
export function round(v: number, decimals = 3): number {
  const f = Math.pow(10, decimals);
  return Math.round(v * f) / f;
}

/**
 * Staggered transition delay, capped so a long list never ends up waiting an
 * absurd amount of time for its last item.
 */
export function stagger(index: number, step = 70, max = 420): number {
  return Math.min(index * step, max);
}
