import {
  Amount,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  Box,
  Card,
  CardBody,
  ChartBar,
  ChartBarWrapper,
  ChartCartesianGrid,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  Heading,
  Text,
  type IconComponent,
} from '@razorpay/blade/components';
import type { WeekFlow } from '../../lib/forecast';
import { formatINR, formatLakh } from '../../lib/format';

function Stat({ icon: Icon, label, value, tone }: { icon: IconComponent; label: string; value: number; tone: 'in' | 'out' }) {
  return (
    <Box flex={1} padding="spacing.4" borderRadius="large" backgroundColor={tone === 'in' ? 'feedback.background.positive.subtle' : 'feedback.background.negative.subtle'}>
      <Box display="flex" alignItems="center" gap="spacing.1">
        <Icon size="small" color={tone === 'in' ? 'feedback.icon.positive.intense' : 'feedback.icon.negative.intense'} />
        <Text size="xsmall" color={tone === 'in' ? 'feedback.text.positive.intense' : 'feedback.text.negative.intense'}>
          {label}
        </Text>
      </Box>
      <Amount value={value} type="body" size="large" weight="semibold" suffix="none" marginTop="spacing.1" />
    </Box>
  );
}

type Props = { days: number; weeks: WeekFlow[]; moneyIn: number; moneyOut: number };

/** Money in vs out, week by week, for the next 45 days */
export function CashflowCard({ days, weeks, moneyIn, moneyOut }: Props) {
  return (
    <Card padding="spacing.5" elevation="lowRaised">
      <CardBody>
        <Heading size="small">Next {days} days</Heading>
        <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
          What Kosh sees coming in and going out
        </Text>
        <Box display="flex" gap="spacing.3" marginTop="spacing.4">
          <Stat icon={ArrowDownLeftIcon} label="Coming in" value={moneyIn} tone="in" />
          <Stat icon={ArrowUpRightIcon} label="Going out" value={moneyOut} tone="out" />
        </Box>
        <ChartBarWrapper data={weeks} height="180px" marginTop="spacing.5">
          <ChartCartesianGrid />
          <ChartXAxis dataKey="day" secondaryDataKey="month" />
          <ChartYAxis tickFormatter={(v: number) => formatLakh(v)} width={44} interval={0} />
          <ChartTooltip formatter={(v) => formatINR(Number(v))} />
          <ChartBar dataKey="moneyIn" name="Coming in" color="data.background.categorical.green.intense" />
          <ChartBar dataKey="scheduledOut" name="Going out" color="data.background.categorical.red.moderate" />
        </ChartBarWrapper>
      </CardBody>
    </Card>
  );
}
