import {
  BellIcon,
  Box,
  ClockIcon,
  Heading,
  InstantSettlementIcon,
  LockIcon,
  Text,
  type IconComponent,
} from '@razorpay/blade/components';
import { Section, SectionIntro } from './layout';

const points: { icon: IconComponent; title: string; body: string }[] = [
  {
    icon: BellIcon,
    title: 'Nudged when cash sits idle',
    body: 'A card on your RazorpayX home the day surplus shows up. No dashboard to check.',
  },
  {
    icon: ClockIcon,
    title: 'Done in under 2 minutes',
    body: 'See the amount, pick the fund, confirm. Between two classes.',
  },
  {
    icon: LockIcon,
    title: 'Same MPIN as your payouts',
    body: 'Nothing moves without you. No auto-invest, ever.',
  },
  {
    icon: InstantSettlementIcon,
    title: 'Instant Redeem',
    body: 'Money back in your account in seconds, from the same app.',
  },
];

/** Why the phone is the right place for this */
export function PocketSection() {
  return (
    <Section tone="gray">
      <SectionIntro eyebrow="Why on your phone" before="Built for the " highlight="phone in your pocket." />
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', s: 'repeat(2, 1fr)', l: 'repeat(4, 1fr)' }}
        gap="spacing.6"
        marginTop={{ base: 'spacing.9', m: 'spacing.11' }}
      >
        {points.map(({ icon: Icon, title, body }) => (
          <Box key={title} padding="spacing.7" borderRadius="large" backgroundColor="surface.background.gray.intense">
            <Box display="inline-flex" padding="spacing.4" borderRadius="medium" backgroundColor="surface.background.primary.subtle">
              <Icon size="large" color="surface.icon.primary.normal" />
            </Box>
            <Heading size="small" marginTop="spacing.5">
              {title}
            </Heading>
            <Text color="surface.text.gray.muted" marginTop="spacing.3">
              {body}
            </Text>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
