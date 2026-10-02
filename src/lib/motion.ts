/** Blade easing tokens are CSS strings; framer-motion wants [x1, y1, x2, y2] */
export function toBezier(cssEasing: string): [number, number, number, number] {
  const nums = cssEasing.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
  return nums.length === 4 ? (nums as [number, number, number, number]) : [0, 0, 1, 1];
}

export const msToS = (ms: number) => ms / 1000;
