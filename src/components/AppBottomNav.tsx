import { NavLink, useLocation } from 'react-router-dom';
import {
  BottomNav,
  BottomNavItem,
  HomeIcon,
  MoreHorizontalIcon,
  SendIcon,
  TrendingUpIcon,
  useToast,
} from '@razorpay/blade/components';

/** Routes that show the bottom nav (top-level tabs) */
export const TAB_PATHS = ['/', '/portfolio'];

export function AppBottomNav() {
  const { pathname } = useLocation();
  const toast = useToast();
  const notInDemo = () =>
    toast.show({ content: 'Not part of this demo', color: 'neutral', autoDismiss: true });

  return (
    <BottomNav>
      <BottomNavItem title="Home" icon={HomeIcon} as={NavLink} href="/" isActive={pathname === '/'} />
      <BottomNavItem title="Payouts" icon={SendIcon} onClick={notInDemo} />
      <BottomNavItem
        title="Invest"
        icon={TrendingUpIcon}
        as={NavLink}
        href="/portfolio"
        isActive={pathname === '/portfolio'}
      />
      <BottomNavItem title="More" icon={MoreHorizontalIcon} onClick={notInDemo} />
    </BottomNav>
  );
}
