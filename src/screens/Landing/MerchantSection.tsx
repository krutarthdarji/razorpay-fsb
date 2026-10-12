import {
  ActivityIcon,
  Amount,
  Avatar,
  BookIcon,
  Box,
  CheckIcon,
  CloseIcon,
  Heading,
  MapPinIcon,
  Text,
  type IconComponent,
} from '@razorpay/blade/components';
import { merchant, plan } from '../../data';
import { formatDay, formatMonths } from '../../lib/dates';
import { formatINR } from '../../lib/format';
import { couldEarn, koshSplit, yearlyPace } from '../../lib/funds';
import { cycle } from '../../lib/recommendation';
import { Sparkline } from '../../components/app/Sparkline';
import { Label, Section, SectionBody, SectionIntro } from './layout';

type Segment = { icon: IconComponent; name: string; who: string; rows: { label: string; text: string }[] };

/** Three kinds of business with the same cash pattern: paid in advance, costs month by month */
const segments: Segment[] = [
  {
    icon: BookIcon,
    name: 'Fee-based education',
    who: 'Coaching centres, preschools, tuition and skill institutes',
    rows: [
      { label: 'Money comes in', text: 'Term or yearly fees, in 2 to 4 short windows a year.' },
      { label: 'Money goes out', text: 'Teacher salaries and rent, on fixed dates every month.' },
      { label: 'So cash sits idle', text: "A term's fees land at once and drain slowly over 3 to 6 months." },
      { label: 'Why the phone', text: 'The owner also teaches. Fee links go out on WhatsApp and payouts are approved between classes.' },
      { label: 'On Razorpay today', text: 'Fees through Payment Links, Pages and Subscriptions. Salaries through RazorpayX Payroll.' },
    ],
  },
  {
    icon: ActivityIcon,
    name: 'Membership businesses',
    who: 'Gyms, fitness and yoga studios, sports academies',
    rows: [
      { label: 'Money comes in', text: 'Memberships for 3, 6 or 12 months, paid in full on day one.' },
      { label: 'Money goes out', text: 'Rent, trainers and electricity, on fixed dates every month.' },
      { label: 'So cash sits idle', text: 'A busy sign-up month pays for the next 3 to 12 months of costs.' },
      { label: 'Why the phone', text: 'The owner is on the floor all day, not at a desk. There is no finance team.' },
      { label: 'On Razorpay today', text: 'Memberships through Payment Links and Subscriptions. Trainer payouts through RazorpayX.' },
    ],
  },
  {
    icon: MapPinIcon,
    name: 'Advance-booking businesses',
    who: 'Tour operators, travel agencies, wedding and event planners',
    rows: [
      { label: 'Money comes in', text: 'Customers pay a large advance at booking, weeks or months before the date.' },
      { label: 'Money goes out', text: 'Hotels, transport and vendors are paid close to the date. Every due date is known.' },
      { label: 'So cash sits idle', text: 'Advances wait in the account until each trip or event comes up.' },
      { label: 'Why the phone', text: 'The owner is travelling or on site. The phone is the office.' },
      { label: 'On Razorpay today', text: 'Advances through Payment Links and the Payment Gateway. Vendor payouts through RazorpayX.' },
    ],
  },
];

/** The eligibility rule. Every line can be checked from data Razorpay already has. */
const qualifies = [
  { rule: 'Paid in advance', detail: 'Most of the year\'s collections arrive in a few peak weeks: fees, memberships or booking advances.' },
  { rule: 'Costs are fixed and dated', detail: 'Salaries, rent and vendor dues repeat on known days, so the months ahead can be projected.' },
  { rule: 'A real surplus', detail: `The balance stays ${formatINR(plan.eligibility.minSurplus)} or more above upcoming payments for ${plan.eligibility.minDays} days or longer.` },
  { rule: 'No working-capital loan', detail: 'No overdraft or cash credit. If the business borrows, repaying the loan beats investing.' },
  { rule: 'Owner-run, on the phone', detail: 'The owner approves payouts on the RazorpayX app. Collections and payouts both run on Razorpay, so Kosh sees both sides.' },
];

function SegmentCard({ icon: Icon, name, who, rows }: Segment) {
  return (
    <Box padding="spacing.7" borderRadius="xlarge" backgroundColor="surface.background.gray.intense" elevation="lowRaised">
      <Box display="inline-flex" padding="spacing.4" borderRadius="medium" backgroundColor="surface.background.primary.subtle">
        <Icon size="large" color="surface.icon.primary.normal" />
      </Box>
      <Heading size="large" marginTop="spacing.5">
        {name}
      </Heading>
      <Text color="surface.text.gray.subtle" marginTop="spacing.1">
        {who}
      </Text>
      <Box display="flex" flexDirection="column" marginTop="spacing.5">
        {rows.map((r) => (
          <Box key={r.label} paddingY="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.subtle">
            <Label>{r.label}</Label>
            <Text marginTop="spacing.1">{r.text}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function MerchantSection() {
  const r = cycle;
  // Every third day keeps the line smooth and the lowest point close to its true date
  const every = 3;
  const path = r.projection.filter((_, i) => i % every === 0).map((p) => p.balance);
  const lowIndex = Math.round(r.projection.findIndex((p) => p.date === r.lowest.date) / every);
  const pace = yearlyPace(koshSplit);
  const notFor = [
    { who: 'Traders, wholesalers and D2C brands', why: 'Their cash is tied up in stock, and most borrow to fund it. They need credit, not investing.' },
    { who: 'Any business with an overdraft or working-capital loan', why: 'A loan costs more than a liquid fund earns. Spare cash should repay the loan first.' },
    { who: 'Funded startups and larger companies', why: 'They have the surplus, but also a finance team, a treasury policy and a desktop. This is not a phone job for them.' },
    { who: `Merchants with less than ${formatINR(plan.eligibility.minSurplus)} to spare`, why: `${formatINR(1_00_000)} for 3 months earns about ${formatINR(Math.round(couldEarn(1_00_000, pace, 91) / 100) * 100)}. Too little to change a habit.` },
  ];

  return (
    <Section id="merchant" tone="gray">
      <SectionIntro
        step="02"
        label="Who it's for"
        title="Businesses that collect first "
        highlight="and spend later."
        sub="Customers pay them in advance. Their costs come month by month. So cash piles up after every collection and sits for weeks or months. Three kinds of RazorpayX merchant fit this exactly."
      />

      <SectionBody>
        <Box display="grid" gridTemplateColumns={{ base: '1fr', l: 'repeat(3, 1fr)' }} gap="spacing.5">
          {segments.map((s) => (
            <SegmentCard key={s.name} {...s} />
          ))}
        </Box>

        <Box display="grid" gridTemplateColumns={{ base: '1fr', l: '1fr 1fr' }} gap="spacing.5" marginTop="spacing.5">
          <Box padding="spacing.7" borderRadius="xlarge" backgroundColor="surface.background.gray.intense" borderWidth="thin" borderColor="surface.border.primary.normal">
            <Heading size="large">A merchant qualifies when all five are true</Heading>
            <Text color="surface.text.gray.subtle" marginTop="spacing.1">
              Razorpay can check every one of these from its own data.
            </Text>
            <Box display="flex" flexDirection="column" gap="spacing.5" marginTop="spacing.6">
              {qualifies.map((q) => (
                <Box key={q.rule} display="flex" gap="spacing.3" alignItems="flex-start">
                  <Box flexShrink={0} display="flex" marginTop="spacing.1">
                    <CheckIcon size="large" color="feedback.icon.positive.intense" />
                  </Box>
                  <Box>
                    <Text size="large" weight="semibold">
                      {q.rule}
                    </Text>
                    <Text color="surface.text.gray.subtle" marginTop="spacing.1">
                      {q.detail}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box padding="spacing.7" borderRadius="xlarge" backgroundColor="surface.background.gray.intense" borderWidth="thin" borderColor="surface.border.gray.subtle">
            <Heading size="large">Who it is not for</Heading>
            <Text color="surface.text.gray.subtle" marginTop="spacing.1">
              We stress-tested the segments. These four are out, and why.
            </Text>
            <Box display="flex" flexDirection="column" gap="spacing.5" marginTop="spacing.6">
              {notFor.map((n) => (
                <Box key={n.who} display="flex" gap="spacing.3" alignItems="flex-start">
                  <Box flexShrink={0} display="flex" marginTop="spacing.1">
                    <CloseIcon size="large" color="feedback.icon.negative.intense" />
                  </Box>
                  <Box>
                    <Text size="large" weight="semibold">
                      {n.who}
                    </Text>
                    <Text color="surface.text.gray.subtle" marginTop="spacing.1">
                      {n.why}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* The merchant the prototype is built around */}
        <Box marginTop={{ base: 'spacing.8', m: 'spacing.10' }}>
          <Heading size="xlarge">The merchant in the prototype: {merchant.ownerFirstName}, from segment one</Heading>
          <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.5" marginTop="spacing.6">
            <Box padding="spacing.7" borderRadius="xlarge" backgroundColor="surface.background.gray.intense" elevation="lowRaised">
              <Box display="flex" alignItems="center" gap="spacing.4">
                <Avatar name={merchant.ownerName} size="large" color="primary" />
                <Box>
                  <Heading size="medium">{merchant.ownerName}</Heading>
                  <Text color="surface.text.gray.subtle">Owner, {merchant.businessName}</Text>
                </Box>
              </Box>
              <Text size="large" marginTop="spacing.6">
                Term fees have just come in and his balance is {formatINR(r.startBalance)}. Until the next term, fees bring in about{' '}
                {formatINR(r.totals.revenuePerMonth)} a month and costs run about {formatINR(r.totals.expensesPerMonth)}. Some of
                the balance is spare. He can't tell how much, or for how long.
              </Text>
              <Box marginTop="spacing.6" paddingLeft="spacing.5" borderLeftWidth="thick" borderLeftColor="surface.border.primary.normal">
                <Label>In his words</Label>
                <Text size="large" marginTop="spacing.1">
                  "I know it should be working. But I can't risk my teachers' salaries on a guess."
                </Text>
              </Box>
              <Box marginTop="spacing.6" padding="spacing.5" borderRadius="large" backgroundColor="surface.background.primary.subtle">
                <Label>The job he wants done</Label>
                <Text size="large" weight="semibold" marginTop="spacing.1">
                  Never miss a payment, and don't let the rest sit wasted.
                </Text>
              </Box>
            </Box>

            <Box padding="spacing.7" borderRadius="xlarge" backgroundColor="surface.background.gray.intense" elevation="lowRaised">
              <Heading size="medium">His balance over the next {formatMonths(r.months)}, as Kosh projects it</Heading>
              <Text color="surface.text.gray.subtle" marginTop="spacing.1">
                It falls month after month until term fees arrive on {formatDay(r.totals.nextTermFees.date)}. The dot is the lowest point.
              </Text>
              <Box marginTop="spacing.5">
                <Sparkline values={path} markIndex={lowIndex} height={120} />
              </Box>
              <Box display="grid" gridTemplateColumns={{ base: '1fr', s: '1fr 1fr 1fr' }} gap="spacing.4" marginTop="spacing.5">
                <Box>
                  <Label tone="muted">Balance today</Label>
                  <Amount value={r.startBalance} size="large" weight="semibold" suffix="none" />
                </Box>
                <Box>
                  <Label tone="notice">Lowest, on {r.lowest.day}</Label>
                  <Amount value={r.lowest.balance} size="large" weight="semibold" suffix="none" color="feedback.text.notice.intense" />
                </Box>
                <Box>
                  <Label tone="positive">Spare for {formatMonths(r.months)}</Label>
                  <Amount value={r.amount} size="large" weight="semibold" suffix="none" color="feedback.text.positive.intense" />
                </Box>
              </Box>
              <Text color="surface.text.gray.subtle" marginTop="spacing.5">
                Even at its lowest, the account holds more than he needs. That extra {formatINR(r.amount)} is what sits idle today.
              </Text>
            </Box>
          </Box>
        </Box>
      </SectionBody>
    </Section>
  );
}
