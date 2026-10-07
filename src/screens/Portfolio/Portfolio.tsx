import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Amount,
  ArrowRightIcon,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Heading,
  SegmentedControl,
  SegmentedControlItem,
  Text,
  useToast,
  useTheme,
} from '@razorpay/blade/components';
import { holding, investOptions } from '../../data';
import { earnings } from '../../lib/forecast';
import { formatDay } from '../../lib/dates';
import { formatINR } from '../../lib/format';
import { useCountUp } from '../../lib/useCountUp';
import { recommendation } from '../../lib/recommendation';
import { useDemo } from '../../state/demo';
import { paths } from '../../routes';
import { AgentMessage } from '../../components/app/AgentMessage';
import { EarningsCompare } from '../../components/app/EarningsCompare';
import { MpinSheet } from '../../components/app/MpinSheet';
import { Reveal } from '../../components/app/Reveal';
import { WithdrawSheet } from './WithdrawSheet';

const ValueCard = styled.div(({ theme }) => ({
  padding: theme.spacing[6],
  borderRadius: theme.border.radius['2xlarge'],
  boxShadow: theme.elevation.midRaised,
  background: [
    `radial-gradient(circle at 100% 0%, ${theme.colors.data.background.categorical.purple.intense}, transparent 55%)`,
    `linear-gradient(160deg, ${theme.colors.interactive.background.primary.default}, ${theme.colors.interactive.background.primary.highlighted})`,
  ].join(', '),
}));

type View = 'today' | 'later';

/** What's working, what it earned vs sweep FD and idle, and instant withdrawal */
export function Portfolio() {
  const navigate = useNavigate();
  const toast = useToast();
  const { theme } = useTheme();
  const { investment, withdraw, startFlow } = useDemo();
  const [view, setView] = useState<View>('today');
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [pending, setPending] = useState<number | null>(null);

  const invested = investment?.amount ?? 0;
  const fund = investment ? investOptions[investment.optionId] : recommendation.option;
  const days = view === 'today' ? 0 : holding.daysHeld;
  const earned = earnings(invested, fund.annualRatePct, days);
  const sweep = earnings(invested, investOptions.sweepFd.annualRatePct, days);
  const value = invested + earned;
  const shownValue = useCountUp(value, theme.motion.duration.xgentle);

  if (!investment) {
    return (
      <Box padding="spacing.5">
        <Reveal>
          <Card padding="spacing.5" elevation="midRaised">
            <CardBody>
              <AgentMessage instant caption="portfolio">
                <Heading size="medium">Nothing invested yet</Heading>
                <Text color="surface.text.gray.muted" marginTop="spacing.3">
                  I found {formatINR(recommendation.safe)} sitting idle that is safe to invest for {recommendation.days} days.
                </Text>
                <Box marginTop="spacing.5">
                  <Button
                    isFullWidth
                    icon={ArrowRightIcon}
                    iconPosition="right"
                    onClick={() => {
                      startFlow();
                      navigate(paths.kosh);
                    }}
                  >
                    See recommendation
                  </Button>
                </Box>
              </AgentMessage>
            </CardBody>
          </Card>
        </Reveal>
      </Box>
    );
  }

  return (
    <Box padding="spacing.5" display="flex" flexDirection="column" gap="spacing.5">
      <Reveal index={0}>
        <SegmentedControl
          accessibilityLabel="Portfolio view"
          value={view}
          onChange={({ value: v }) => setView(v as View)}
          size="small"
        >
          <SegmentedControlItem value="today">Today</SegmentedControlItem>
          <SegmentedControlItem value="later">{`After ${holding.daysHeld} days`}</SegmentedControlItem>
        </SegmentedControl>
      </Reveal>

      <Reveal index={1}>
        <ValueCard>
          <Text size="small" color="surface.text.staticWhite.muted">
            Current value
          </Text>
          <Amount value={shownValue} type="display" size="small" weight="semibold" suffix="none" color="surface.text.staticWhite.normal" />
          <Box display="flex" gap="spacing.6" marginTop="spacing.5">
            <Box>
              <Text size="xsmall" color="surface.text.staticWhite.muted">
                Invested
              </Text>
              <Amount value={invested} size="medium" weight="semibold" suffix="none" color="surface.text.staticWhite.normal" />
            </Box>
            <Box>
              <Text size="xsmall" color="surface.text.staticWhite.muted">
                Earned
              </Text>
              <Amount value={earned} size="medium" weight="semibold" suffix="none" color="surface.text.staticWhite.normal" />
            </Box>
          </Box>
        </ValueCard>
      </Reveal>

      <Reveal index={2}>
        {view === 'later' ? (
          <Box padding="spacing.5" borderRadius="xlarge" backgroundColor="feedback.background.positive.subtle" textAlign="center">
            <Amount value={earned - sweep} type="heading" size="xlarge" weight="semibold" suffix="none" color="feedback.text.positive.intense" />
            <Text color="feedback.text.positive.intense" marginTop="spacing.1">
              more than your sweep FD, in {holding.daysHeld} days
            </Text>
          </Box>
        ) : (
          <Box padding="spacing.5" borderRadius="xlarge" backgroundColor="surface.background.primary.subtle">
            <Text weight="semibold">Units allotted on {formatDay(recommendation.allotmentDate)}</Text>
            <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
              Earning about {formatINR(earnings(invested, fund.annualRatePct, 1))} a day from then.
            </Text>
          </Box>
        )}
      </Reveal>

      {view === 'later' && (
        <Reveal index={3}>
          <Card padding="spacing.5" elevation="lowRaised">
            <CardBody>
              <Text size="small" weight="semibold">
                Earned in {holding.daysHeld} days
              </Text>
              <Box marginTop="spacing.4">
                <EarningsCompare
                  rows={[
                    { label: fund.name, value: earned, isBest: true },
                    { label: 'Sweep FD', value: sweep },
                    { label: 'Left idle', value: 0 },
                  ]}
                />
              </Box>
            </CardBody>
          </Card>
        </Reveal>
      )}

      <Reveal index={4}>
        <Card padding="spacing.5" elevation="lowRaised">
          <CardBody>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Text weight="semibold">{fund.name}</Text>
              <Badge color={view === 'today' ? 'notice' : 'positive'} size="small">
                {view === 'today' ? 'Allotting' : 'Active'}
              </Badge>
            </Box>
            <Divider marginY="spacing.4" />
            <Box display="flex" justifyContent="space-between">
              <Text size="small" color="surface.text.gray.muted">
                Invested on {formatDay(investment.placedOn)}
              </Text>
              <Amount value={invested} size="small" weight="semibold" suffix="none" />
            </Box>
            <Box display="flex" justifyContent="space-between" marginTop="spacing.2">
              <Text size="small" color="surface.text.gray.muted">
                Value
              </Text>
              <Amount value={value} size="small" weight="semibold" suffix="none" />
            </Box>
            <Box marginTop="spacing.5">
              <Button isFullWidth variant="secondary" onClick={() => setWithdrawOpen(true)}>
                Withdraw
              </Button>
            </Box>
          </CardBody>
        </Card>
      </Reveal>

      <WithdrawSheet
        isOpen={withdrawOpen}
        onDismiss={() => setWithdrawOpen(false)}
        maxAmount={value}
        onContinue={(amount) => {
          setWithdrawOpen(false);
          setPending(amount);
        }}
      />

      <MpinSheet
        isOpen={pending !== null}
        onDismiss={() => setPending(null)}
        title="Confirm withdrawal"
        summary={
          <>
            <Amount value={pending ?? 0} type="heading" size="large" weight="semibold" suffix="none" />
            <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
              to your RazorpayX current account, now
            </Text>
          </>
        }
        onConfirmed={() => {
          const credited = pending ?? 0;
          // Principal leaves the holding in proportion to what is taken out
          withdraw(Math.min(invested, Math.round((credited / value) * invested)), credited);
          setPending(null);
          toast.show({ content: `${formatINR(credited)} credited to your current account`, color: 'positive', autoDismiss: true });
        }}
      />
    </Box>
  );
}
