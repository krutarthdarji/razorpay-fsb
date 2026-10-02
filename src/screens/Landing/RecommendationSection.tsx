import { Amount, Badge, Box, Heading, InfoIcon, SparklesIcon, Text } from '@razorpay/blade/components';
import { merchant, predictedSpends } from '../../data';
import { cashflow, recommendation } from '../../lib/recommendation';
import { formatINR } from '../../lib/format';
import { Section, SectionIntro } from './layout';

type Term = { label: string; caption: string; value: number; tone?: 'predicted' | 'result' };

function TermTile({ label, caption, value, tone }: Term) {
  const isResult = tone === 'result';
  return (
    <Box
      flex={1}
      padding="spacing.6"
      borderRadius="large"
      borderWidth="thin"
      borderColor={isResult ? 'interactive.border.positive.default' : tone === 'predicted' ? 'surface.border.primary.normal' : 'surface.border.gray.subtle'}
      backgroundColor={isResult ? 'feedback.background.positive.subtle' : 'surface.background.gray.intense'}
      elevation={tone ? 'midRaised' : 'none'}
    >
      <Box display="flex" alignItems="center" gap="spacing.2" flexWrap="wrap">
        <Text size="small" weight="semibold" color={isResult ? 'feedback.text.positive.intense' : 'surface.text.gray.normal'}>
          {label}
        </Text>
        {tone === 'predicted' && (
          <Badge color="primary" icon={SparklesIcon} size="small">
            RazorpayX
          </Badge>
        )}
      </Box>
      <Box marginTop="spacing.2">
        <Amount
          value={value}
          type="heading"
          size="large"
          weight="semibold"
          suffix="none"
          color={isResult ? 'feedback.text.positive.intense' : undefined}
        />
      </Box>
      <Text size="small" color={isResult ? 'feedback.text.positive.intense' : 'surface.text.gray.muted'} marginTop="spacing.2">
        {caption}
      </Text>
    </Box>
  );
}

function Operator({ sign }: { sign: string }) {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" paddingX="spacing.2">
      <Text size="large" weight="semibold" color="surface.text.gray.muted">
        {sign}
      </Text>
    </Box>
  );
}

const signals = [
  'Your payout history',
  'Admission seasons',
  'When fees usually arrive',
  'Tax dates: GST, TDS',
  'Vendor bill cycles',
];

/** The USP: a recommended amount personalised to the merchant, not a rule of thumb */
export function RecommendationSection() {
  const r = recommendation;

  return (
    <Section id="recommendation" tone="gray">
      <SectionIntro
        eyebrow="Our edge"
        before="Not a rule of thumb. "
        highlight="Built for you."
        sub="Anyone can subtract salaries from a balance. RazorpayX also learns how your business spends, so the amount fits your business, not an average one."
      />

      <Box
        display="flex"
        flexDirection={{ base: 'column', m: 'row' }}
        alignItems="stretch"
        gap="spacing.3"
        marginTop={{ base: 'spacing.9', m: 'spacing.11' }}
      >
        <TermTile label="Balance today" caption="In your current account" value={merchant.balance} />
        <Operator sign="−" />
        <TermTile label="Scheduled payments" caption="Salaries, rent, GST, vendors" value={r.scheduled} />
        <Operator sign="−" />
        <TermTile label="Spends we predict" caption="Learned from your history" value={r.predicted} tone="predicted" />
        <Operator sign="=" />
        <TermTile label="Recommended to invest" caption={`For about ${r.days} days`} value={r.safe} tone="result" />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', m: '3fr 2fr' }}
        gap="spacing.6"
        marginTop="spacing.8"
      >
        <Box padding="spacing.7" borderRadius="large" backgroundColor="surface.background.gray.intense">
          <Heading size="small">What we predict for {merchant.businessName}</Heading>
          <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
            Spends that are not on any calendar yet
          </Text>
          <Box display="flex" flexDirection="column" gap="spacing.4" marginTop="spacing.5">
            {predictedSpends.map((p) => (
              <Box key={p.id} display="flex" justifyContent="space-between" alignItems="center" gap="spacing.4">
                <Box>
                  <Text weight="semibold">{p.label}</Text>
                  <Text size="small" color="surface.text.gray.muted">
                    {p.basis}
                  </Text>
                </Box>
                <Amount value={p.amount} size="medium" weight="semibold" suffix="none" />
              </Box>
            ))}
          </Box>
        </Box>

        <Box padding="spacing.7" borderRadius="large" backgroundColor="surface.background.gray.intense">
          <Heading size="small">What we learn from</Heading>
          <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
            Your own RazorpayX account, nothing else
          </Text>
          <Box display="flex" flexWrap="wrap" gap="spacing.3" marginTop="spacing.5">
            {signals.map((s) => (
              <Badge key={s} color="primary" size="large">
                {s}
              </Badge>
            ))}
          </Box>
        </Box>
      </Box>

      <Box display="flex" gap="spacing.3" alignItems="flex-start" marginTop="spacing.6" justifyContent="center">
        <InfoIcon size="medium" color="surface.icon.gray.muted" />
        <Text color="surface.text.gray.muted">
          Fees you are expecting ({formatINR(cashflow.totalIn)}) are not counted until they arrive.
        </Text>
      </Box>
    </Section>
  );
}
