import { Link, useLocation } from 'react-router-dom';
import { BottomNav, BottomNavItem, HomeIcon, PieChartIcon, SparklesIcon } from '@razorpay/blade/components';
import { brand } from '../brand';
import { paths } from '../routes';

/** Routes that show the bottom nav (top-level tabs) */
export const TAB_PATHS: string[] = [paths.home, paths.kosh, paths.portfolio];

const tabs = [
  { title: 'Home', icon: HomeIcon, href: paths.home },
  { title: brand.name, icon: SparklesIcon, href: paths.kosh },
  { title: 'Portfolio', icon: PieChartIcon, href: paths.portfolio },
];

/** Three tabs, all part of the job: see your money, ask Kosh, see what's working */
export function AppBottomNav() {
  const { pathname } = useLocation();
  return (
    <BottomNav>
      {tabs.map((t) => (
        // Plain Link, not NavLink: NavLink marks /app active on every /app/* page.
        // The active tab is decided here, by exact path.
        <BottomNavItem key={t.href} title={t.title} icon={t.icon} as={Link} href={t.href} isActive={pathname === t.href} />
      ))}
    </BottomNav>
  );
}
