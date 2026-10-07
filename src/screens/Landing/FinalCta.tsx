import { forwardRef } from 'react';
import styled from 'styled-components';
import { ArrowRightIcon, Box, Button, Display, Text } from '@razorpay/blade/components';
import { merchant } from '../../data';
import { formatINR } from '../../lib/format';
import { Container } from './layout';
import { brand } from '../../brand';

const Band = styled.section(({ theme }) => ({
  paddingTop: theme.spacing[11] * 1.5,
  paddingBottom: theme.spacing[11] * 1.5,
  background: [
    `radial-gradient(ellipse 60% 80% at 50% 100%, ${theme.colors.interactive.background.primary.highlighted}, transparent)`,
    theme.colors.surface.background.primary.intense,
  ].join(', '),
}));

export const FinalCta = forwardRef<HTMLDivElement, { onDemo: () => void }>(function FinalCta({ onDemo }, ref) {
  return (
    <Band>
      <Container>
        <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.6" textAlign="center">
          <Display as="h2" size="medium" weight="regular" color="surface.text.staticWhite.normal" textAlign="center">
            See {brand.name} work on Ravi's account
          </Display>
          <Box maxWidth="560px">
            <Text size="large" color="surface.text.staticWhite.subtle" textAlign="center">
              {merchant.businessName} has {formatINR(merchant.balance)} after admissions. Watch {brand.name} find what's
              safe, and invest it in under 2 minutes.
            </Text>
          </Box>
          <Box ref={ref}>
            <Button size="large" color="white" icon={ArrowRightIcon} iconPosition="right" onClick={onDemo}>
              App Demo
            </Button>
          </Box>
        </Box>
      </Container>
    </Band>
  );
});
