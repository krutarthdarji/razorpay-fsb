import { Badge, Box, CheckCircleIcon, Text } from '@razorpay/blade/components';
import type { InvestOption } from '../../data';

/** The fund Kosh picked, and why: safety and horizon first, not top returns */
export function FundCard({ option, days }: { option: InvestOption; days: number }) {
  return (
    <Box
      padding="spacing.5"
      borderRadius="xlarge"
      borderWidth="thin"
      borderColor="surface.border.primary.muted"
      backgroundColor="surface.background.primary.subtle"
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap="spacing.3">
        <Box>
          <Text size="xsmall" color="surface.text.gray.muted">
            {option.isRecommended ? 'Recommended fund' : 'Your pick'}
          </Text>
          <Text size="large" weight="semibold" marginTop="spacing.1">
            {option.name}
          </Text>
        </Box>
        <Text size="small" weight="semibold" color="surface.text.primary.normal">
          ~{option.annualRatePct}% a year
        </Text>
      </Box>
      <Box display="flex" flexWrap="wrap" gap="spacing.2" marginTop="spacing.4">
        <Badge color="positive" size="small">
          Low risk
        </Badge>
        <Badge color="neutral" size="small">
          Withdraw anytime
        </Badge>
        <Badge color="neutral" size="small">
          {`Fits ${days} days`}
        </Badge>
      </Box>
      {option.isRecommended && (
        <Box display="flex" gap="spacing.2" marginTop="spacing.4" alignItems="flex-start">
          <CheckCircleIcon size="small" color="surface.icon.primary.normal" />
          <Text size="small" color="surface.text.gray.muted">
            Picked for safety and your {days}-day horizon, not for top returns.
          </Text>
        </Box>
      )}
    </Box>
  );
}
