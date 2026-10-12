import { Box, Heading, Text } from '@razorpay/blade/components';
import { plan } from '../../data';
import { formatMonths } from '../../lib/dates';
import { formatINR } from '../../lib/format';
import { compare, koshSplit, sweepFdEarns, yearlyPace } from '../../lib/funds';
import { cycle } from '../../lib/recommendation';
import { Label, Section, SectionBody, SectionIntro, Takeaway } from './layout';

/**
 * The four things owners do with spare cash today: what each earns, and what it costs them.
 * The sweep FD is quoted at one reference rate (`plan.sweepFd.referencePct`).
 */
export function TodaySection() {
  const earn = compare(cycle.amount, koshSplit, cycle.days);
  const fd = plan.sweepFd;
  const fdLow = fd.slabs[0].pct;
  const fdSixMonths = fd.slabs.find((s) => cycle.days <= s.upToDays)!.pct;
  const fundPct = (yearlyPace(koshSplit) * 100).toFixed(1);

  const ways = [
    { title: 'Leave it in the current account', inRupees: formatINR(0), earns: '0% a year', good: 'Always available.', catchText: 'It earns nothing, however long it sits.' },
    { title: 'Keep a big "just in case" buffer', inRupees: formatINR(0), earns: '0% a year', good: 'Feels safe.', catchText: 'Nobody knows the right size, so the buffer is far bigger than needed.' },
    {
      title: 'Auto-sweep into an FD',
      inRupees: `About ${formatINR(sweepFdEarns(cycle.amount, cycle.days))}`,
      earns: `About ${fd.referencePct}% a year`,
      good: 'Automatic once set up.',
      catchText: `The owner has to guess the sweep limit. The rate depends on how long the money stays, and breaking the FD early costs ${fd.earlyBreakPenaltyPct}%.`,
    },
    {
      title: 'Invest by hand on another app',
      inRupees: `About ${formatINR(earn.kosh)}`,
      earns: `About ${fundPct}% a year`,
      good: 'The best return of the four.',
      catchText: 'A separate KYC, choosing funds, moving money in and out. And still no way to know how much is safe to move.',
    },
  ];

  return (
    <Section id="today">
      <SectionIntro
        step="03"
        label="How it's handled today"
        title="Four things owners do with spare cash "
        highlight="today."
        sub={`Each one is shown with what it earns on ${formatINR(cycle.amount)} over ${formatMonths(cycle.months)}, what works about it, and what it costs the owner.`}
      />

      <SectionBody>
        <Box display="grid" gridTemplateColumns={{ base: '1fr', s: 'repeat(2, 1fr)', l: 'repeat(4, 1fr)' }} gap="spacing.5">
          {ways.map((w, i) => (
            <Box key={w.title} padding="spacing.6" borderRadius="xlarge" borderWidth="thin" borderColor="surface.border.gray.subtle" backgroundColor="surface.background.gray.intense" display="flex" flexDirection="column">
              <Label tone="muted">Option {i + 1}</Label>
              <Heading size="large" marginTop="spacing.2">
                {w.title}
              </Heading>

              <Box marginTop="spacing.5" padding="spacing.4" borderRadius="large" backgroundColor="surface.background.gray.moderate">
                <Label tone="muted">It earns</Label>
                <Heading size="medium" marginTop="spacing.1">
                  {w.inRupees}
                </Heading>
                <Text color="surface.text.gray.subtle">{w.earns}</Text>
              </Box>

              <Box marginTop="spacing.5">
                <Label tone="positive">What works</Label>
                <Text marginTop="spacing.1">{w.good}</Text>
              </Box>
              <Box marginTop="spacing.4">
                <Label tone="negative">The catch</Label>
                <Text marginTop="spacing.1">{w.catchText}</Text>
              </Box>
            </Box>
          ))}
        </Box>
        <Text size="small" color="surface.text.gray.muted" marginTop="spacing.4">
          Sweep FD: a reference rate of {fd.referencePct}% a year. Banks pay {fdLow}% to {fdSixMonths}% depending on how long the money stays ({fd.source}), and swept money moves in and out. Funds: Kosh's two funds at their pace over the last 12 months. Returns are not guaranteed.
        </Text>

        <Takeaway>
          <Label>What the four have in common</Label>
          <Heading size="xlarge" marginTop="spacing.2">
            Every option forces a trade-off: safe, or earning.
          </Heading>
          <Text size="large" color="surface.text.gray.subtle" marginTop="spacing.3">
            And none of them tells the owner the one thing they need to know: how much is spare, and for how long.
          </Text>
        </Takeaway>
      </SectionBody>
    </Section>
  );
}
