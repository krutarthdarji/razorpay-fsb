import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { ArrowRightIcon, Button, useTheme } from '@razorpay/blade/components';
import { msToS, toBezier } from '../../lib/motion';
import { useIsDesktop } from '../../lib/useIsDesktop';

const Dock = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 900,
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing[5],
  paddingBottom: `calc(${theme.spacing[5]}px + env(safe-area-inset-bottom))`,
  pointerEvents: 'none',
}));

const Pill = styled.div(({ theme }) => ({
  pointerEvents: 'auto',
  width: '100%',
  maxWidth: 420,
  borderRadius: theme.border.radius.medium,
  boxShadow: theme.elevation.highRaised,
}));

/**
 * The hero's App Demo button, docked at the bottom once the hero button scrolls away.
 * Slides up with Blade's entrance easing, slides down with exit easing.
 */
export function FloatingDemoButton({ visible, onDemo }: { visible: boolean; onDemo: () => void }) {
  const { theme } = useTheme();
  const isDesktop = useIsDesktop();

  return (
    <AnimatePresence>
      {visible && (
        <Dock
          initial={{ y: '100%', opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { duration: msToS(theme.motion.duration.xmoderate), ease: toBezier(theme.motion.easing.entrance) },
          }}
          exit={{
            y: '100%',
            opacity: 0,
            transition: { duration: msToS(theme.motion.duration.quick), ease: toBezier(theme.motion.easing.exit) },
          }}
        >
          <Pill style={isDesktop ? { width: 'auto' } : undefined}>
            <Button size="large" isFullWidth={!isDesktop} icon={ArrowRightIcon} iconPosition="right" onClick={onDemo}>
              App Demo
            </Button>
          </Pill>
        </Dock>
      )}
    </AnimatePresence>
  );
}
