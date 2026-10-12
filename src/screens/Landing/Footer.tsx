import { Box, Text } from '@razorpay/blade/components';
import { brand } from '../../brand';
import { Container } from './layout';

export function Footer() {
  return (
    <Box backgroundColor="surface.background.gray.intense" paddingY="spacing.9">
      <Container>
        <Box display="flex" flexDirection="column" gap="spacing.2" alignItems="center">
          <Text weight="semibold" textAlign="center">
            {brand.fullName} · Razorpay Buildathon, Track 1: Razorpay in Your Pocket
          </Text>
          <Text color="surface.text.gray.subtle" textAlign="center">
            Prototype built with Claude Code and Razorpay's Blade design system, via the Blade MCP.
          </Text>
          <Text size="small" color="surface.text.gray.muted" textAlign="center">
            All figures are illustrative. Returns are before tax and not guaranteed. Mutual fund investments are subject
            to market risks.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
