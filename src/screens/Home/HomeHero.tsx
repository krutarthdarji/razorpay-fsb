import styled from 'styled-components';
import { Amount, Box, CheckCircleIcon, Text, useTheme } from '@razorpay/blade/components';
import { merchant } from '../../data';
import { useCountUp } from '../../lib/useCountUp';

const Band = styled.div(({ theme }) => ({
  padding: `${theme.spacing[4]}px ${theme.spacing[5]}px ${theme.spacing[5]}px`,
  background: [
    `radial-gradient(circle at 100% 0%, ${theme.colors.data.background.categorical.purple.intense}, transparent 55%)`,
    `linear-gradient(160deg, ${theme.colors.interactive.background.primary.default}, ${theme.colors.interactive.background.primary.highlighted})`,
  ].join(', '),
}));

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Who you are and what's in the account. Nothing else. */
export function HomeHero({ balance }: { balance: number }) {
  const { theme } = useTheme();
  const shown = useCountUp(balance, theme.motion.duration.xgentle);

  return (
    <Band>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Text size="small" color="surface.text.staticWhite.muted">
            {greeting()}, {merchant.ownerFirstName}
          </Text>
          <Box display="flex" alignItems="center" gap="spacing.2">
            <Text weight="semibold" color="surface.text.staticWhite.normal">
              {merchant.businessName}
            </Text>
            <CheckCircleIcon size="small" color="surface.icon.staticWhite.subtle" />
          </Box>
        </Box>
      </Box>
      <Text size="xsmall" color="surface.text.staticWhite.muted" marginTop="spacing.4">
        Balance in your {merchant.accountName}
      </Text>
      <Amount value={shown} type="display" size="small" weight="semibold" suffix="none" color="surface.text.staticWhite.normal" />
    </Band>
  );
}
