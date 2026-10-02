import styled from 'styled-components';
import { Box, CheckCircleIcon, Heading, Text } from '@razorpay/blade/components';
import { investOptions } from '../../data';
import { recommendation } from '../../lib/recommendation';
import { formatINR } from '../../lib/format';
import { navHeight } from '../../components/GlobalNav';
import { Eyebrow, Section, SectionIntro } from './layout';
import { ForecastVisual, InvestVisual, PredictVisual, WithdrawVisual } from './StepVisuals';

type Step = { eyebrow: string; title: string; body: string; points: string[]; visual: React.ReactNode };

const steps: Step[] = [
  {
    eyebrow: 'Step 1 · See',
    title: 'We read your cash flow',
    body: 'Everything already scheduled for the next few weeks, straight from your RazorpayX account.',
    points: ['Salaries, rent and vendor payouts', 'Tax dates like GST', 'When your fees usually arrive'],
    visual: <ForecastVisual />,
  },
  {
    eyebrow: 'Step 2 · Recommend',
    title: 'We predict, then recommend',
    body: `We learn from your own history: refunds after admissions, ads before a batch, day-to-day costs. Then we recommend one amount: ${formatINR(recommendation.safe)}.`,
    points: [
      'Spends that are not on any calendar yet',
      'Personal to your business, not a rule of thumb',
      'One clear number, in rupees',
    ],
    visual: <PredictVisual />,
  },
  {
    eyebrow: 'Step 3 · Invest',
    title: 'Invest the rest in 3 taps',
    body: `We suggest a low-risk ${investOptions.liquid.name} that fits a ${recommendation.days}-day horizon. You pick the final amount.`,
    points: ['Compared with sweep FD and idle cash, in rupees', 'Warns you if you go above the recommended amount', 'Confirm with your MPIN'],
    visual: <InvestVisual />,
  },
  {
    eyebrow: 'Step 4 · Withdraw',
    title: 'Withdraw anytime',
    body: 'Your money is never locked away. Need it for a payout? Bring it back in seconds.',
    points: ['Instant Redeem: money in your account now', 'No lock-in, no paperwork', 'See what you earned over sweep FD'],
    visual: <WithdrawVisual />,
  },
];

/** On desktop each card sticks a little lower than the one before, so they stack as you scroll */
const StepCard = styled.div<{ $index: number }>(({ theme, $index }) => ({
  borderRadius: theme.border.radius.xlarge,
  border: `${theme.border.width.thin}px solid ${theme.colors.surface.border.gray.subtle}`,
  backgroundColor: theme.colors.surface.background.gray.intense,
  boxShadow: theme.elevation.lowRaised,
  padding: theme.spacing[6],
  [`@media (min-width: ${theme.breakpoints.m}px)`]: {
    position: 'sticky',
    top: navHeight(theme.spacing) + theme.spacing[8] + $index * theme.spacing[5],
    padding: theme.spacing[9],
    boxShadow: theme.elevation.highRaised,
  },
}));

export function HowItWorks() {
  return (
    <Section id="how-it-works" tone="gray">
      <SectionIntro eyebrow="How it works" before="From idle to invested in " highlight="under 2 minutes." />

      <Box display="flex" flexDirection="column" gap={{ base: 'spacing.6', m: 'spacing.11' }} marginTop="spacing.11">
        {steps.map((step, i) => (
          <StepCard key={step.title} $index={i}>
            <Box
              display="grid"
              gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }}
              gap={{ base: 'spacing.7', m: 'spacing.10' }}
              alignItems="center"
            >
              {step.visual}
              <Box display="flex" flexDirection="column" alignItems="flex-start" gap="spacing.4">
                <Eyebrow>{step.eyebrow}</Eyebrow>
                <Heading size="xlarge">{step.title}</Heading>
                <Text size="large" color="surface.text.gray.muted">
                  {step.body}
                </Text>
                <Box display="flex" flexDirection="column" gap="spacing.3" marginTop="spacing.2">
                  {step.points.map((p) => (
                    <Box key={p} display="flex" gap="spacing.3" alignItems="flex-start">
                      <CheckCircleIcon size="medium" color="feedback.icon.positive.intense" />
                      <Text>{p}</Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </StepCard>
        ))}
      </Box>
    </Section>
  );
}
