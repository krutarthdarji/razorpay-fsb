import { Amount, Avatar, Badge, Box, Heading, Text, useTheme } from '@razorpay/blade/components';
import { merchant } from '../../data';
import { recommendation } from '../../lib/recommendation';
import { formatINR } from '../../lib/format';
import { Section, SectionIntro } from './layout';

const lookalikes = [
  'Coaching centres after admissions',
  'Schools after term fees',
  'Wholesalers after festive sales',
  'D2C brands after a big sale',
  'Agencies after client payments',
];

export function MerchantSection() {
  const { theme } = useTheme();
  const r = recommendation;
  const owes = r.scheduled;
  const idle = r.surplus;
  const total = owes + idle;

  return (
    <Section id="merchant" tone="gray">
      <SectionIntro
        eyebrow="The merchant"
        before="A smart owner who runs the business "
        highlight="from his phone."
        sub="Defined by a cash pattern, not an industry: money regularly sitting above what the next month needs."
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
            Term fees push his balance to {formatINR(merchant.balance)}. He owes {formatINR(owes)} over the next {r.days} days.{' '}
            {formatINR(idle)} sits idle.
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
            Balance after admissions, against what the next {r.days} days need
          </Text>
          <Box marginTop="spacing.6">
            <Text size="small" color="surface.text.gray.muted">
              Balance today
            </Text>
            <Amount value={merchant.balance} type="heading" size="xlarge" weight="semibold" suffix="none" />
          </Box>
          <Box display="flex" height="20px" borderRadius="max" overflow="hidden" gap="spacing.1" marginTop="spacing.4">
            <div style={{ width: `${(owes / total) * 100}%`, backgroundColor: theme.colors.data.background.categorical.gray.intense }} />
            <div style={{ width: `${(idle / total) * 100}%`, backgroundColor: theme.colors.data.background.categorical.gold.moderate }} />
          </Box>
          <Box display="flex" justifyContent="space-between" marginTop="spacing.3">
            <Box>
              <Text size="small" color="surface.text.gray.muted">
                Owed in {r.days} days
              </Text>
              <Amount value={owes} size="large" weight="semibold" suffix="none" />
            </Box>
            <Box textAlign="right">
              <Text size="small" color="feedback.text.notice.intense">
                Idle for {merchant.idleDays} days, earning ₹0
              </Text>
              <Amount value={idle} size="large" weight="semibold" suffix="none" color="feedback.text.notice.intense" />
            </Box>
          </Box>

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
