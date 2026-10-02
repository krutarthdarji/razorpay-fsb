import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useTheme } from '@razorpay/blade/components';
import { msToS, toBezier } from '../lib/motion';

export type ScreenRoute = { path: string; element: React.ReactNode };

/** How far the screen underneath shifts left while the new one slides over it */
const PARALLAX = '-25%';

/**
 * Page push: new screen slides in from the right (entrance easing).
 * Back (browser back / navigate(-1)): reverse, with exit easing.
 * `custom` carries the direction so the exiting screen uses the current one.
 */
export function AnimatedRoutes({ routes }: { routes: ScreenRoute[] }) {
  const location = useLocation();
  const isBack = useNavigationType() === 'POP';
  const { theme } = useTheme();

  const transitionFor = (back: boolean) => ({
    duration: msToS(theme.motion.duration.moderate),
    ease: toBezier(back ? theme.motion.easing.exit : theme.motion.easing.entrance),
  });

  const variants: Variants = {
    enter: (back: boolean) => ({ x: back ? PARALLAX : '100%', zIndex: back ? 0 : 1 }),
    center: (back: boolean) => ({ x: 0, transition: transitionFor(back) }),
    exit: (back: boolean) => ({
      x: back ? '100%' : PARALLAX,
      zIndex: back ? 1 : 0,
      transition: transitionFor(back),
    }),
  };

  return (
    <AnimatePresence initial={false} custom={isBack}>
      <motion.div
        key={location.pathname}
        custom={isBack}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        style={{
          position: 'absolute',
          inset: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          backgroundColor: theme.colors.surface.background.gray.moderate,
        }}
      >
        <Routes location={location}>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
