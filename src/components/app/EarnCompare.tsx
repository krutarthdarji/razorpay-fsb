import { motion } from 'framer-motion';
import {
  Box,
  ChartArea,
  ChartAreaWrapper,
  ChartCartesianGrid,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  Text,
  useTheme,
} from '@razorpay/blade/components';
import { compare, growthSeries, type Allocation } from '../../lib/funds';
import { formatApprox, formatINR } from '../../lib/format';
import { msToS, toBezier } from '../../lib/motion';

type Props = { amount: number; allocations: Allocation[]; months: number; days: number; showGraph?: boolean };

/**
 * Same money, two places: invested through Kosh, or idle in the current account,
 * where it earns nothing. A growth graph and two bars, in rupees.
 */
export function EarnCompare({ amount, allocations, months, days, showGraph = true }: Props) {
  const { theme } = useTheme();
  const c = compare(amount, allocations, days);
  const colors = {
    kosh: theme.colors.data.background.categorical.green.intense,
    idle: theme.colors.data.background.categorical.gray.intense,
  };
  const rows = [
    { key: 'kosh', label: 'Invested through Kosh', caption: 'Liquid and short-term debt funds', value: c.kosh, color: colors.kosh, best: true },
    { key: 'idle', label: 'Idle in your current account', caption: 'A current account pays 0% interest', value: c.idle, color: colors.idle, best: false },
  ];
  const max = Math.max(1, c.kosh);

  return (
    <Box>
      {showGraph && (
        // Blade's area wrapper forces height: 100%, so the Box sets the size
        <Box height="170px" marginBottom="spacing.4">
          <ChartAreaWrapper data={growthSeries(amount, allocations, months)}>
            <ChartCartesianGrid />
            <ChartXAxis dataKey="month" interval={months > 6 ? 2 : 1} padding={{ left: 8, right: 16 }} />
            <ChartYAxis width={52} tickFormatter={(v: number) => (v >= 1000 ? `₹${Math.round(v / 1000)}K` : `₹${v}`)} />
            <ChartTooltip formatter={(v) => formatINR(Number(v))} />
            <ChartArea dataKey="kosh" name="Through Kosh" type="linear" stackId="kosh" color="data.background.categorical.green.intense" />
            <ChartArea dataKey="idle" name="Idle" type="linear" stackId="idle" color="data.background.categorical.gray.intense" />
          </ChartAreaWrapper>
        </Box>
      )}

      <Box display="flex" flexDirection="column" gap="spacing.4">
        {rows.map((r, i) => (
          <Box key={r.key}>
            <Box display="flex" justifyContent="space-between" alignItems="baseline" gap="spacing.3">
              <Box display="flex" alignItems="center" gap="spacing.2">
                <div style={{ width: 10, height: 10, flexShrink: 0, borderRadius: theme.border.radius.round, backgroundColor: r.color }} />
                <Box>
                  <Text size="small" weight={r.best ? 'semibold' : 'regular'}>
                    {r.label}
                  </Text>
                </Box>
              </Box>
              <Text weight="semibold" color={r.best ? 'feedback.text.positive.intense' : undefined}>
                {r.value === 0 ? formatINR(0) : formatApprox(r.value)}
              </Text>
            </Box>
            <Box height="8px" borderRadius="max" backgroundColor="surface.background.gray.moderate" overflow="hidden" marginTop="spacing.2">
              <motion.div
                style={{ height: '100%', borderRadius: theme.border.radius.max, backgroundColor: r.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(r.value / max) * 100}%` }}
                transition={{ delay: i * msToS(theme.motion.delay.xquick), duration: msToS(theme.motion.duration.xgentle), ease: toBezier(theme.motion.easing.emphasized) }}
              />
            </Box>
            <Text size="xsmall" color="surface.text.gray.muted" marginTop="spacing.1">
              {r.caption}
            </Text>
          </Box>
        ))}
      </Box>

      <Box marginTop="spacing.4" padding="spacing.4" borderRadius="large" backgroundColor="feedback.background.positive.subtle">
        <Text weight="semibold" color="feedback.text.positive.intense">
          About {formatINR(c.kosh)} more than leaving it idle in your current account.
        </Text>
      </Box>
      <Text size="xsmall" color="surface.text.gray.muted" marginTop="spacing.2">
        Estimated at the funds' pace over the last 12 months. Actual returns will differ.
      </Text>
    </Box>
  );
}
