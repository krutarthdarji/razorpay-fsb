import { forwardRef } from 'react';
import styled from 'styled-components';
import {
  Amount,
  ArrowRightIcon,
  Badge,
  Box,
  Button,
  InstantSettlementIcon,
  ShieldIcon,
  SparklesIcon,
  Text,
  TrendingUpIcon,
  useTheme,
  type IconComponent,
} from '@razorpay/blade/components';
import { motion } from 'framer-motion';
import { recommendation } from '../../lib/recommendation';
import { msToS, toBezier } from '../../lib/motion';
import { useIsDesktop } from '../../lib/useIsDesktop';
import { AppPreview } from './AppPreview';
import { Container, HighlightHeading } from './layout';

/** Soft blue wash like the razorpay.com/x hero */
const HeroBackground = styled.section(({ theme }) => ({
  overflow: 'hidden',
  paddingTop: theme.spacing[11],
  background: [
    `radial-gradient(ellipse 80% 60% at 50% 0%, ${theme.colors.surface.background.primary.subtle}, transparent)`,
    `linear-gradient(180deg, ${theme.colors.surface.background.cloud.subtle} 0%, ${theme.colors.surface.background.gray.intense} 100%)`,
  ].join(', '),
}));

type ChipProps = { icon: IconComponent; title: string; amount?: number; caption?: string };

function FactChip({ icon: Icon, title, amount, caption }: ChipProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap="spacing.3"
      padding="spacing.4"
      borderRadius="medium"
      backgroundColor="surface.background.gray.intense"
      elevation="highRaised"
    >
      <Box
        padding="spacing.3"
        borderRadius="medium"
        backgroundColor="feedback.background.positive.subtle"
        display="flex"
      >
        <Icon size="medium" color="feedback.icon.positive.intense" />
      </Box>
      <Box>
        <Text size="small" color="surface.text.gray.muted">
          {title}
        </Text>
        {amount !== undefined ? (
          <Amount value={amount} type="body" size="large" weight="semibold" suffix="none" />
        ) : (
          <Text weight="semibold">{caption}</Text>
        )}
      </Box>
    </Box>
  );
}

/** Where each chip sits around the phone on desktop */
const chipSpots: { top: string; left?: string; right?: string }[] = [
  { top: '12%', left: '4%' },
  { top: '8%', right: '4%' },
  { top: '52%', left: '0%' },
  { top: '48%', right: '0%' },
];

type Props = { onDemo: () => void };

export const Hero = forwardRef<HTMLDivElement, Props>(function Hero({ onDemo }, ctaRef) {
  const { theme } = useTheme();
  const isDesktop = useIsDesktop();

  const chips: ChipProps[] = [
    { icon: ShieldIcon, title: 'Salaries on 1 Nov', caption: 'Covered' },
    { icon: SparklesIcon, title: 'Recommended for you', amount: recommendation.safe },
    { icon: InstantSettlementIcon, title: 'Need it back?', caption: 'Instant Redeem' },
    { icon: TrendingUpIcon, title: `Earns in ${recommendation.days} days`, amount: recommendation.expectedEarnings },
  ];

  return (
    <HeroBackground>
      <Container>
        <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.6" textAlign="center">
          <Badge color="primary" size="medium">
            New in the RazorpayX app
          </Badge>
          <HighlightHeading
            as="h1"
            size="xlarge"
            before="RazorpayX tells you "
            highlight="exactly how much"
            after={
              <>
                <br />
                idle cash is safe to invest.
              </>
            }
          />
          <Box maxWidth="620px">
            <Text size="large" color="surface.text.gray.muted" textAlign="center">
              A recommendation personalised to your business. We read your scheduled payouts, predict the spends
              that are not on your calendar yet, and give you one amount to invest. Invest it in 3 taps. Withdraw
              anytime.
            </Text>
          </Box>
          <Box ref={ctaRef} display="flex" flexDirection="column" alignItems="center" gap="spacing.3">
            <Button size="large" icon={ArrowRightIcon} iconPosition="right" onClick={onDemo}>
              App Demo
            </Button>
            <Text size="small" color="surface.text.gray.muted">
              No sign-up. Opens the mobile app demo.
            </Text>
          </Box>
        </Box>

        <Box position="relative" marginTop={{ base: 'spacing.9', m: 'spacing.11' }} maxWidth="1000px" marginX="auto">
          <AppPreview screenHeight={isDesktop ? 600 : 520} />
          {isDesktop &&
            chips.map((chip, i) => (
              <motion.div
                key={chip.title}
                style={{ position: 'absolute', ...chipSpots[i] }}
                initial={{ opacity: 0, y: theme.spacing[5] }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: msToS(theme.motion.delay.moderate) + i * msToS(theme.motion.delay.xquick),
                  duration: msToS(theme.motion.duration.gentle),
                  ease: toBezier(theme.motion.easing.entrance),
                }}
              >
                <FactChip {...chip} />
              </motion.div>
            ))}
        </Box>
      </Container>
    </HeroBackground>
  );
});
