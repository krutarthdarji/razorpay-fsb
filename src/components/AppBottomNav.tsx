import { NavLink, useLocation } from 'react-router-dom';
import { BottomNav, BottomNavItem, HomeIcon, PieChartIcon, SparklesIcon } from '@razorpay/blade/components';
import { brand } from '../brand';
import { paths } from '../routes';

/** Routes that show the bottom nav (top-level tabs) */
export const TAB_PATHS: string[] = [paths.home, paths.kosh, paths.portfolio];

/** Three tabs, all part of the job: see your money, ask Kosh, see what's working */
export function AppBottomNav() {
  const { pathname } = useLocation();
  return (
    <BottomNav>
      <BottomNavItem title="Home" icon={HomeIcon} as={NavLink} href={paths.home} isActive={pathname === paths.home} />
      <BottomNavItem title={brand.name} icon={SparklesIcon} as={NavLink} href={paths.kosh} isActive={pathname === paths.kosh} />
      <BottomNavItem
        title="Portfolio"
        icon={PieChartIcon}
        as={NavLink}
        href={paths.portfolio}
        isActive={pathname === paths.portfolio}
      />
    </BottomNav>
  );
}
