/** Small product mock-ups for the "How it works" cards. Built from Blade parts and mock data. */
import { Amount, Badge, Box, Divider, SparklesIcon, Text, useTheme } from '@razorpay/blade/components';
import { holding, investOptions, upcomingOutflows } from '../../data';
import { earnings } from '../../lib/forecast';
import { formatDay } from '../../lib/dates';
import { recommendation } from '../../lib/recommendation';
import { BalanceSplitBar } from '../../components/BalanceSplitBar';
import { FloatingLabel, VisualPanel } from './layout';

function MiniCard({ children, width = '320px' }: { children: React.ReactNode; width?: `${number}px` }) {
  return (
    <Box
      width="100%"
      maxWidth={width}
      padding="spacing.6"
      borderRadius="large"
      backgroundColor="surface.background.gray.intense"
      elevation="midRaised"
    >
      {children}
    </Box>
  );
}

export function ForecastVisual() {
  return (
    <VisualPanel>
      <MiniCard>
        <Text weight="semibold">Scheduled, next {recommendation.days} days</Text>
        <Box marginTop="spacing.4" display="flex" flexDirection="column" gap="spacing.3">
          {upcomingOutflows.map((o) => (
            <Box key={o.id} display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Text size="small">{o.label}</Text>
                <Text size="xsmall" color="surface.text.gray.muted">
                  {o.payments.length === 1 ? formatDay(o.payments[0].date) : 'Various'}
                </Text>
              </Box>
              <Amount value={o.amount} size="small" weight="semibold" suffix="none" />
            </Box>
          ))}
        </Box>
      </MiniCard>
      <FloatingLabel style={{ top: '10%', right: '6%' }}>Read from your account</FloatingLabel>
    </VisualPanel>
  );
}

export function PredictVisual() {
  return (
    <VisualPanel>
      <MiniCard width="380px">
        <Badge color="primary" icon={SparklesIcon} size="small">
          RazorpayX recommends
        </Badge>
        <Box marginTop="spacing.3">
          <Amount value={recommendation.safe} type="heading" size="xlarge" weight="semibold" suffix="none" />
        </Box>
        <Box marginTop="spacing.5">
          <BalanceSplitBar
            scheduled={recommendation.scheduled}
            predicted={recommendation.predicted}
            recommended={recommendation.safe}
          />
        </Box>
      </MiniCard>
      <FloatingLabel style={{ bottom: '8%', left: '6%' }}>Personalised for you</FloatingLabel>
    </VisualPanel>
  );
}

export function InvestVisual() {
  const { theme } = useTheme();
  const filled = (recommendation.safe / (recommendation.surplus || 1)) * 100;
  return (
    <VisualPanel>
      <MiniCard>
        <Text size="small" color="surface.text.gray.muted">
          Invest in {investOptions.liquid.name}
        </Text>
        <Amount value={recommendation.safe} type="heading" size="large" weight="semibold" suffix="none" />
        {/* Static slider look; the real one lives on the Invest screen */}
        <Box marginTop="spacing.5" position="relative" height="6px" borderRadius="max" backgroundColor="surface.background.gray.moderate">
          <div
            style={{
              width: `${filled}%`,
              height: '100%',
              borderRadius: theme.border.radius.max,
              backgroundColor: theme.colors.interactive.background.primary.default,
            }}
          />
        </Box>
        <Divider marginY="spacing.5" />
        <Text size="small" color="surface.text.gray.muted">
          Confirm with MPIN
        </Text>
        <Box display="flex" gap="spacing.3" marginTop="spacing.3">
          {[0, 1, 2, 3].map((i) => (
            <Box
              key={i}
              width="40px"
              height="44px"
              borderRadius="medium"
              borderWidth="thin"
              borderColor="surface.border.gray.normal"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text weight="semibold">•</Text>
            </Box>
          ))}
        </Box>
      </MiniCard>
      <FloatingLabel style={{ top: '10%', right: '6%' }}>3 taps</FloatingLabel>
    </VisualPanel>
  );
}

export function WithdrawVisual() {
  const earned = earnings(holding.invested, investOptions[holding.optionId].annualRatePct, holding.daysHeld);
  const sweep = earnings(holding.invested, investOptions.sweepFd.annualRatePct, holding.daysHeld);
  return (
    <VisualPanel>
      <MiniCard>
        <Text size="small" color="surface.text.gray.muted">
          Current value
        </Text>
        <Amount value={holding.invested + earned} type="heading" size="large" weight="semibold" suffix="none" />
        <Box marginTop="spacing.3" display="flex" alignItems="center" gap="spacing.2" flexWrap="wrap">
          <Badge color="positive" size="medium">
            More than sweep FD
          </Badge>
          <Amount value={earned - sweep} size="medium" weight="semibold" suffix="none" color="feedback.text.positive.intense" />
        </Box>
        <Divider marginY="spacing.5" />
        <Box display="flex" justifyContent="space-between">
          <Text size="small" color="surface.text.gray.muted">
            Earned in {holding.daysHeld} days
          </Text>
          <Amount value={earned} size="small" weight="semibold" suffix="none" />
        </Box>
      </MiniCard>
      <FloatingLabel style={{ bottom: '8%', right: '6%' }}>Instant Redeem</FloatingLabel>
    </VisualPanel>
  );
}
