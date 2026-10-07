import {
  BarChartIcon,
  BellIcon,
  Box,
  CpuIcon,
  Heading,
  InstantSettlementIcon,
  SmartphoneIcon,
  Text,
  TargetIcon,
  type IconComponent,
} from '@razorpay/blade/components';
import { Section, SectionIntro } from './layout';

type Point = { icon: IconComponent; title: string; body: string };

const whyRazorpay: Point[] = [
  { icon: BarChartIcon, title: 'Data', body: 'Sees both sides of the cash flow: what comes in and what goes out.' },
  { icon: CpuIcon, title: 'Intelligence', body: 'Already runs forecasting agents for merchants.' },
  { icon: InstantSettlementIcon, title: 'Rails', body: 'Instant payouts and credit partners to make "withdraw now" real.' },
];

const whyMobile: Point[] = [
  { icon: SmartphoneIcon, title: 'The owner decides', body: 'And the owner lives on the phone, not on a desktop dashboard.' },
  { icon: BellIcon, title: 'The moment matters', body: 'Cash lands, Kosh nudges, the owner acts. Right then.' },
  { icon: TargetIcon, title: 'One answer, one tap', body: 'A single recommendation fits a phone screen. A dashboard does not.' },
];

function Column({ title, points, footer }: { title: string; points: Point[]; footer?: string }) {
  return (
    <Box padding="spacing.7" borderRadius="2xlarge" backgroundColor="surface.background.gray.intense" elevation="lowRaised" display="flex" flexDirection="column">
      <Heading size="large">{title}</Heading>
      <Box display="flex" flexDirection="column" gap="spacing.6" marginTop="spacing.6">
        {points.map(({ icon: Icon, title: t, body }) => (
          <Box key={t} display="flex" gap="spacing.4" alignItems="flex-start">
            <Box flexShrink={0} padding="spacing.3" borderRadius="medium" backgroundColor="surface.background.primary.subtle" display="flex">
              <Icon size="medium" color="surface.icon.primary.normal" />
            </Box>
            <Box>
              <Text weight="semibold">{t}</Text>
              <Text color="surface.text.gray.muted" marginTop="spacing.1">
                {body}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
      {footer && (
        <Box marginTop="spacing.7" padding="spacing.5" borderRadius="large" backgroundColor="surface.background.primary.subtle">
          <Text weight="semibold" color="surface.text.primary.normal">
            {footer}
          </Text>
        </Box>
      )}
    </Box>
  );
}

export function WhySection() {
  return (
    <Section id="why" tone="gray">
      <SectionIntro eyebrow="Why Razorpay, why mobile" before="Only Razorpay can tell a merchant " highlight="what's safe." />
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.6" marginTop={{ base: 'spacing.9', m: 'spacing.11' }}>
        <Column
          title="Why Razorpay"
          points={whyRazorpay}
          footer="Fund houses and fintechs can offer investing. They can't tell a merchant what's safe. Razorpay can."
        />
        <Column title="Why mobile" points={whyMobile} />
      </Box>
    </Section>
  );
}
