import { Box, Card, CardBody, Heading, InstantSettlementIcon, Text } from '@razorpay/blade/components';
import { plan } from '../../data';

const steps = [
  { title: 'You tap Withdraw', body: 'Any amount, any time.' },
  { title: 'Razorpay credits you instantly', body: `A ${plan.freeCreditDays}-day credit, at no cost to you.` },
  { title: 'The fund pays Razorpay', body: 'Next working day. Nothing for you to do.' },
];

/** The liquidity promise: invested money is always within reach, because Razorpay fronts it */
export function LiquidityCard() {
  return (
    <Card padding="spacing.5" elevation="lowRaised">
      <CardBody>
        <Box display="flex" alignItems="center" gap="spacing.3">
          <Box padding="spacing.3" borderRadius="medium" backgroundColor="surface.background.primary.subtle" display="flex">
            <InstantSettlementIcon size="large" color="surface.icon.primary.normal" />
          </Box>
          <Box>
            <Heading size="small">Your liquidity stays 100% intact</Heading>
            <Text size="small" color="surface.text.gray.muted">
              Invested, but never out of reach
            </Text>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" marginTop="spacing.5">
          {steps.map((s, i) => (
            <Box key={s.title} display="flex" gap="spacing.4">
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box width="28px" height="28px" flexShrink={0} borderRadius="round" backgroundColor="surface.background.primary.subtle" display="flex" alignItems="center" justifyContent="center">
                  <Text size="small" weight="semibold" color="surface.text.primary.normal">
                    {i + 1}
                  </Text>
                </Box>
                {i < steps.length - 1 && <Box flex={1} width="2px" backgroundColor="surface.background.primary.subtle" />}
              </Box>
              <Box paddingBottom={i < steps.length - 1 ? 'spacing.5' : 'spacing.0'}>
                <Text weight="semibold">{s.title}</Text>
                <Text size="small" color="surface.text.gray.muted">
                  {s.body}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>

        <Box marginTop="spacing.5" padding="spacing.4" borderRadius="large" backgroundColor="surface.background.primary.subtle">
          <Text weight="semibold" color="surface.text.primary.normal">
            Razorpay gives you {plan.freeCreditDays} day of free credit until your mutual fund money arrives. You never wait.
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
}
