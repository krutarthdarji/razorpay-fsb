import { Amount, Avatar, Badge, Box, Heading, Text } from '@razorpay/blade/components';
import { merchant } from '../../data';
import { formatDay, formatMonths } from '../../lib/dates';
import { formatINR } from '../../lib/format';
import { cycle } from '../../lib/recommendation';
import { Sparkline } from '../../components/app/Sparkline';
import { Section, SectionIntro } from './layout';

const lookalikes = [
  'Coaching centres after admissions',
  'Schools after term fees',
  'Wholesalers after festive sales',
  'D2C brands after a big sale',
  'Agencies after client payments',
];

export function MerchantSection() {
  const r = cycle;
  const { startBalance: balanceToday, outlook: projection, totals } = cycle;
  const weekly = projection.filter((_, i) => i % 7 === 0).map((p) => p.balance);
  const lowIndex = Math.round(projection.findIndex((p) => p.date === r.lowest.date) / 7);

  return (
    <Section id="merchant" tone="gray">
      <SectionIntro
        eyebrow="The merchant"
        before="A smart owner who runs the business "
        highlight="from his phone."
        sub="Defined by a cash pattern, not an industry: money regularly sitting above what the coming months need."
      />

      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.6" marginTop={{ base: 'spacing.9', m: 'spacing.11' }}>
        {/* Ravi */}
        <Box padding="spacing.7" borderRadius="xlarge" backgroundColor="surface.background.gray.intense" elevation="lowRaised">
          <Box display="flex" alignItems="center" gap="spacing.4">
            <Avatar name={merchant.ownerName} size="large" color="primary" />
            <Box>
              <Heading size="medium">{merchant.ownerName}</Heading>
              <Text color="surface.text.gray.muted">Owner, {merchant.businessName}</Text>
            </Box>
          </Box>
          <Text size="large" marginTop="spacing.6">
            His balance is {formatINR(balanceToday)} after term fees. Between terms, fees bring in{' '}
            {formatINR(totals.revenuePerMonth)} a month and costs run {formatINR(totals.expensesPerMonth)}. Some of it is
            spare. He can't tell how much, or for how long.
          </Text>
          <Box marginTop="spacing.6" paddingLeft="spacing.5" borderLeftWidth="thick" borderLeftColor="surface.border.primary.normal">
            <Text size="large" color="surface.text.gray.subtle">
              "I know it should be working. But I can't risk my teachers' salaries on a guess."
            </Text>
          </Box>
          <Box marginTop="spacing.6" padding="spacing.5" borderRadius="large" backgroundColor="surface.background.primary.subtle">
            <Text size="small" weight="semibold" color="surface.text.primary.normal">
              HIS JOB TO BE DONE
            </Text>
            <Text size="large" weight="semibold" marginTop="spacing.2">
              Never miss a payment, and don't let the rest sit wasted.
            </Text>
          </Box>
        </Box>

        {/* His cash pattern */}
        <Box padding="spacing.7" borderRadius="xlarge" backgroundColor="surface.background.gray.intense" elevation="lowRaised" display="flex" flexDirection="column">
          <Heading size="small">His cash pattern</Heading>
          <Text color="surface.text.gray.muted" marginTop="spacing.1">
            Balance until the next term fees on {formatDay(totals.nextTermFees.date)}
          </Text>
          <Box marginTop="spacing.5">
            <Sparkline values={weekly} markIndex={lowIndex} height={96} />
          </Box>
          <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap="spacing.3" marginTop="spacing.4">
            <Box>
              <Text size="xsmall" color="surface.text.gray.muted">
                Today
              </Text>
              <Amount value={balanceToday} size="medium" weight="semibold" suffix="none" />
            </Box>
            <Box>
              <Text size="xsmall" color="feedback.text.notice.intense">
                Lowest, {r.lowest.day}
              </Text>
              <Amount value={r.lowest.balance} size="medium" weight="semibold" suffix="none" color="feedback.text.notice.intense" />
            </Box>
            <Box>
              <Text size="xsmall" color="feedback.text.positive.intense">
                Surplus for {formatMonths(r.months)}
              </Text>
              <Amount value={r.amount} size="medium" weight="semibold" suffix="none" color="feedback.text.positive.intense" />
            </Box>
          </Box>
          <Text size="small" color="surface.text.gray.muted" marginTop="spacing.3">
            Sitting idle for {merchant.idleDays} days, earning ₹0.
          </Text>

          <Box marginTop="auto" paddingTop="spacing.7">
            <Text size="small" weight="semibold">
              Same pattern, many businesses
            </Text>
            <Box display="flex" flexWrap="wrap" gap="spacing.2" marginTop="spacing.3">
              {lookalikes.map((l) => (
                <Badge key={l} color="neutral" size="medium">
                  {l}
                </Badge>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Section>
  );
}
