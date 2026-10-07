import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from its previous value to `target` over `durationMs`.
 * Skips the animation when the user prefers reduced motion.
 */
export function useCountUp(target: number, durationMs: number): number {
  const [value, setValue] = useState(target);
  const from = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setValue(target);
      from.current = target;
      return;
    }
    const start = performance.now();
    const begin = from.current;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(begin + (target - begin) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else from.current = target;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}
