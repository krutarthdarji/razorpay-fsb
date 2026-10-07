import { Amount, Box, Text, useTheme } from '@razorpay/blade/components';

type Props = { due: number; buffer: number; safe: number };

/** One bar showing where today's balance goes: payments due, safety buffer, safe to invest */
export function BalanceSplitBar({ due, buffer, safe }: Props) {
  const { theme } = useTheme();
  const total = due + buffer + safe;
  const parts = [
    { label: 'Payments due', value: due, color: theme.colors.data.background.categorical.gray.intense },
    { label: 'Safety buffer', value: buffer, color: theme.colors.data.background.categorical.purple.moderate },
    { label: 'Safe to invest', value: safe, color: theme.colors.data.background.categorical.green.intense },
  ];

  return (
    <Box>
      <Box display="flex" height="14px" borderRadius="max" overflow="hidden" gap="spacing.1">
        {parts.map((p) => (
          <div key={p.label} style={{ width: `${(p.value / total) * 100}%`, backgroundColor: p.color }} />
        ))}
      </Box>
      <Box display="flex" flexDirection="column" gap="spacing.2" marginTop="spacing.4">
        {parts.map((p) => (
          <Box key={p.label} display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <div style={{ width: 10, height: 10, borderRadius: theme.border.radius.round, backgroundColor: p.color }} />
              <Text size="small" color="surface.text.gray.muted">
                {p.label}
              </Text>
            </Box>
            <Amount value={p.value} size="small" weight="semibold" suffix="none" />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
