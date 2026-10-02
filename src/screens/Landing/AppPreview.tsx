import { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Box } from '@razorpay/blade/components';
import { Home } from '../Home/Home';
import { AppBottomNav } from '../../components/AppBottomNav';

/** The app is designed at this width; the preview scales it down to fit */
const SCREEN_WIDTH = 390;

const Bezel = styled.div(({ theme }) => ({
  padding: theme.spacing[3],
  borderRadius: theme.border.radius['2xlarge'] + theme.spacing[3],
  backgroundColor: theme.colors.feedback.background.neutral.intense,
  boxShadow: theme.elevation.highRaised,
}));

const Screen = styled.div(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.border.radius['2xlarge'],
  backgroundColor: theme.colors.surface.background.gray.moderate,
}));

/** Unscaled app surface. transform makes it the containing block for the fixed BottomNav. */
const Surface = styled.div(({ theme }) => ({
  width: SCREEN_WIDTH,
  transformOrigin: 'top left',
  pointerEvents: 'none',
  backgroundColor: theme.colors.surface.background.gray.moderate,
}));

/**
 * The real Home screen, live, inside a phone outline. Not interactive:
 * it's `inert` so it can't be clicked or tabbed into.
 */
export function AppPreview({ screenHeight }: { screenHeight: number }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    surfaceRef.current?.setAttribute('inert', '');
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / SCREEN_WIDTH)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Box width="100%" maxWidth={`${SCREEN_WIDTH}px`} marginX="auto">
      <Bezel>
        <div ref={outerRef}>
          <Screen style={{ width: SCREEN_WIDTH * scale, height: screenHeight * scale }}>
            <Surface
              ref={surfaceRef}
              aria-hidden
              style={{ height: screenHeight, transform: `scale(${scale})` }}
            >
              <Home />
              <AppBottomNav />
            </Surface>
          </Screen>
        </div>
      </Bezel>
    </Box>
  );
}
