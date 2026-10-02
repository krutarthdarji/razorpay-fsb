import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, useTheme } from '@razorpay/blade/components';
import { navHeight } from '../../components/GlobalNav';
import { useOnScreen } from '../../lib/useOnScreen';
import { paths } from '../../routes';
import { Hero } from './Hero';
import { FrictionSection } from './FrictionSection';
import { RecommendationSection } from './RecommendationSection';
import { HowItWorks } from './HowItWorks';
import { ReturnsSection } from './ReturnsSection';
import { PocketSection } from './PocketSection';
import { FinalCta } from './FinalCta';
import { Footer } from './Footer';
import { FloatingDemoButton } from './FloatingDemoButton';

export function Landing() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const goToDemo = () => navigate(paths.home);

  // The hero's App Demo button docks at the bottom once it scrolls away,
  // and steps aside again when the closing App Demo button is on screen.
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const finalCtaRef = useRef<HTMLDivElement>(null);
  const heroCtaVisible = useOnScreen(heroCtaRef, true);
  const finalCtaVisible = useOnScreen(finalCtaRef);

  return (
    <Box paddingTop={`calc(${navHeight(theme.spacing)}px + env(safe-area-inset-top))`}>
      <Hero ref={heroCtaRef} onDemo={goToDemo} />
      <FrictionSection />
      <RecommendationSection />
      <HowItWorks />
      <ReturnsSection />
      <PocketSection />
      <FinalCta ref={finalCtaRef} onDemo={goToDemo} />
      <Footer />
      <FloatingDemoButton visible={!heroCtaVisible && !finalCtaVisible} onDemo={goToDemo} />
    </Box>
  );
}
