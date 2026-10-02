import styled from 'styled-components';
import {
  Amount,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  Box,
  CurrentAccountIcon,
  RazorpayXIcon,
  Text,
  type IconComponent,
} from '@razorpay/blade/components';

type Props = { accountName: string; balance: number; moneyIn: number; moneyOut: number; days: number };

const Gradient = styled.div(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing[6],
  borderRadius: theme.border.radius.xlarge,
  boxShadow: theme.elevation.midRaised,
  background: `linear-gradient(135deg, ${theme.colors.interactive.background.primary.default}, ${theme.colors.interactive.background.primary.highlighted})`,
}));

/** Large faint RazorpayX mark in the corner */
const Watermark = styled.div({
  position: 'absolute',
  right: -24,
  bottom: -24,
  opacity: 0.18,
  '& svg': { width: 120, height: 120 },
});

function FlowStat({ icon: Icon, label, value }: { icon: IconComponent; label: string; value: number }) {
  return (
    <Box flex={1}>
      <Box display="flex" alignItems="center" gap="spacing.1">
        <Icon size="small" color="surface.icon.staticWhite.muted" />
        <Text size="xsmall" color="surface.text.staticWhite.muted">
          {label}
        </Text>
      </Box>
      <Amount
        value={value}
        type="body"
        size="medium"
        weight="semibold"
        suffix="none"
        color="surface.text.staticWhite.normal"
        marginTop="spacing.1"
      />
    </Box>
  );
}

export function BalanceCard({ accountName, balance, moneyIn, moneyOut, days }: Props) {
  return (
    <Gradient>
      <Watermark aria-hidden>
        <RazorpayXIcon size="2xlarge" color="surface.icon.staticWhite.normal" />
      </Watermark>

      <Box display="flex" alignItems="center" gap="spacing.2">
        <CurrentAccountIcon size="small" color="surface.icon.staticWhite.subtle" />
        <Text size="small" color="surface.text.staticWhite.subtle">
          {accountName}
        </Text>
      </Box>
      <Box marginTop="spacing.3">
        <Amount
          value={balance}
          type="heading"
          size="2xlarge"
          weight="semibold"
          suffix="none"
          color="surface.text.staticWhite.normal"
        />
      </Box>
      <Text variant="caption" size="medium" color="surface.text.staticWhite.muted">
        Available balance
      </Text>

      <Box
        marginTop="spacing.5"
        paddingTop="spacing.4"
        display="flex"
        gap="spacing.5"
        borderTopWidth="thin"
        borderTopColor="surface.border.gray.muted"
      >
        <FlowStat icon={ArrowDownLeftIcon} label={`Coming in · ${days} days`} value={moneyIn} />
        <FlowStat icon={ArrowUpRightIcon} label={`Going out · ${days} days`} value={moneyOut} />
      </Box>
    </Gradient>
  );
}
