import {
  BarChartIcon,
  BellIcon,
  Box,
  CpuIcon,
  Heading,
  InstantSettlementIcon,
  LayersIcon,
  SmartphoneIcon,
  SparklesIcon,
  TargetIcon,
  Text,
  TrendingUpIcon,
  type IconComponent,
} from '@razorpay/blade/components';
import { brand } from '../../brand';
import { plan } from '../../data';
import { Label, Section, SectionBody, SectionIntro, Takeaway } from './layout';

type Point = { icon: IconComponent; title: string; body: string };

/** Real Razorpay products the recommendation stands on */
const alreadyHas: Point[] = [
  { icon: BarChartIcon, title: 'Both sides of the cash flow', body: 'Collections through Payment Gateway, Payment Links and Subscriptions. Salaries, vendor bills and taxes through RazorpayX.' },
  { icon: CpuIcon, title: 'Forecasting agents', body: 'Cashflow Insights shows past inflow and payouts. The Cashflow Forecaster agent already predicts 3 to 7 days ahead.' },
  { icon: InstantSettlementIcon, title: 'Rails and trust', body: 'Instant payouts, the MPIN owners already use, and an app they already open every day.' },
];

/** What this proposal adds on top */
const koshAdds: Point[] = [
  { icon: SparklesIcon, title: 'A 12-month view and one answer', body: 'A longer projection, turned into a single recommendation: how much, and for how long.' },
  { icon: TrendingUpIcon, title: 'One-tap investing', body: 'Liquid and short-term debt funds, offered through a mutual fund distribution partner.' },
  { icon: LayersIcon, title: 'Instant credit on withdrawal', body: `A ${plan.freeCreditDays}-day free credit from a lending partner, until the fund pays out.` },
];

const whyMobile: Point[] = [
  { icon: SmartphoneIcon, title: 'The owner decides', body: 'And the owner is on the phone, not on a desktop dashboard.' },
  { icon: BellIcon, title: 'The moment matters', body: 'Fees land, Kosh nudges, the owner acts. Right then.' },
  { icon: TargetIcon, title: 'One answer fits one screen', body: 'A single recommendation and one button. A dashboard would not fit, and is not needed.' },
];

function Column({ label, title, points }: { label: string; title: string; points: Point[] }) {
  return (
    <Box padding="spacing.7" borderRadius="xlarge" backgroundColor="surface.background.gray.intense" borderWidth="thin" borderColor="surface.border.gray.subtle">
      <Label>{label}</Label>
      <Heading size="large" marginTop="spacing.1">
        {title}
      </Heading>
      <Box display="flex" flexDirection="column" gap="spacing.6" marginTop="spacing.6">
        {points.map(({ icon: Icon, title: t, body }) => (
          <Box key={t} display="flex" gap="spacing.4" alignItems="flex-start">
            <Box flexShrink={0} padding="spacing.3" borderRadius="medium" backgroundColor="surface.background.primary.subtle" display="flex">
              <Icon size="medium" color="surface.icon.primary.normal" />
            </Box>
            <Box>
              <Text size="large" weight="semibold">
                {t}
              </Text>
              <Text color="surface.text.gray.subtle" marginTop="spacing.1">
                {body}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function WhySection() {
  return (
    <Section id="why">
      <SectionIntro
        step="07"
        label="How it's made possible"
        title="Only Razorpay can tell a merchant "
        highlight="what's safe."
        sub={`The recommendation needs both sides of a merchant's money: what comes in and what goes out. Razorpay already has both. ${brand.name} adds three things on top.`}
      />

      <SectionBody>
        <Box padding="spacing.6" borderRadius="xlarge" borderWidth="thin" borderColor="surface.border.primary.normal" backgroundColor="surface.background.gray.intense" marginBottom="spacing.5">
          <Label>Where {brand.name} sits</Label>
          <Text size="large" marginTop="spacing.2">
            {brand.name} would be one more agent in RazorpayX Agentic Banking, beside the Payout Agent and Cashflow Insights. It
            follows the same pattern as they do: the agent prepares, the owner approves.
          </Text>
        </Box>
        <Box display="grid" gridTemplateColumns={{ base: '1fr', l: 'repeat(3, 1fr)' }} gap="spacing.5">
          <Column label="Exists today" title="What Razorpay already has" points={alreadyHas} />
          <Column label="New in this proposal" title={`What ${brand.name} adds`} points={koshAdds} />
          <Column label="The surface" title="Why it belongs on the phone" points={whyMobile} />
        </Box>

        <Takeaway>
          <Label>Why nobody else can do this</Label>
          <Heading size="xlarge" marginTop="spacing.2">
            A fund app can sell a fund. A bank can sweep money into an FD. Neither can see a merchant's fees, payroll and
            vendor bills together.
          </Heading>
          <Text size="large" color="surface.text.gray.subtle" marginTop="spacing.3">
            So neither can say how much is safe to move. Razorpay can.
          </Text>
        </Takeaway>
      </SectionBody>
    </Section>
  );
}
