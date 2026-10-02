import { Amount, Box, Text, useTheme } from '@razorpay/blade/components';

type Props = { scheduled: number; predicted: number; recommended: number };

/** One bar showing where today's balance goes: scheduled, predicted, recommended to invest */
export function BalanceSplitBar({ scheduled, predicted, recommended }: Props) {
  const { theme } = useTheme();
  const total = scheduled + predicted + recommended;
  const parts = [
    { label: 'Scheduled payments', value: scheduled, color: theme.colors.data.background.categorical.gray.intense },
    { label: 'Spends we predict', value: predicted, color: theme.colors.data.background.categorical.purple.moderate },
    { label: 'Recommended to invest', value: recommended, color: theme.colors.data.background.categorical.green.intense },
  ];

  return (
    <Box>
      <Box display="flex" height="16px" borderRadius="max" overflow="hidden" gap="spacing.1">
        {parts.map((p) => (
          <div key={p.label} style={{ width: `${(p.value / total) * 100}%`, backgroundColor: p.color }} />
        ))}
      </Box>
      <Box display="flex" flexWrap="wrap" columnGap="spacing.6" rowGap="spacing.3" marginTop="spacing.4">
        {parts.map((p) => (
          <Box key={p.label} display="flex" alignItems="center" gap="spacing.2">
            <div style={{ width: 10, height: 10, borderRadius: theme.border.radius.round, backgroundColor: p.color }} />
            <Text size="small" color="surface.text.gray.muted">
              {p.label}
            </Text>
            <Amount value={p.value} size="small" weight="semibold" suffix="none" />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
