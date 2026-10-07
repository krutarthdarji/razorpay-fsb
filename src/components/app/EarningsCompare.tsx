import { motion } from 'framer-motion';
import { Amount, Box, Text, useTheme } from '@razorpay/blade/components';
import { msToS, toBezier } from '../../lib/motion';

export type EarningRow = { label: string; value: number; isBest?: boolean };

/** Same money, three outcomes, in rupees. Bars grow in on mount. */
export function EarningsCompare({ rows }: { rows: EarningRow[] }) {
  const { theme } = useTheme();
  const max = Math.max(1, ...rows.map((r) => r.value));

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {rows.map((r, i) => (
        <Box key={r.label}>
          <Box display="flex" justifyContent="space-between" alignItems="baseline" marginBottom="spacing.2">
            <Text size="small" weight={r.isBest ? 'semibold' : 'regular'} color={r.isBest ? 'surface.text.gray.normal' : 'surface.text.gray.muted'}>
              {r.label}
            </Text>
            <Amount
              value={r.value}
              type="body"
              size="medium"
              weight="semibold"
              suffix="none"
              color={r.isBest ? 'feedback.text.positive.intense' : undefined}
            />
          </Box>
          <Box height="8px" borderRadius="max" backgroundColor="surface.background.gray.moderate" overflow="hidden">
            <motion.div
              style={{
                height: '100%',
                borderRadius: theme.border.radius.max,
                backgroundColor: r.isBest
                  ? theme.colors.data.background.categorical.green.intense
                  : theme.colors.data.background.categorical.gray.intense,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(r.value / max) * 100}%` }}
              transition={{
                delay: i * msToS(theme.motion.delay.xquick),
                duration: msToS(theme.motion.duration.xgentle),
                ease: toBezier(theme.motion.easing.emphasized),
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
