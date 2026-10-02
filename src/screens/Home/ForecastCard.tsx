import {
  Box,
  Card,
  CardBody,
  ChartArea,
  ChartAreaWrapper,
  ChartCartesianGrid,
  ChartLegend,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  CheckCircleIcon,
  Heading,
  Text,
} from '@razorpay/blade/components';
import type { BalancePoint } from '../../lib/forecast';
import { formatINR, formatLakh } from '../../lib/format';

/** `keyDays` are the x-axis labels to show, e.g. today and the big payment dates */
type Props = { points: BalancePoint[]; invested: number; keyDays: string[] };

/** Balance day by day, invested vs left idle. Every payment stays covered. */
export function ForecastCard({ points, invested, keyDays }: Props) {
  const lowest = points.reduce((low, p) => (p.invested < low.invested ? p : low), points[0]);

  return (
    <Card padding="spacing.5">
      <CardBody>
        <Heading size="small">Your balance after investing</Heading>
        <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
          With every scheduled payment, the spends we predict, and fees you expect
        </Text>

        {/* Blade's area wrapper forces height: 100%, so the Box sets the size */}
        <Box height="260px" marginTop="spacing.4">
          <ChartAreaWrapper data={points}>
            <ChartCartesianGrid />
            <ChartXAxis dataKey="day" ticks={keyDays} interval={0} padding={{ left: 0, right: 16 }} />
            <ChartYAxis tickFormatter={(v: number) => formatLakh(v)} width={44} interval={0} />
            <ChartTooltip formatter={(v) => formatINR(Number(v))} />
            <ChartLegend />
            <ChartArea
              dataKey="idle"
              name="If you keep it idle"
              type="stepAfter"
              stackId="idle"
              color="data.background.categorical.gray.intense"
            />
            <ChartArea
              dataKey="invested"
              name={`If you invest ${formatLakh(invested)}`}
              type="stepAfter"
              stackId="invested"
              color="data.background.categorical.blue.strong"
            />
          </ChartAreaWrapper>
        </Box>

        <Box
          marginTop="spacing.4"
          padding="spacing.3"
          borderRadius="medium"
          backgroundColor="feedback.background.positive.subtle"
          display="flex"
          gap="spacing.2"
          alignItems="flex-start"
        >
          <CheckCircleIcon size="medium" color="feedback.icon.positive.intense" />
          <Text size="small" color="feedback.text.positive.intense">
            Every payment is covered. Lowest balance: {formatINR(lowest.invested)} on {lowest.day}.
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
}
