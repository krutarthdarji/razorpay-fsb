import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Box, ToastContainer, useTheme } from '@razorpay/blade/components';
import { MobileShell } from './components/MobileShell';
import { AnimatedRoutes, type ScreenRoute } from './components/AnimatedRoutes';
import { AppBottomNav, TAB_PATHS } from './components/AppBottomNav';
import { Home } from './screens/Home/Home';
import { Stub } from './screens/Stub/Stub';

/** Paths are relative to /app */
const routes: ScreenRoute[] = [
  { path: '', index: true, element: <Home /> },
  { path: 'insight', element: <Stub title="Safe amount" /> },
  { path: 'option', element: <Stub title="Choose option" /> },
  { path: 'invest', element: <Stub title="Invest" /> },
  { path: 'success', element: <Stub title="Done" /> },
  { path: 'portfolio', element: <Stub title="Portfolio" /> },
  { path: 'redeem', element: <Stub title="Redeem" /> },
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
      <Box position="relative" flex={1} overflow="hidden">
        <AnimatedRoutes routes={routes} />
      </Box>
      {showBottomNav && (
        <NavSlot ref={navRef} style={{ height: navHeight }}>
          <AppBottomNav />
        </NavSlot>
      )}
      <ToastContainer offsetBottom={navHeight + theme.spacing[4]} />
    </MobileShell>
  );
}
