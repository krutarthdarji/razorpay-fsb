import {
  Box,
  ChartArea,
  ChartAreaWrapper,
  ChartCartesianGrid,
  ChartLegend,
  ChartReferenceLine,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
} from '@razorpay/blade/components';
import type { BalancePoint } from '../../lib/forecast';
import { formatINR, formatLakh } from '../../lib/format';

type Props = {
  points: BalancePoint[];
  cushion: number;
  /** Also draw the balance after investing this much */
  invested?: number;
  /** Day label to mark, e.g. the lowest point */
  markDay?: string;
  height?: `${number}px`;
};

/** Projected balance day by day, with the cushion shaded and the lowest point marked */
export function ProjectionChart({ points, cushion, invested, markDay, height = '240px' }: Props) {
  const data = points.map((p) => ({ day: p.day, balance: p.balance, cushion, ...(invested ? { afterInvesting: p.balance - invested } : {}) }));
  // Label the first of each month on the x-axis
  const ticks = points.filter((p) => p.date.endsWith('-01')).map((p) => p.day);

  return (
    // Blade's area wrapper forces height: 100%, so the Box sets the size
    <Box height={height}>
      <ChartAreaWrapper data={data}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="day" ticks={ticks} interval={0} tickFormatter={(v: string) => v.split(' ')[1] ?? v} />
        <ChartYAxis tickFormatter={(v: number) => formatLakh(v)} width={44} interval={0} />
        <ChartTooltip formatter={(v) => formatINR(Number(v))} />
        <ChartLegend />
        <ChartArea dataKey="cushion" name="Kosh's cushion" type="linear" stackId="cushion" color="data.background.categorical.gold.moderate" />
        <ChartArea dataKey="balance" name="Projected balance" type="stepAfter" stackId="balance" color="data.background.categorical.blue.strong" />
        {invested ? (
          <ChartArea dataKey="afterInvesting" name="After investing" type="stepAfter" stackId="after" color="data.background.categorical.purple.intense" />
        ) : null}
        {markDay && <ChartReferenceLine x={markDay} label="Lowest" />}
      </ChartAreaWrapper>
    </Box>
  );
}
