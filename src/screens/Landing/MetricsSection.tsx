import styled from 'styled-components';
import { Box, Display, Heading, RefreshIcon, ShieldIcon, Text, TrendingUpIcon, type IconComponent } from '@razorpay/blade/components';
import { Label, Section, SectionBody, SectionIntro } from './layout';

const NorthStar = styled.div(({ theme }) => ({
  padding: theme.spacing[8],
  borderRadius: theme.border.radius.xlarge,
  boxShadow: theme.elevation.midRaised,
  background: [
    `radial-gradient(circle at 90% 10%, ${theme.colors.data.background.categorical.purple.intense}, transparent 50%)`,
    `linear-gradient(160deg, ${theme.colors.interactive.background.primary.default}, ${theme.colors.interactive.background.primary.highlighted})`,
  ].join(', '),
}));

const metrics: { icon: IconComponent; label: string; title: string; body: string; guard?: boolean }[] = [
  { icon: TrendingUpIcon, label: 'Merchant value', title: 'Extra rupees earned', body: 'Per merchant, compared with leaving the same money idle in the current account.' },
  { icon: RefreshIcon, label: 'Habit', title: 'One-tap acceptance and repeat use', body: "How often Kosh's recommendation is accepted as it is, and how many merchants invest again within 60 days." },
  { icon: ShieldIcon, label: 'Guardrail', title: 'Zero missed payments', body: 'No salary, rent or tax payment ever fails because money was invested.', guard: true },
];

export function MetricsSection() {
  return (
    <Section id="metrics">
      <SectionIntro
        step="09"
        label="How we'd measure it"
        title="One number tells us "
        highlight="it works."
        sub="The goal is a change in behaviour: spare cash that used to sit now gets invested. So that is what we count."
      />

      <SectionBody>
        <NorthStar>
          <Text size="large" weight="semibold" color="surface.text.staticWhite.normal">
            North star metric
          </Text>
          <Display as="h3" size="medium" weight="semibold" color="surface.text.staticWhite.normal" marginTop="spacing.3">
            Share of idle surplus put to work
          </Display>
          <Text size="large" color="surface.text.staticWhite.subtle" marginTop="spacing.3">
            Of all the spare cash Kosh finds across merchants, how much actually gets invested.
          </Text>
        </NorthStar>

        <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3, 1fr)' }} gap="spacing.5" marginTop="spacing.5">
          {metrics.map(({ icon: Icon, label, title, body, guard }) => (
            <Box key={label} padding="spacing.7" borderRadius="xlarge" backgroundColor="surface.background.gray.intense" borderWidth="thin" borderColor={guard ? 'surface.border.gray.normal' : 'surface.border.gray.subtle'}>
              <Box display="flex" alignItems="center" gap="spacing.2">
                <Icon size="large" color={guard ? 'feedback.icon.notice.intense' : 'surface.icon.primary.normal'} />
                <Label tone={guard ? 'notice' : 'primary'}>{label}</Label>
              </Box>
              <Heading size="large" marginTop="spacing.4">
                {title}
              </Heading>
              <Text size="large" color="surface.text.gray.subtle" marginTop="spacing.2">
                {body}
              </Text>
            </Box>
          ))}
        </Box>
      </SectionBody>
    </Section>
  );
}
