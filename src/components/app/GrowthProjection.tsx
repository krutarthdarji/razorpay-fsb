import {
  Amount,
  ArrowRightIcon,
  Box,
  ChartArea,
  ChartAreaWrapper,
  ChartCartesianGrid,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  Text,
} from '@razorpay/blade/components';
import { formatMonths } from '../../lib/dates';
import { couldEarn, growTo, valueSeries } from '../../lib/funds';
import { formatApprox, formatINR } from '../../lib/format';

type Props = {
  amount: number;
  /** Yearly pace of the split, as a fraction */
  pace: number;
  months: number;
};

/** How an investment grows over its period: start, end, the curve, and the gain along the way */
export function GrowthProjection({ amount, pace, months }: Props) {
  const days = (months * 365) / 12;
  const end = growTo(amount, pace, days);
  const series = valueSeries(amount, pace, months);
  const span = Math.max(1, end - amount);
  // Label the start, the middle and the end, whatever the length
  const ticks = [...new Set([series[0].month, series[Math.floor(months / 2)].month, series[months].month])];
  // A few points along the way: a third, two thirds, the end
  const stops = [...new Set([Math.max(1, Math.round(months / 3)), Math.max(1, Math.round((2 * months) / 3)), months])];

  return (
    <Box>
      <Box display="flex" alignItems="center" gap="spacing.3" flexWrap="wrap">
        <Box>
          <Text size="xsmall" color="surface.text.gray.muted">
            Today
          </Text>
          <Amount value={amount} type="body" size="large" weight="semibold" suffix="none" />
        </Box>
        <ArrowRightIcon size="medium" color="surface.icon.gray.muted" />
        <Box>
          <Text size="xsmall" color="feedback.text.positive.intense">
            In {formatMonths(months)}, about
          </Text>
          <Text size="large" weight="semibold" color="feedback.text.positive.intense">
            {formatApprox(end)}
          </Text>
        </Box>
      </Box>

      {/* Blade's area wrapper forces height: 100%, so the Box sets the size */}
      <Box height="160px" marginTop="spacing.4">
        <ChartAreaWrapper data={series}>
          <ChartCartesianGrid />
          <ChartXAxis dataKey="month" ticks={ticks} interval={0} padding={{ left: 8, right: 24 }} />
          <ChartYAxis
            domain={[amount - span * 0.15, end + span * 0.15]}
            allowDataOverflow
            width={64}
            tickFormatter={(v: number) => `₹${(v / 1_00_000).toFixed(2)}L`}
          />
          <ChartTooltip formatter={(v) => formatINR(Number(v))} />
          <ChartArea dataKey="value" name="Value" type="monotone" color="data.background.categorical.green.intense" />
        </ChartAreaWrapper>
      </Box>

      <Box display="grid" gridTemplateColumns={`repeat(${stops.length}, 1fr)`} gap="spacing.3" marginTop="spacing.4">
        {stops.map((m) => (
          <Box key={m} padding="spacing.3" borderRadius="medium" backgroundColor="feedback.background.positive.subtle">
            <Text size="xsmall" color="feedback.text.positive.intense">
              Gain after {formatMonths(m)}
            </Text>
            <Text weight="semibold" color="feedback.text.positive.intense">
              {formatApprox(couldEarn(amount, pace, (m * 365) / 12))}
            </Text>
          </Box>
        ))}
      </Box>
      <Text size="xsmall" color="surface.text.gray.muted" marginTop="spacing.3">
        Compounding: each day's gain can earn too. Estimated at the funds' pace over the last 12 months. Actual returns will differ.
      </Text>
    </Box>
  );
}
