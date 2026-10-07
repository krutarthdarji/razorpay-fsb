import styled from 'styled-components';
import { Box, Display, Heading, RefreshIcon, ShieldIcon, Text, TrendingUpIcon, type IconComponent } from '@razorpay/blade/components';
import { Section, SectionIntro } from './layout';

const NorthStar = styled.div(({ theme }) => ({
  padding: theme.spacing[9],
  borderRadius: theme.border.radius['2xlarge'],
  boxShadow: theme.elevation.midRaised,
  background: [
    `radial-gradient(circle at 90% 10%, ${theme.colors.data.background.categorical.purple.intense}, transparent 50%)`,
    `linear-gradient(160deg, ${theme.colors.interactive.background.primary.default}, ${theme.colors.interactive.background.primary.highlighted})`,
  ].join(', '),
}));

const metrics: { icon: IconComponent; label: string; title: string; body: string; guard?: boolean }[] = [
  { icon: TrendingUpIcon, label: 'Merchant value', title: 'Extra ₹ earned', body: 'Compared with leaving it idle and with a sweep FD.' },
  { icon: RefreshIcon, label: 'Habit', title: 'One-tap acceptance', body: 'And repeat investing within 60 days.' },
  { icon: ShieldIcon, label: 'Guardrail', title: 'Zero missed payments', body: 'Because of investing. Ever.', guard: true },
];

export function MetricsSection() {
  return (
    <Section id="metrics" tone="gray">
      <SectionIntro eyebrow="How we'd measure it" before="One number tells us " highlight="it works." />

      <Box marginTop={{ base: 'spacing.9', m: 'spacing.11' }}>
        <NorthStar>
          <Text size="small" weight="semibold" color="surface.text.staticWhite.muted">
            NORTH STAR
          </Text>
          <Display as="h3" size="medium" weight="semibold" color="surface.text.staticWhite.normal" marginTop="spacing.3">
            Share of idle surplus put to work
          </Display>
          <Text size="large" color="surface.text.staticWhite.subtle" marginTop="spacing.3">
            It measures the behaviour change directly.
          </Text>
        </NorthStar>

        <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3, 1fr)' }} gap="spacing.6" marginTop="spacing.6">
          {metrics.map(({ icon: Icon, label, title, body, guard }) => (
            <Box key={label} padding="spacing.7" borderRadius="xlarge" backgroundColor="surface.background.gray.intense" borderWidth="thin" borderColor={guard ? 'surface.border.gray.normal' : 'surface.border.gray.subtle'}>
              <Box display="flex" alignItems="center" gap="spacing.2">
                <Icon size="medium" color={guard ? 'feedback.icon.notice.intense' : 'surface.icon.primary.normal'} />
                <Text size="small" weight="semibold" color={guard ? 'feedback.text.notice.intense' : 'surface.text.primary.normal'}>
                  {label.toUpperCase()}
                </Text>
              </Box>
              <Heading size="large" marginTop="spacing.4">
                {title}
              </Heading>
              <Text color="surface.text.gray.muted" marginTop="spacing.2">
                {body}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Section>
  );
}
