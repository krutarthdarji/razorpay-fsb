import { forwardRef } from 'react';
import styled from 'styled-components';
import {
  Amount,
  ArrowRightIcon,
  Badge,
  Box,
  Button,
  ClockIcon,
  InstantSettlementIcon,
  ShieldIcon,
  SparklesIcon,
  Text,
  useTheme,
  type IconComponent,
} from '@razorpay/blade/components';
import { motion } from 'framer-motion';
import { brand } from '../../brand';
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
    <Box display="flex" alignItems="center" gap="spacing.3" padding="spacing.4" borderRadius="large" backgroundColor="surface.background.gray.intense" elevation="highRaised">
      <Box padding="spacing.3" borderRadius="medium" backgroundColor="feedback.background.positive.subtle" display="flex">
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
  { top: '10%', left: '2%' },
  { top: '8%', right: '2%' },
  { top: '50%', left: '0%' },
  { top: '46%', right: '0%' },
];

type Props = { onDemo: () => void };

export const Hero = forwardRef<HTMLDivElement, Props>(function Hero({ onDemo }, ctaRef) {
  const { theme } = useTheme();
  const isDesktop = useIsDesktop();
  const r = recommendation;

  const chips: ChipProps[] = [
    { icon: SparklesIcon, title: `Safe for ${r.days} days`, amount: r.safe },
    { icon: ShieldIcon, title: 'Salaries on 1 Nov', caption: 'Covered first' },
    { icon: ClockIcon, title: 'Nudge to invested', caption: 'Under 2 minutes' },
    { icon: InstantSettlementIcon, title: 'Need it back?', caption: 'Instant credit, free for a day' },
  ];

  return (
    <HeroBackground>
      <Container>
        <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.6" textAlign="center">
          <Badge color="primary" size="medium" icon={SparklesIcon}>
            {`${brand.name} · the treasury agent in your RazorpayX app`}
          </Badge>
          <HighlightHeading
            as="h1"
            size="xlarge"
            before="Know exactly what's "
            highlight="safe to invest."
            after={
              <>
                <br />
                Invest it in one tap.
              </>
            }
          />
          <Box maxWidth="640px">
            <Text size="large" color="surface.text.gray.muted" textAlign="center">
              {brand.name} reads your real cash flow: collections, salaries, GST and vendor bills. It tells you how much
              can earn, and for how long. Payroll always comes first. Need it back? Instant credit, free for a day.
            </Text>
          </Box>
          <Box ref={ctaRef} display="flex" flexDirection="column" alignItems="center" gap="spacing.3">
            <Button size="large" icon={ArrowRightIcon} iconPosition="right" onClick={onDemo}>
              App Demo
            </Button>
            <Text size="small" color="surface.text.gray.muted">
              Ravi's account · nudge to invested in under 2 minutes
            </Text>
          </Box>
        </Box>

        <Box position="relative" marginTop={{ base: 'spacing.9', m: 'spacing.11' }} maxWidth="1000px" marginX="auto">
          <AppPreview screenHeight={isDesktop ? 640 : 560} />
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
