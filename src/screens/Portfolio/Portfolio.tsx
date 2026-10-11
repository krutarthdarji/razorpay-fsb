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
  Heading,
  Link,
  Text,
  useToast,
  useTheme,
} from '@razorpay/blade/components';
import type { FundId } from '../../data/funds';
import { formatDay, formatMonths, formatWeekday } from '../../lib/dates';
import { formatApprox, formatINR } from '../../lib/format';
import { couldEarn, fundById, holdingValue, holdingsSplit, yearlyPace } from '../../lib/funds';
import { recommendation } from '../../lib/recommendation';
import { useDemo } from '../../state/demo';
import { usePlan } from '../../state/plan';
import { paths } from '../../routes';
import { AgentMessage } from '../../components/app/AgentMessage';
import { CycleComplete } from '../../components/app/CycleComplete';
import { MpinSheet } from '../../components/app/MpinSheet';
import { Reveal } from '../../components/app/Reveal';
import { TimeMachine } from '../../components/app/TimeMachine';
import { fundColor } from '../../components/app/fundStyle';
import { WithdrawSheet, type WithdrawChoice } from './WithdrawSheet';

const ValueCard = styled.div(({ theme }) => ({
  padding: theme.spacing[6],
  borderRadius: theme.border.radius['2xlarge'],
  boxShadow: theme.elevation.midRaised,
  background: [
    `radial-gradient(circle at 100% 0%, ${theme.colors.data.background.categorical.purple.intense}, transparent 55%)`,
    `linear-gradient(160deg, ${theme.colors.interactive.background.primary.default}, ${theme.colors.interactive.background.primary.highlighted})`,
  ].join(', '),
}));

/** What's invested and where, roughly what it's worth, invest more, and instant withdrawal by fund */
export function Portfolio() {
  const navigate = useNavigate();
  const toast = useToast();
  const { theme } = useTheme();
  const { today, holdings, totalInvested, value, earned, monthsLeft, matured, finished, pendingAllotment, withdraw, startFlow } = useDemo();
  const plan = usePlan();
  /** Undefined: sheet closed. Null: open on "all funds". A fund id: open on that fund. */
  const [withdrawFrom, setWithdrawFrom] = useState<FundId | null | undefined>(undefined);
  const [pending, setPending] = useState<WithdrawChoice | null>(null);

  // One row per fund, however many orders went into it
  const rows = [...new Set(holdings.map((h) => h.fundId))].map((fundId) => {
    const lots = holdings.filter((h) => h.fundId === fundId);
    return {
      fundId,
      fund: fundById[fundId],
      invested: lots.reduce((s, h) => s + h.amount, 0),
      value: lots.reduce((s, h) => s + holdingValue(h, today), 0),
      since: lots.map((h) => h.placedOn).sort()[0],
      allotting: lots.some((h) => h.allotOn > today),
    };
  });
  const investMore = () => {
    startFlow();
    navigate(paths.kosh);
  };

  if (!holdings.length) {
    return (
      <Box padding="spacing.5">
        <Reveal>
          {finished ? (
            <CycleComplete />
          ) : (
          <Card padding="spacing.5" elevation="midRaised">
            <CardBody>
              <AgentMessage instant caption="portfolio">
                <Heading size="medium">Nothing invested yet</Heading>
                <Text color="surface.text.gray.muted" marginTop="spacing.3">
                  Kosh recommends investing {formatINR(recommendation.amount)} of your surplus for {formatMonths(recommendation.months)}. More returns, 100% liquid.
                </Text>
                <Box marginTop="spacing.5">
                  <Button isFullWidth icon={ArrowRightIcon} iconPosition="right" onClick={investMore}>
                    {`Put my ${formatINR(recommendation.amount)} to work`}
                  </Button>
                </Box>
              </AgentMessage>
            </CardBody>
          </Card>
          )}
        </Reveal>
      </Box>
    );
  }

  return (
    <Box padding="spacing.5" display="flex" flexDirection="column" gap="spacing.5">
      {finished && (
        <Reveal index={0}>
          <CycleComplete />
        </Reveal>
      )}
      <Reveal index={0}>
        <ValueCard>
          <Text size="small" color="surface.text.staticWhite.muted">
            Value today, approx.
          </Text>
          <Amount value={value} type="display" size="small" weight="semibold" suffix="none" color="surface.text.staticWhite.normal" />
          <Box display="flex" gap="spacing.6" marginTop="spacing.5">
            <Box>
              <Text size="xsmall" color="surface.text.staticWhite.muted">
                Invested
              </Text>
              <Amount value={totalInvested} size="medium" weight="semibold" suffix="none" color="surface.text.staticWhite.normal" />
            </Box>
            <Box>
              <Text size="xsmall" color="surface.text.staticWhite.muted">
                Earned, approx.
              </Text>
              <Text weight="semibold" color="surface.text.staticWhite.normal">
                {formatApprox(earned)}
              </Text>
            </Box>
          </Box>
        </ValueCard>
      </Reveal>

      <Reveal index={1}>
        <Box padding="spacing.5" borderRadius="xlarge" backgroundColor={pendingAllotment ? 'surface.background.primary.subtle' : 'feedback.background.positive.subtle'}>
          {pendingAllotment ? (
            <>
              <Text weight="semibold">Units will be allotted on {formatWeekday(pendingAllotment)}</Text>
              <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
                Your order is with the fund house. It stays 100% liquid throughout.
              </Text>
            </>
          ) : (
            <>
              <Text weight="semibold" color="feedback.text.positive.intense">
                Your money is compounding
              </Text>
              <Text size="small" color="feedback.text.positive.intense" marginTop="spacing.1">
                Earning about {formatINR(couldEarn(value, yearlyPace(holdingsSplit(holdings)), 1))} a day, at the funds' recent pace.{' '}
                {matured ? 'Your chosen period is over: withdraw, or let it keep earning.' : `About ${formatMonths(monthsLeft ?? 1)} left in your chosen period.`}
              </Text>
            </>
          )}
        </Box>
      </Reveal>

      <Reveal index={2}>
        <Card padding="spacing.5" elevation="lowRaised">
          <CardBody>
            <Text weight="semibold">Where your money is</Text>
            <Box display="flex" height="12px" borderRadius="max" overflow="hidden" gap="spacing.1" marginTop="spacing.4">
              {rows.map((h) => (
                <div key={h.fundId} style={{ width: `${(h.invested / totalInvested) * 100}%`, backgroundColor: fundColor(theme, h.fundId) }} />
              ))}
            </Box>
            <Box display="flex" flexDirection="column" marginTop="spacing.2">
              {rows.map((h, i) => (
                <Box key={h.fundId} paddingY="spacing.4" borderTopWidth={i === 0 ? 'none' : 'thin'} borderTopColor="surface.border.gray.subtle">
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap="spacing.3">
                    <Box display="flex" alignItems="flex-start" gap="spacing.3">
                      <div style={{ width: 10, height: 10, marginTop: 6, flexShrink: 0, borderRadius: theme.border.radius.round, backgroundColor: fundColor(theme, h.fundId) }} />
                      <Box>
                        <Text weight="semibold">{h.fund.name}</Text>
                        <Text size="xsmall" color="surface.text.gray.muted">
                          {formatINR(h.invested)} invested · since {formatDay(h.since)}
                        </Text>
                      </Box>
                    </Box>
                    <Box textAlign="right" flexShrink={0}>
                      <Text weight="semibold">{formatApprox(h.value)}</Text>
                      <Badge color={h.allotting ? 'notice' : 'positive'} size="small">
                        {h.allotting ? 'Allotting' : 'Earning'}
                      </Badge>
                    </Box>
                  </Box>
                  <Box marginTop="spacing.2" paddingLeft="spacing.6">
                    <Link size="small" onClick={() => setWithdrawFrom(h.fundId)}>
                      Withdraw from this fund
                    </Link>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box display="flex" gap="spacing.3" marginTop="spacing.3">
              <Box flex={1}>
                <Button isFullWidth variant="secondary" onClick={() => setWithdrawFrom(null)}>
                  Withdraw
                </Button>
              </Box>
              {!finished && (
                <Box flex={1}>
                  <Button isFullWidth onClick={investMore}>
                    Invest more
                  </Button>
                </Box>
              )}
            </Box>
          </CardBody>
        </Card>
      </Reveal>

      <TimeMachine />

      <Text size="xsmall" color="surface.text.gray.muted" textAlign="center">
        Values are approximate, estimated at each fund's pace over the last 12 months. Actual returns will differ.
      </Text>

      <WithdrawSheet
        isOpen={withdrawFrom !== undefined}
        onDismiss={() => setWithdrawFrom(undefined)}
        funds={rows.map((r) => ({ fundId: r.fundId, name: r.fund.name, value: r.value }))}
        initialFund={withdrawFrom ?? null}
        onContinue={(choice) => {
          setWithdrawFrom(undefined);
          setPending(choice);
        }}
      />

      <MpinSheet
        isOpen={pending !== null}
        onDismiss={() => setPending(null)}
        title="Confirm withdrawal"
        summary={
          <>
            <Amount value={pending?.amount ?? 0} type="heading" size="large" weight="semibold" suffix="none" />
            <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
              from {pending?.fundId ? fundById[pending.fundId].name : 'all funds'}, to your RazorpayX current account, now
            </Text>
          </>
        }
        onConfirmed={() => {
          if (pending) {
            withdraw(pending.fundId, pending.amount);
            toast.show({ content: `${formatINR(pending.amount)} credited to your current account`, color: 'positive', autoDismiss: true });
          }
          setPending(null);
          // A transaction changes where the merchant stands, so the Kosh page starts fresh
          plan.resetPlan();
        }}
      />
    </Box>
  );
}
