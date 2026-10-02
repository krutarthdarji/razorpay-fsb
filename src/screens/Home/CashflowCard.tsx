import {
  Amount,
  Badge,
  Box,
  Card,
  CardBody,
  ChartBar,
  ChartBarWrapper,
  ChartCartesianGrid,
  ChartLegend,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  Divider,
  Heading,
  SparklesIcon,
  Text,
} from '@razorpay/blade/components';
import type { Outflow } from '../../data';
import type { WeekFlow } from '../../lib/forecast';
import { formatDay } from '../../lib/dates';
import { formatINR, formatLakh } from '../../lib/format';

type Props = { days: number; weeks: WeekFlow[]; scheduled: Outflow[]; predicted: Outflow[] };

const firstDate = (o: Outflow) => o.payments[0].date;
const dateLabel = (o: Outflow) => (o.payments.length === 1 ? formatDay(firstDate(o)) : 'Various');

function OutflowRow({ outflow, caption }: { outflow: Outflow; caption: string }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" gap="spacing.4">
      <Box>
        <Text size="small">{outflow.label}</Text>
        <Text size="xsmall" color="surface.text.gray.muted">
          {caption}
        </Text>
      </Box>
      <Amount value={outflow.amount} size="small" weight="semibold" suffix="none" />
    </Box>
  );
}

/** Projected money in and out, week by week: scheduled payments plus the spends RazorpayX predicts */
export function CashflowCard({ days, weeks, scheduled, predicted }: Props) {
  const byDate = (list: Outflow[]) => [...list].sort((a, b) => firstDate(a).localeCompare(firstDate(b)));

  return (
    <Card padding="spacing.5">
      <CardBody>
        <Heading size="small">Next {days} days</Heading>
        <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
          Money in and out, week by week
        </Text>

        <ChartBarWrapper data={weeks} height="220px" marginTop="spacing.4">
          <ChartCartesianGrid />
          <ChartXAxis dataKey="day" secondaryDataKey="month" />
          <ChartYAxis tickFormatter={(v: number) => formatLakh(v)} width={44} interval={0} />
          <ChartTooltip formatter={(v) => formatINR(Number(v))} />
          <ChartLegend />
          <ChartBar dataKey="moneyIn" name="Coming in" color="data.background.categorical.green.intense" />
          <ChartBar dataKey="scheduledOut" name="Scheduled" stackId="out" color="data.background.categorical.red.moderate" />
          <ChartBar dataKey="predictedOut" name="Predicted" stackId="out" color="data.background.categorical.purple.moderate" />
        </ChartBarWrapper>

        <Divider marginY="spacing.4" />

        <Text size="small" weight="semibold">
          Scheduled payments
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.3" marginTop="spacing.3">
          {byDate(scheduled).map((o) => (
            <OutflowRow key={o.id} outflow={o} caption={dateLabel(o)} />
          ))}
        </Box>

        <Box display="flex" alignItems="center" gap="spacing.2" marginTop="spacing.5">
          <Text size="small" weight="semibold">
            Spends we predict
          </Text>
          <Badge color="primary" icon={SparklesIcon} size="small">
            RazorpayX
          </Badge>
        </Box>
        <Text size="xsmall" color="surface.text.gray.muted" marginTop="spacing.1">
          Not on your calendar yet. Learned from your account history.
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.3" marginTop="spacing.3">
          {byDate(predicted).map((o) => (
            <OutflowRow key={o.id} outflow={o} caption={o.basis ?? dateLabel(o)} />
          ))}
        </Box>
      </CardBody>
    </Card>
  );
}
