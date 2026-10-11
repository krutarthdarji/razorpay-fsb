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
import { formatDay } from '../../lib/dates';
import { formatApprox, formatINR } from '../../lib/format';
import { holdingValue } from '../../lib/funds';
import { cycle } from '../../lib/recommendation';
import { useDemo } from '../../state/demo';

/**
 * The invested money across Kosh's cycle, month by month: what it has grown to so far
 * (solid) and where it is heading (light). Once the cycle is over, it is all solid.
 */
export function CycleGrowth() {
  const { holdings, today, totalInvested, value, finished } = useDemo();
  if (!holdings.length) return null;

  const valueOn = (date: string) => holdings.reduce((t, h) => t + holdingValue(h, date), 0);
  const dates = [cycle.start, ...cycle.stops];
  /** The last month-end the clock has reached */
  const reached = dates.filter((d) => d <= today).length - 1;
  const data = dates.map((d, i) => ({
    month: i === 0 ? 'Start' : `${i} mo`,
    ...(i <= reached ? { soFar: valueOn(d) } : {}),
    ...(i >= reached ? { ahead: valueOn(d) } : {}),
  }));
  const low = valueOn(cycle.start);
  const end = valueOn(cycle.until);
  const span = Math.max(1, end - low);
  const ticks = [data[0].month, data[Math.floor(cycle.months / 2)].month, data[cycle.months].month];

  return (
    <Box>
      <Box display="flex" alignItems="center" gap="spacing.3" flexWrap="wrap">
        <Box>
          <Text size="xsmall" color="surface.text.gray.muted">
            {finished ? 'You invested' : 'Today, approx.'}
          </Text>
          {finished ? (
            <Amount value={totalInvested} type="body" size="large" weight="semibold" suffix="none" />
          ) : (
            <Text size="large" weight="semibold">
              {formatApprox(value)}
            </Text>
          )}
        </Box>
        <ArrowRightIcon size="medium" color="surface.icon.gray.muted" />
        <Box>
          <Text size="xsmall" color="feedback.text.positive.intense">
            {finished ? 'It grew to about' : `By ${formatDay(cycle.until)}, about`}
          </Text>
          <Text size="large" weight="semibold" color="feedback.text.positive.intense">
            {formatApprox(finished ? value : end)}
          </Text>
        </Box>
      </Box>

      {/* Blade's area wrapper forces height: 100%, so the Box sets the size */}
      <Box height="160px" marginTop="spacing.4">
        <ChartAreaWrapper data={data}>
          <ChartCartesianGrid />
          <ChartXAxis dataKey="month" ticks={ticks} interval={0} padding={{ left: 8, right: 24 }} />
          <ChartYAxis domain={[low - span * 0.15, end + span * 0.15]} allowDataOverflow width={64} tickFormatter={(v: number) => `₹${(v / 1_00_000).toFixed(2)}L`} />
          <ChartTooltip formatter={(v) => formatINR(Number(v))} />
          {!finished && <ChartArea dataKey="ahead" name="Projected" type="monotone" stackId="ahead" color="data.background.categorical.green.subtle" />}
          <ChartArea dataKey="soFar" name="So far" type="monotone" stackId="soFar" color="data.background.categorical.green.intense" />
        </ChartAreaWrapper>
      </Box>
      <Text size="xsmall" color="surface.text.gray.muted" marginTop="spacing.3">
        {finished
          ? "Estimated at the funds' pace over the last 12 months. Actual returns will differ."
          : "Darker: so far. Lighter: where it is heading. Compounding: each day's gain can earn too. Estimated at the funds' pace over the last 12 months. Actual returns will differ."}
      </Text>
    </Box>
  );
}
