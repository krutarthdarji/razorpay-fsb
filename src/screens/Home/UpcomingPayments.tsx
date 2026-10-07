import { Amount, Badge, Box, Card, CardBody, CheckIcon, Heading, Text } from '@razorpay/blade/components';
import type { Outflow } from '../../data';

type Row = { key: string; label: string; date: string; amount: number };

/** Every scheduled payment, each one marked covered: the answer to "what if payroll bounces?" */
export function UpcomingPayments({ outflows }: { outflows: Outflow[] }) {
  const rows: Row[] = outflows
    .flatMap((o) => o.payments.map((p, i) => ({ key: `${o.id}-${i}`, label: o.label, date: p.date, amount: p.amount })))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Card padding="spacing.5" elevation="lowRaised">
      <CardBody>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="small">Upcoming payments</Heading>
          <Badge color="positive" size="small" icon={CheckIcon}>
            All covered
          </Badge>
        </Box>
        <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
          Kept aside before anything is invested
        </Text>

        <Box display="flex" flexDirection="column" gap="spacing.4" marginTop="spacing.5">
          {rows.map((r) => {
            const d = new Date(`${r.date}T00:00:00Z`);
            return (
              <Box key={r.key} display="flex" alignItems="center" gap="spacing.4">
                <Box
                  width="44px"
                  paddingY="spacing.2"
                  borderRadius="medium"
                  backgroundColor="surface.background.gray.moderate"
                  textAlign="center"
                  flexShrink={0}
                >
                  <Text size="medium" weight="semibold">
                    {d.getUTCDate()}
                  </Text>
                  <Text size="xsmall" color="surface.text.gray.muted">
                    {d.toLocaleDateString('en-IN', { month: 'short', timeZone: 'UTC' })}
                  </Text>
                </Box>
                <Box flex={1}>
                  <Text weight="semibold">{r.label}</Text>
                  <Box display="flex" alignItems="center" gap="spacing.1">
                    <CheckIcon size="xsmall" color="feedback.icon.positive.intense" />
                    <Text size="xsmall" color="feedback.text.positive.intense">
                      Covered
                    </Text>
                  </Box>
                </Box>
                <Amount value={r.amount} size="medium" weight="semibold" suffix="none" />
              </Box>
            );
          })}
        </Box>
      </CardBody>
    </Card>
  );
}
