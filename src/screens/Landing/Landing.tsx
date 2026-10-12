import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, useTheme } from '@razorpay/blade/components';
import { LandingNav, navHeight } from '../../components/LandingNav';
import { useOnScreen } from '../../lib/useOnScreen';
import { paths } from '../../routes';
import { Hero } from './Hero';
import { ProblemSection } from './ProblemSection';
import { MerchantSection } from './MerchantSection';
import { TodaySection } from './TodaySection';
import { FrictionSection } from './FrictionSection';
import { InsightBand } from './InsightBand';
import { SolutionSection } from './SolutionSection';
import { FlowSection } from './FlowSection';
import { WhySection } from './WhySection';
import { DecisionsSection } from './DecisionsSection';
import { MetricsSection } from './MetricsSection';
import { ImpactSection } from './ImpactSection';
import { FinalCta } from './FinalCta';
import { Footer } from './Footer';
import { FloatingDemoButton } from './FloatingDemoButton';

/**
 * The pitch, in the order the brief asks for it. The hero states the problem and the
 * solution; then ten numbered sections: the problem, who it's for, how it's handled
 * today, what has stopped adoption, the solution, how it works, how it's made
 * possible, decisions, metrics and impact.
 */
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
      <LandingNav />
      <Hero ref={heroCtaRef} onDemo={goToDemo} />
      <ProblemSection />
      <MerchantSection />
      <TodaySection />
      <FrictionSection />
      <InsightBand />
      <SolutionSection />
      <FlowSection onDemo={goToDemo} />
      <WhySection />
      <DecisionsSection />
      <MetricsSection />
      <ImpactSection />
      <FinalCta ref={finalCtaRef} onDemo={goToDemo} />
      <Footer />
      <FloatingDemoButton visible={!heroCtaVisible && !finalCtaVisible} onDemo={goToDemo} />
    </Box>
  );
}
