import styled from 'styled-components';
import { Box, Display, Text } from '@razorpay/blade/components';
import { Container } from './layout';

const Band = styled.section(({ theme }) => ({
  paddingTop: theme.spacing[11] * 1.5,
  paddingBottom: theme.spacing[11] * 1.5,
  background: [
    `radial-gradient(circle at 85% 20%, ${theme.colors.data.background.categorical.purple.intense}, transparent 45%)`,
    `linear-gradient(160deg, ${theme.colors.interactive.background.primary.default}, ${theme.colors.interactive.background.primary.highlighted})`,
  ].join(', '),
}));

/** The one-line insight the whole product rests on */
export function InsightBand() {
  return (
    <Band>
      <Container>
        <Box maxWidth="900px" marginX="auto" textAlign="center">
          <Text size="small" weight="semibold" color="surface.text.staticWhite.muted">
            THE INSIGHT
          </Text>
          <Display as="h2" size="medium" weight="regular" color="surface.text.staticWhite.normal" textAlign="center" marginTop="spacing.5">
            Merchants don't under-invest because they don't want returns.
          </Display>
          <Box marginTop="spacing.3">
            <Display as="span" size="medium" weight="semibold" color="surface.text.staticWhite.normal" textAlign="center">
              They under-invest because they can't see what's safe.
            </Display>
          </Box>
        </Box>
      </Container>
    </Band>
  );
}
