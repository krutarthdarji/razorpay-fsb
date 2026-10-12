import { Box, BuildingIcon, GlobeIcon, Heading, Text, UserIcon, type IconComponent } from '@razorpay/blade/components';
import { Section, SectionBody, SectionIntro } from './layout';

const impact: { icon: IconComponent; who: string; body: string }[] = [
  { icon: UserIcon, who: 'For merchants', body: 'A new habit. Spare cash earns instead of sitting, and no payment is ever put at risk.' },
  { icon: BuildingIcon, who: 'For Razorpay', body: 'Razorpay moves from moving money to growing it. New revenue from fund distribution, and more balances stay in RazorpayX.' },
  { icon: GlobeIcon, who: 'For India', body: 'Business cash moves out of idle deposits and into productive markets.' },
];

export function ImpactSection() {
  return (
    <Section tone="gray">
      <SectionIntro step="10" label="The bigger picture" title="Money that works " highlight="as hard as its owner." sub="What changes if this works, for each side." />
      <SectionBody>
        <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3, 1fr)' }} gap="spacing.5">
          {impact.map(({ icon: Icon, who, body }) => (
            <Box key={who} padding="spacing.7" borderRadius="xlarge" backgroundColor="surface.background.gray.intense" borderWidth="thin" borderColor="surface.border.gray.subtle">
              <Box display="inline-flex" padding="spacing.4" borderRadius="medium" backgroundColor="surface.background.primary.subtle">
                <Icon size="large" color="surface.icon.primary.normal" />
              </Box>
              <Heading size="large" marginTop="spacing.5">
                {who}
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
