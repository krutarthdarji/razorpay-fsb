import { Box, BuildingIcon, GlobeIcon, Heading, Text, UserIcon, type IconComponent } from '@razorpay/blade/components';
import { Section, SectionIntro } from './layout';

const impact: { icon: IconComponent; who: string; body: string }[] = [
  { icon: UserIcon, who: 'Merchants', body: 'A new habit. Their money works as hard as they do.' },
  { icon: BuildingIcon, who: 'Razorpay', body: 'Moves from moving money to growing it. New revenue from mutual fund distribution, and more balances stay in RazorpayX.' },
  { icon: GlobeIcon, who: 'India', body: 'Business cash moves from idle deposits into productive markets.' },
];

export function ImpactSection() {
  return (
    <Section>
      <SectionIntro eyebrow="The bigger picture" before="Money that works " highlight="as hard as its owner." />
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3, 1fr)' }} gap="spacing.6" marginTop={{ base: 'spacing.9', m: 'spacing.11' }}>
        {impact.map(({ icon: Icon, who, body }) => (
          <Box key={who} padding="spacing.7" borderRadius="xlarge" borderWidth="thin" borderColor="surface.border.gray.subtle">
            <Box display="inline-flex" padding="spacing.4" borderRadius="medium" backgroundColor="surface.background.primary.subtle">
              <Icon size="large" color="surface.icon.primary.normal" />
            </Box>
            <Heading size="medium" marginTop="spacing.5">
              {who}
            </Heading>
            <Text color="surface.text.gray.muted" marginTop="spacing.2">
              {body}
            </Text>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
