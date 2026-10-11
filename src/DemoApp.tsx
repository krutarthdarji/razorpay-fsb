import { useLayoutEffect, useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Box, ToastContainer, useTheme } from '@razorpay/blade/components';
import { MobileShell } from './components/MobileShell';
import { AnimatedRoutes, type ScreenRoute } from './components/AnimatedRoutes';
import { AppBottomNav, TAB_PATHS } from './components/AppBottomNav';
import { AppHeader } from './components/app/AppHeader';
import { SheetHost } from './components/app/SheetLayer';
import { Home } from './screens/Home/Home';
import { Kosh } from './screens/Kosh/Kosh';
import { OrderPlaced } from './screens/Order/OrderPlaced';
import { Portfolio } from './screens/Portfolio/Portfolio';
import { Revenue } from './screens/Details/Revenue';
import { Expenses } from './screens/Details/Expenses';
import { Liquidity } from './screens/Details/Liquidity';
import { FundDetail } from './screens/Fund/FundDetail';
import { PlanProvider, PlanResetOnEntry } from './state/plan';
import { useDemo } from './state/demo';
import { JumpSheet } from './components/app/TimeMachine';
import { paths } from './routes';

/** Paths are relative to /app */
const routes: ScreenRoute[] = [
  { path: '', index: true, element: <Home /> },
  { path: 'kosh', element: <Kosh /> },
  { path: 'order', element: <OrderPlaced /> },
  { path: 'portfolio', element: <Portfolio /> },
  { path: 'revenue', element: <Revenue /> },
  { path: 'expenses', element: <Expenses /> },
  { path: 'liquidity', element: <Liquidity /> },
  { path: 'fund/:id', element: <FundDetail /> },
  // Anything else under /app goes Home
  { path: '*', element: <Navigate to={paths.home} replace /> },
];

/** Holds the space for Blade's fixed BottomNav and keeps it clear of the iPhone home indicator */
const NavSlot = styled.div({
  flexShrink: 0,
  // && beats Blade's own class on the nav
  '&& > *': { paddingBottom: 'env(safe-area-inset-bottom)' },
});

/** The mobile app demo, under /app */
export function DemoApp() {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const showBottomNav = TAB_PATHS.includes(pathname);
  const { today } = useDemo();

  // Blade's BottomNav is position: fixed. Measure it so screens don't scroll under it
  // and toasts sit above it.
  const navRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  useLayoutEffect(() => {
    const nav = navRef.current?.firstElementChild;
    setNavHeight(showBottomNav && nav ? nav.getBoundingClientRect().height : 0);
  }, [showBottomNav]);

  return (
    <MobileShell>
      <PlanProvider>
      <PlanResetOnEntry />
      <SheetHost>
      <AppHeader />
      {/* Keyed by the demo date: when the clock moves, every screen re-reads Kosh's numbers */}
      <Box key={today} position="relative" flex={1} overflow="hidden">
        <AnimatedRoutes routes={routes} />
      </Box>
      {showBottomNav && (
        <NavSlot ref={navRef} style={{ height: navHeight }}>
          <AppBottomNav />
        </NavSlot>
      )}
      <ToastContainer offsetBottom={navHeight + theme.spacing[4]} />
      <JumpSheet />
      </SheetHost>
      </PlanProvider>
    </MobileShell>
  );
}
