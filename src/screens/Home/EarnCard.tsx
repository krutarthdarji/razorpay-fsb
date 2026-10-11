import { Box, Card, CardBody, Heading, Text, TrendingUpIcon } from '@razorpay/blade/components';
import { plan } from '../../data';
import { formatDay, formatMonths } from '../../lib/dates';
import { formatApprox, formatINR } from '../../lib/format';
import { couldEarn, holdingsSplit, koshSplit, yearlyPace } from '../../lib/funds';
import type { Holding } from '../../state/demo';
import { EarnCompare } from '../../components/app/EarnCompare';
import { CycleGrowth } from '../../components/app/CycleGrowth';

/** Before investing: what the surplus could earn through Kosh, against an auto-sweep FD and sitting idle */
export function EarnCard({ amount, months, days }: { amount: number; months: number; days: number }) {
  return (
    <Card padding="spacing.5" elevation="lowRaised">
      <CardBody>
        <Heading size="small">What your surplus could earn</Heading>
        <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
          {formatINR(amount)} over {formatMonths(months)}, in three places
        </Text>
        <Box marginTop="spacing.4">
          <EarnCompare amount={amount} allocations={koshSplit} months={months} days={days} />
        </Box>
      </CardBody>
    </Card>
  );
}

type CompoundingProps = { holdings: Holding[]; value: number; earned: number };

/** After investing: the money is compounding. Roughly what it has earned, earns a day, and its path across Kosh's cycle. */
export function CompoundingCard({ holdings, value, earned }: CompoundingProps) {
  const pace = yearlyPace(holdingsSplit(holdings));
  const since = holdings.map((h) => h.placedOn).sort()[0];
  const waiting = holdings.every((h) => h.allotOn > plan.today);
  const stats = [
    { label: 'Earned so far', value: formatApprox(earned) },
    { label: 'Earning a day', value: formatApprox(couldEarn(value, pace, 1)) },
  ];

  return (
    <Card padding="spacing.5" elevation="lowRaised">
      <CardBody>
        <Box display="flex" alignItems="center" gap="spacing.3">
          <Box padding="spacing.3" borderRadius="medium" backgroundColor="feedback.background.positive.subtle" display="flex">
            <TrendingUpIcon size="large" color="feedback.icon.positive.intense" />
          </Box>
          <Box>
            <Heading size="small">{waiting ? 'Your money is about to compound' : 'Your money is compounding'}</Heading>
            <Text size="small" color="surface.text.gray.muted">
              Invested through Kosh since {formatDay(since)}
            </Text>
          </Box>
        </Box>

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.3" marginTop="spacing.5">
          {stats.map((s) => (
            <Box key={s.label} padding="spacing.4" borderRadius="large" backgroundColor="surface.background.gray.moderate">
              <Text size="xsmall" color="surface.text.gray.muted">
                {s.label}
              </Text>
              <Text size="large" weight="semibold" color="feedback.text.positive.intense">
                {s.value}
              </Text>
            </Box>
          ))}
        </Box>

        <Box marginTop="spacing.5">
          <CycleGrowth />
        </Box>
      </CardBody>
    </Card>
  );
}
