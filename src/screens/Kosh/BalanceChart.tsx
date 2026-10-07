import {
  Box,
  ChartArea,
  ChartAreaWrapper,
  ChartCartesianGrid,
  ChartLegend,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
} from '@razorpay/blade/components';
import type { BalancePoint } from '../../lib/forecast';
import { formatINR, formatLakh } from '../../lib/format';

type Props = { points: BalancePoint[]; invested: number; keyDays: string[] };

/** Balance day by day, invested vs left idle */
export function BalanceChart({ points, invested, keyDays }: Props) {
  return (
    // Blade's area wrapper forces height: 100%, so the Box sets the size
    <Box height="240px">
      <ChartAreaWrapper data={points}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="day" ticks={keyDays} interval={0} padding={{ left: 0, right: 16 }} />
        <ChartYAxis tickFormatter={(v: number) => formatLakh(v)} width={44} interval={0} />
        <ChartTooltip formatter={(v) => formatINR(Number(v))} />
        <ChartLegend />
        <ChartArea dataKey="idle" name="If left idle" type="stepAfter" stackId="idle" color="data.background.categorical.gray.intense" />
        <ChartArea
          dataKey="invested"
          name={`If you invest ${formatLakh(invested)}`}
          type="stepAfter"
          stackId="invested"
          color="data.background.categorical.blue.strong"
        />
      </ChartAreaWrapper>
    </Box>
  );
}
