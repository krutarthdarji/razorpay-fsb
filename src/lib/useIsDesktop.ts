import { useTheme } from '@razorpay/blade/components';
import { useBreakpoint } from '@razorpay/blade/utils';

/** True from Blade's `m` breakpoint (768px) up */
export function useIsDesktop(): boolean {
  const { theme } = useTheme();
  return useBreakpoint({ breakpoints: theme.breakpoints }).matchedDeviceType === 'desktop';
}
