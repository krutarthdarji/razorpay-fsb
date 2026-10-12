import { AlertTriangleIcon, Box, Heading, HelpCircleIcon, InstantSettlementIcon, Text, ZapIcon, type IconComponent } from '@razorpay/blade/components';
import { Label, Section, SectionBody, SectionIntro } from './layout';

type Friction = { icon: IconComponent; name: string; says: string; why: string };

/** The four things that keep spare cash idle. The solution section answers them in the same order. */
export const frictions: Friction[] = [
  {
    icon: HelpCircleIcon,
    name: 'Knowledge',
    says: '"How much of this can I actually spare?"',
    why: 'The answer needs a forecast of every fee coming in and every salary, rent and tax payment going out. No owner has one.',
  },
  {
    icon: AlertTriangleIcon,
    name: 'Fear',
    says: '"What if salaries bounce?"',
    why: 'One missed payroll hurts more than a year of returns helps. So doing nothing feels like the responsible choice.',
  },
  {
    icon: ZapIcon,
    name: 'Effort',
    says: '"Another app, another KYC, more paperwork."',
    why: 'Investing happens somewhere else, away from the account where the business money lives.',
  },
  {
    icon: InstantSettlementIcon,
    name: 'Liquidity',
    says: '"What if I need it tomorrow?"',
    why: 'Money taken out of a fund reaches the bank the next working day. A business need does not wait a day.',
  },
];

export function FrictionSection() {
  return (
    <Section id="frictions" tone="gray">
      <SectionIntro
        step="04"
        label="What has stopped adoption"
        title="Four frictions keep spare cash "
        highlight="idle."
        sub="Good funds and sweep accounts already exist. Owners still don't use them, for these four reasons."
      />

      <SectionBody>
        <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(2, 1fr)' }} gap="spacing.5">
          {frictions.map(({ icon: Icon, name, says, why }, i) => (
            <Box key={name} padding="spacing.7" borderRadius="xlarge" backgroundColor="surface.background.gray.intense" elevation="lowRaised" display="flex" gap="spacing.5" alignItems="flex-start">
              <Box flexShrink={0} padding="spacing.4" borderRadius="medium" backgroundColor="feedback.background.negative.subtle" display="flex">
                <Icon size="large" color="feedback.icon.negative.intense" />
              </Box>
              <Box>
                <Label tone="negative">
                  Friction {i + 1}: {name}
                </Label>
                <Heading size="large" marginTop="spacing.2">
                  {says}
                </Heading>
                <Text size="large" color="surface.text.gray.subtle" marginTop="spacing.3">
                  {why}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
      </SectionBody>
    </Section>
  );
}
