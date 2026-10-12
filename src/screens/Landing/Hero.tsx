import { forwardRef } from 'react';
import styled from 'styled-components';
import { AlertTriangleIcon, ArrowRightIcon, Box, Button, CheckCircleIcon, Display, Text } from '@razorpay/blade/components';
import { brand } from '../../brand';
import { merchant } from '../../data';
import { formatMonths } from '../../lib/dates';
import { formatINR } from '../../lib/format';
import { cycle } from '../../lib/recommendation';
import { useIsDesktop } from '../../lib/useIsDesktop';
import { KoshAvatar } from '../../components/app/KoshAvatar';
import { AppPreview } from './AppPreview';
import { Container, Label } from './layout';

/** Soft blue wash like the razorpay.com/x hero */
const HeroBackground = styled.section(({ theme }) => ({
  overflow: 'hidden',
  paddingTop: theme.spacing[10],
  paddingBottom: theme.spacing[11],
  background: [
    `radial-gradient(ellipse 80% 60% at 50% 0%, ${theme.colors.surface.background.primary.subtle}, transparent)`,
    `linear-gradient(180deg, ${theme.colors.surface.background.cloud.subtle} 0%, ${theme.colors.surface.background.gray.intense} 100%)`,
  ].join(', '),
}));

type Props = { onDemo: () => void };

/**
 * The whole pitch on one screen: what Kosh is, the problem, our solution, and the
 * working prototype beside it.
 */
export const Hero = forwardRef<HTMLDivElement, Props>(function Hero({ onDemo }, ctaRef) {
  const isDesktop = useIsDesktop();
  const r = cycle;

  return (
    <HeroBackground>
      <Container>
        <Box display="grid" gridTemplateColumns={{ base: 'minmax(0, 1fr)', l: 'minmax(0, 1.25fr) minmax(0, 0.75fr)' }} gap={{ base: 'spacing.9', l: 'spacing.10' }} alignItems="center">
          <Box>
            <Box display="flex" alignItems="center" gap="spacing.3">
              <KoshAvatar size="medium" />
              <Text size="large" weight="semibold">
                {brand.fullName}
              </Text>
            </Box>

            <Display as="h1" size="large" weight="semibold" marginTop="spacing.5">
              Idle business cash earns ₹0.{' '}
              <Display as="span" size="large" weight="semibold" color="surface.text.primary.normal">
                {brand.name} puts the spare part to work.
              </Display>
            </Display>
            <Text size="large" color="surface.text.gray.subtle" marginTop="spacing.5">
              {brand.name} is a proposed treasury agent for the RazorpayX app. It tells a business owner how much of the account
              balance is safe to invest and for how long, then invests it in one tap. The money stays 100% liquid.
            </Text>

            <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.5" marginTop="spacing.7">
              <Box padding="spacing.6" borderRadius="xlarge" backgroundColor="feedback.background.negative.subtle">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <AlertTriangleIcon size="medium" color="feedback.icon.negative.intense" />
                  <Label tone="negative">The problem</Label>
                </Box>
                <Text size="large" marginTop="spacing.3">
                  A current account pays 0% interest. {merchant.ownerFirstName}'s coaching centre has{' '}
                  <Text as="span" size="large" weight="semibold">
                    {formatINR(r.startBalance)}
                  </Text>{' '}
                  in it. Part of that is spare for months. He can't tell how much, so he invests none of it.
                </Text>
              </Box>
              <Box padding="spacing.6" borderRadius="xlarge" backgroundColor="feedback.background.positive.subtle">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <CheckCircleIcon size="medium" color="feedback.icon.positive.intense" />
                  <Label tone="positive">Our solution</Label>
                </Box>
                <Text size="large" marginTop="spacing.3">
                  {brand.name} reads his collections and payments on Razorpay and tells him:{' '}
                  <Text as="span" size="large" weight="semibold">
                    {formatINR(r.amount)} is safe to invest for {formatMonths(r.months)}.
                  </Text>{' '}
                  One tap invests it in liquid funds. He can withdraw any time, credited instantly.
                </Text>
              </Box>
            </Box>

            <Box ref={ctaRef} display="flex" flexDirection={{ base: 'column', s: 'row' }} alignItems={{ base: 'flex-start', s: 'center' }} gap="spacing.4" marginTop="spacing.7">
              <Button size="large" icon={ArrowRightIcon} iconPosition="right" onClick={onDemo}>
                App Demo
              </Button>
              <Text color="surface.text.gray.subtle">A working prototype. Invest {merchant.ownerFirstName}'s surplus in under 2 minutes.</Text>
            </Box>
          </Box>

          <Box>
            <AppPreview screenHeight={isDesktop ? 640 : 560} />
            <Box marginTop="spacing.5" textAlign="center">
              <Label>Live from the prototype</Label>
              <Text color="surface.text.gray.subtle" marginTop="spacing.1">
                {merchant.ownerFirstName}'s Home screen. {brand.name} has read his cash flow and shows what is safe to invest.
              </Text>
            </Box>
          </Box>
        </Box>
      </Container>
    </HeroBackground>
  );
});
