import { Box, Text } from '@razorpay/blade/components';
import { Container } from './layout';

export function Footer() {
  return (
    <Box backgroundColor="surface.background.gray.intense" paddingY="spacing.9">
      <Container>
        <Text size="small" color="surface.text.gray.muted" textAlign="center">
          A prototype for the Razorpay Buildathon, "Razorpay in Your Pocket" track. All figures are illustrative
          and before tax. Mutual fund investments are subject to market risks.
        </Text>
      </Container>
    </Box>
  );
}
