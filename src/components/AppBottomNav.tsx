import { NavLink, useLocation } from 'react-router-dom';
import { paths } from '../routes';
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
export const TAB_PATHS: string[] = [paths.home, paths.portfolio];

export function AppBottomNav() {
  const { pathname } = useLocation();
  const toast = useToast();
  const notInDemo = () =>
    toast.show({ content: 'Not part of this demo', color: 'neutral', autoDismiss: true });

  return (
    <BottomNav>
      <BottomNavItem title="Home" icon={HomeIcon} as={NavLink} href={paths.home} isActive={pathname === paths.home} />
      <BottomNavItem title="Payouts" icon={SendIcon} onClick={notInDemo} />
      <BottomNavItem
        title="Invest"
        icon={TrendingUpIcon}
        as={NavLink}
        href={paths.portfolio}
        isActive={pathname === paths.portfolio}
      />
      <BottomNavItem title="More" icon={MoreHorizontalIcon} onClick={notInDemo} />
    </BottomNav>
  );
}
