import type { Theme } from '@razorpay/blade/components';
import type { FundId } from '../../data/funds';

/** One colour per fund, used in the split bar and legends. Blues for liquid, greens and purples for short-term debt. */
export function fundColor(theme: Theme, id: FundId): string {
  const c = theme.colors.data.background.categorical;
  const map: Record<FundId, string> = {
    'absl-liquid': c.blue.strong,
    'axis-liquid': c.skyBlue.intense,
    'edelweiss-liquid': c.blue.moderate,
    'nippon-liquid': c.skyBlue.moderate,
    'tata-money-market': c.green.intense,
    'tata-ultra-short': c.green.moderate,
    'icici-short-term': c.purple.intense,
    'axis-short-duration': c.purple.moderate,
  };
  return map[id];
}
