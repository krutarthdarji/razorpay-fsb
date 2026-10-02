import { Amount, Box, Card, CardBody, CurrentAccountIcon, Text } from '@razorpay/blade/components';

type Props = { accountName: string; balance: number };

export function BalanceCard({ accountName, balance }: Props) {
  return (
    <Card padding="spacing.5">
      <CardBody>
        <Box display="flex" alignItems="center" gap="spacing.2">
          <CurrentAccountIcon size="small" color="surface.icon.gray.muted" />
          <Text size="small" color="surface.text.gray.muted">
            {accountName}
          </Text>
        </Box>
        <Box marginTop="spacing.3">
          <Amount value={balance} type="heading" size="2xlarge" weight="semibold" suffix="none" />
        </Box>
        <Text variant="caption" size="medium" color="surface.text.gray.muted" marginTop="spacing.1">
          Available balance
        </Text>
      </CardBody>
    </Card>
  );
}
