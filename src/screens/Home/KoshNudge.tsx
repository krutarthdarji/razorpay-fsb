import styled from 'styled-components';
import { Amount, ArrowRightIcon, Box, Button, Text } from '@razorpay/blade/components';
import { AgentMessage } from '../../components/app/AgentMessage';
import { koshGradient } from '../../components/app/KoshAvatar';
import { formatDay } from '../../lib/dates';
import { formatINR } from '../../lib/format';

/** White card with a thin Kosh-gradient border */
const GradientBorder = styled.div(({ theme }) => ({
  padding: theme.border.width.thicker,
  borderRadius: theme.border.radius['2xlarge'],
  background: koshGradient(theme),
  boxShadow: theme.elevation.highRaised,
}));
const Inner = styled.div(({ theme }) => ({
  padding: theme.spacing[6],
  borderRadius: theme.border.radius['2xlarge'] - theme.border.width.thicker,
  backgroundColor: theme.colors.surface.background.gray.intense,
}));

type Props =
  | {
      state: 'recommend';
      safe: number;
      days: number;
      earnings: number;
      moreThanSweepFd: number;
      onSee: () => void;
    }
  | { state: 'invested'; invested: number; fundName: string; allotmentDate: string; onSee: () => void };

/** The hero of Home: Kosh tells the owner what's safe, in one sentence */
export function KoshNudge(props: Props) {
  return (
    <GradientBorder>
      <Inner>
        {props.state === 'recommend' ? (
          <AgentMessage>
            <Box display="flex" flexWrap="wrap" alignItems="baseline" columnGap="spacing.2">
              <Amount value={props.safe} type="heading" size="xlarge" weight="semibold" suffix="none" />
              <Text size="large">is safe to invest for {props.days} days.</Text>
            </Box>
            <Text color="surface.text.gray.muted" marginTop="spacing.3">
              Salaries, rent, GST and vendors stay covered. It could earn {formatINR(props.earnings)}, that's{' '}
              {formatINR(props.moreThanSweepFd)} more than your sweep FD.
            </Text>
            <Box marginTop="spacing.5">
              <Button isFullWidth size="large" icon={ArrowRightIcon} iconPosition="right" onClick={props.onSee}>
                See recommendation
              </Button>
            </Box>
          </AgentMessage>
        ) : (
          <AgentMessage instant caption="update">
            <Box display="flex" flexWrap="wrap" alignItems="baseline" columnGap="spacing.2">
              <Amount value={props.invested} type="heading" size="large" weight="semibold" suffix="none" />
              <Text size="large">is working for you.</Text>
            </Box>
            <Text color="surface.text.gray.muted" marginTop="spacing.3">
              In {props.fundName}. Units allotted on {formatDay(props.allotmentDate)}. I'll nudge you when more cash
              sits idle.
            </Text>
            <Box marginTop="spacing.5">
              <Button isFullWidth variant="secondary" icon={ArrowRightIcon} iconPosition="right" onClick={props.onSee}>
                View portfolio
              </Button>
            </Box>
          </AgentMessage>
        )}
      </Inner>
    </GradientBorder>
  );
}
