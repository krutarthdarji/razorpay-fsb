import styled from 'styled-components';
import { Amount, Box, CheckCircleIcon, ClockIcon, Text, TrendingUpIcon, useTheme } from '@razorpay/blade/components';
import { merchant } from '../../data';
import { useCountUp } from '../../lib/useCountUp';
import { formatINR } from '../../lib/format';

const Band = styled.div(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  padding: `${theme.spacing[6]}px ${theme.spacing[5]}px ${theme.spacing[11] + theme.spacing[5]}px`,
  background: [
    `radial-gradient(circle at 100% 0%, ${theme.colors.data.background.categorical.purple.intense}, transparent 55%)`,
    `linear-gradient(160deg, ${theme.colors.interactive.background.primary.default}, ${theme.colors.interactive.background.primary.highlighted})`,
  ].join(', '),
}));

/** Outlined white chip on the blue band */
const Chip = styled.div(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  marginTop: theme.spacing[4],
  padding: `${theme.spacing[2]}px ${theme.spacing[4]}px`,
  borderRadius: theme.border.radius.max,
  border: `${theme.border.width.thin}px solid ${theme.colors.surface.text.staticWhite.muted}`,
}));

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

type Props = { balance: number; idle: number; idleDays: number; invested: number; fundName?: string };

/** Balance-first hero, like the RazorpayX app. The chip states the problem, or the result. */
export function HomeHero({ balance, idle, idleDays, invested, fundName }: Props) {
  const { theme } = useTheme();
  const shown = useCountUp(balance, theme.motion.duration.xgentle);

  return (
    <Band>
      <Text color="surface.text.staticWhite.muted">
        {greeting()}, {merchant.ownerFirstName}
      </Text>
      <Box display="flex" alignItems="center" gap="spacing.2" marginTop="spacing.1">
        <Text size="large" weight="semibold" color="surface.text.staticWhite.normal">
          {merchant.businessName}
        </Text>
        <CheckCircleIcon size="small" color="surface.icon.staticWhite.subtle" />
      </Box>

      <Text size="xsmall" color="surface.text.staticWhite.muted" marginTop="spacing.6">
        {merchant.accountName}
      </Text>
      <Amount
        value={shown}
        type="display"
        size="small"
        weight="semibold"
        suffix="none"
        color="surface.text.staticWhite.normal"
      />

      <Box>
      <Chip>
        {invested > 0 ? (
          <>
            <TrendingUpIcon size="small" color="surface.icon.staticWhite.normal" />
            <Text size="small" color="surface.text.staticWhite.normal">
              {formatINR(invested)} earning in {fundName}
            </Text>
          </>
        ) : (
          <>
            <ClockIcon size="small" color="surface.icon.staticWhite.normal" />
            <Text size="small" color="surface.text.staticWhite.normal">
              {formatINR(idle)} idle for {idleDays} days
            </Text>
          </>
        )}
      </Chip>
      </Box>
    </Band>
  );
}
