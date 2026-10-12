import { ArrowRightIcon, Box, CheckCircleIcon, Heading, Text } from '@razorpay/blade/components';
import { brand } from '../../brand';
import { merchant, plan } from '../../data';
import { formatMonths } from '../../lib/dates';
import { formatINR } from '../../lib/format';
import { compare, koshSplit, sweepFdEarns } from '../../lib/funds';
import { cycle } from '../../lib/recommendation';
import { KoshAvatar } from '../../components/app/KoshAvatar';
import { frictions } from './FrictionSection';
import { Label, Section, SectionBody, SectionIntro, Takeaway } from './layout';

export function SolutionSection() {
  const r = cycle;
  const earn = compare(r.amount, koshSplit, r.days);

  /** What Kosh does about each friction, in the same order as the friction section */
  const answers = [
    {
      does: 'Kosh tells the owner the amount and the duration',
      how: `It projects the balance 12 months ahead from collections, payroll, vendor and tax payments. It finds the lowest point, keeps a cushion of ${formatINR(r.cushion)} for surprises, and recommends the rest. For ${merchant.ownerFirstName}: ${formatINR(r.amount)} for ${formatMonths(r.months)}.`,
    },
    {
      does: 'Payments always come first',
      how: 'Kosh only recommends money that no payment needs. Salaries, rent and taxes are covered before a single rupee is invested.',
    },
    {
      does: 'One tap, inside RazorpayX',
      how: 'Kosh splits the money across two top-rated funds: a liquid fund and a money market fund. No shares, no lock-in, no fund research. The owner confirms with the MPIN already used for payouts.',
    },
    {
      does: 'Withdraw any time, credited instantly',
      how: `Razorpay puts the money in the account at once and collects it from the fund the next working day. That credit is free for ${plan.freeCreditDays} day.`,
    },
  ];
  const outcome = [
    { label: 'Left idle in the current account', value: formatINR(0), tone: 'muted' as const },
    { label: `In an auto-sweep FD, at about ${plan.sweepFd.referencePct}% a year`, value: `About ${formatINR(sweepFdEarns(r.amount, r.days))}`, tone: 'muted' as const },
    { label: `Invested through ${brand.name}`, value: `About ${formatINR(earn.kosh)}`, tone: 'positive' as const },
  ];

  return (
    <Section id="solution">
      <SectionIntro
        step="05"
        label="The solution"
        title={`${brand.name}: an AI agent that answers the question, `}
        highlight="then does the job."
        sub={`${brand.name} lives in the RazorpayX app. ${brand.meaning}: large companies have a treasury desk that never lets cash sit idle. ${brand.name} gives every small business one.`}
      />

      <SectionBody>
        <Box display="flex" alignItems="center" gap="spacing.3">
          <KoshAvatar size="medium" />
          <Heading size="xlarge">What {brand.name} does, friction by friction</Heading>
        </Box>
        <Box display="flex" flexDirection="column" gap="spacing.4" marginTop="spacing.6">
          {frictions.map((f, i) => (
            <Box key={f.name} display="grid" gridTemplateColumns={{ base: '1fr', m: '0.8fr auto 1.6fr' }} gap={{ base: 'spacing.4', m: 'spacing.6' }} alignItems="center" padding="spacing.6" borderRadius="xlarge" borderWidth="thin" borderColor="surface.border.gray.subtle">
              <Box>
                <Label tone="negative">
                  Friction {i + 1}: {f.name}
                </Label>
                <Text size="large" color="surface.text.gray.subtle" marginTop="spacing.1">
                  {f.says}
                </Text>
              </Box>
              <Box display={{ base: 'none', m: 'flex' }}>
                <ArrowRightIcon size="large" color="surface.icon.gray.muted" />
              </Box>
              <Box display="flex" gap="spacing.3" alignItems="flex-start">
                <Box flexShrink={0} display="flex" marginTop="spacing.1">
                  <CheckCircleIcon size="large" color="feedback.icon.positive.intense" />
                </Box>
                <Box>
                  <Heading size="medium">{answers[i].does}</Heading>
                  <Text marginTop="spacing.2">{answers[i].how}</Text>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        <Takeaway>
          <Label>What it means for {merchant.ownerFirstName}</Label>
          <Heading size="xlarge" marginTop="spacing.2">
            {formatINR(r.amount)} that sat idle now earns for {formatMonths(r.months)}, and every payment still goes through.
          </Heading>
          <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3, 1fr)' }} gap="spacing.5" marginTop="spacing.5">
            {outcome.map((o) => (
              <Box key={o.label}>
                <Label tone={o.tone}>{o.label}</Label>
                <Heading size="large" color={o.tone === 'positive' ? 'feedback.text.positive.intense' : undefined}>
                  {o.value}
                </Heading>
              </Box>
            ))}
          </Box>
          <Text size="small" color="surface.text.gray.muted" marginTop="spacing.4">
            Estimates. Funds at their pace over the last 12 months; sweep FD at a reference rate of {plan.sweepFd.referencePct}% a year. Returns are not guaranteed.
          </Text>
        </Takeaway>
      </SectionBody>
    </Section>
  );
}
