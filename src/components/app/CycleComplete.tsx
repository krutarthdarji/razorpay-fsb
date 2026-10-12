import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Box, Button, CheckCircleIcon, Heading, RefreshIcon, Text, useToast } from '@razorpay/blade/components';
import { formatDay, formatMonths } from '../../lib/dates';
import { formatApprox, formatINR } from '../../lib/format';
import { cycle } from '../../lib/recommendation';
import { useDemo } from '../../state/demo';
import { paths } from '../../routes';
import { koshGradient } from './KoshAvatar';
import { KoshTag } from './KoshTag';
import { CycleGrowth } from './CycleGrowth';

/** White card with a thin Kosh-gradient border */
const GradientBorder = styled.div(({ theme }) => ({
  padding: theme.border.width.thicker,
  borderRadius: theme.border.radius['2xlarge'],
  background: koshGradient(theme),
  boxShadow: theme.elevation.highRaised,
}));
const Inner = styled.div(({ theme }) => ({
  padding: theme.spacing[5],
  borderRadius: theme.border.radius['2xlarge'] - theme.border.width.thicker,
  backgroundColor: theme.colors.surface.background.gray.intense,
}));

/**
 * The end of the demo: Kosh's cycle is over. What the surplus grew to, against the
 * same money sitting idle in the current account, and a way to start again.
 */
export function CycleComplete() {
  const { totalInvested, earned, reset } = useDemo();
  const navigate = useNavigate();
  const toast = useToast();
  const principal = totalInvested || cycle.amount;
  const rows = [
    { label: 'Through Kosh', value: formatApprox(earned), strong: true },
    { label: 'Idle in the current account', value: formatINR(0), strong: false },
  ];

  return (
    <GradientBorder>
      <Inner>
        <KoshTag size="large" label="Cycle complete" />

        <Box display="flex" alignItems="center" gap="spacing.2" marginTop="spacing.4">
          <CheckCircleIcon size="medium" color="feedback.icon.positive.intense" />
          <Text size="large" weight="semibold" color="feedback.text.positive.intense">
            Your surplus earned about {formatINR(earned)}.
          </Text>
        </Box>
        <Text marginTop="spacing.1">
          {formatMonths(cycle.months)} as Kosh recommended, {formatDay(cycle.start)} to {formatDay(cycle.until)}. Every payment went through, and the money stayed 100% liquid.
        </Text>

        {totalInvested > 0 && (
          <Box marginTop="spacing.5">
            <CycleGrowth />
          </Box>
        )}

        <Box marginTop="spacing.5" padding="spacing.4" borderRadius="large" backgroundColor="surface.background.gray.moderate">
          <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">
            WHAT {formatINR(principal)} EARNED IN {formatMonths(cycle.months).toUpperCase()}
          </Text>
          <Box display="flex" flexDirection="column" gap="spacing.2" marginTop="spacing.3">
            {rows.map((r) => (
              <Box key={r.label} display="flex" justifyContent="space-between" alignItems="baseline" gap="spacing.3">
                <Text size="small" weight={r.strong ? 'semibold' : 'regular'}>
                  {r.label}
                </Text>
                <Text weight="semibold" color={r.strong ? 'feedback.text.positive.intense' : undefined}>
                  {r.value}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>

        <Box marginTop="spacing.5">
          <Heading size="small">That's the demo.</Heading>
          <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
            One recommendation, one tap, {formatMonths(cycle.months)}. {totalInvested > 0 ? 'You can still withdraw: it is credited instantly. Or start again.' : 'Start again any time.'}
          </Text>
        </Box>
        <Box marginTop="spacing.4">
          <Button
            isFullWidth
            size="large"
            icon={RefreshIcon}
            onClick={() => {
              reset();
              navigate(paths.home);
              toast.show({ content: 'Demo reset', color: 'neutral', autoDismiss: true });
            }}
          >
            Reset demo
          </Button>
        </Box>
      </Inner>
    </GradientBorder>
  );
}
