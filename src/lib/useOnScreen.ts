import { useEffect, useState, type RefObject } from 'react';

/**
 * True while the element is on screen. Starts as `initial` so nothing flickers
 * before the first observation.
 */
export function useOnScreen(ref: RefObject<Element>, initial = false): boolean {
  const [onScreen, setOnScreen] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return onScreen;
}
