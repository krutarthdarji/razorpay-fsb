import { Box, ProgressBar, Text } from '@razorpay/blade/components';
import { revenueNotes } from '../../data';
import { formatDay, formatMonth } from '../../lib/dates';
import { formatINR, formatLakh } from '../../lib/format';
import { cycle, monthly, pastMonths, sum, thisMonth, totals } from '../../lib/recommendation';
import { PageTitle } from '../../components/app/PageTitle';
import { Reveal } from '../../components/app/Reveal';
import { ItemRow, KoshSays, MonthBars, Section, StatPair, type MonthBar } from './parts';

const monthOf = (key: string) => Number(key.slice(5, 7));

export function Revenue() {
  const received = sum(thisMonth.revenueReceived);
  const upcoming = sum(thisMonth.revenueUpcoming);
  const term = totals.nextTermFees;
  const ahead = monthly.slice(1, cycle.months + 1);
  const ordinary = ahead.filter((m) => m.month !== term.date.slice(0, 7));
  const low = ordinary.reduce((a, b) => (b.moneyIn < a.moneyIn ? b : a));
  const high = ordinary.reduce((a, b) => (b.moneyIn > a.moneyIn ? b : a));

  const bars: MonthBar[] = [
    ...pastMonths.map((m) => ({ key: m.month, label: formatMonth(m.month), value: m.revenue, kind: 'tracked' as const })),
    { key: thisMonth.key, label: formatMonth(thisMonth.key), value: received + upcoming, kind: 'now' as const, note: `${formatLakh(received)} received so far` },
    ...ahead.map((m) => ({ key: m.month, label: formatMonth(m.month), value: m.moneyIn, kind: 'projected' as const, note: revenueNotes[monthOf(m.month)] })),
  ];

  return (
    <Box paddingBottom="spacing.7">
      <PageTitle title="Money coming in" subtitle="Tracked by Razorpay. Projected by Kosh." />
      <Box padding="spacing.5" display="flex" flexDirection="column" gap="spacing.5">
        <Reveal index={0}>
          <KoshSays>
            <Text size="large" weight="semibold">
              About {formatLakh(totals.revenuePerMonth)} a month, from {formatLakh(low.moneyIn)} in {formatMonth(low.month)} to {formatLakh(high.moneyIn)} in{' '}
              {formatMonth(high.month)}.
            </Text>
            <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
              Then {formatINR(term.amount)} of term fees on {formatDay(term.date)}.
            </Text>
          </KoshSays>
        </Reveal>

        <Reveal index={1}>
          <Section title="Month by month" subtitle="Solid: tracked by Razorpay. Light: Kosh's projection.">
            <MonthBars rows={bars} tone="in" />
          </Section>
        </Reveal>

        <Reveal index={2}>
          <Section title={`${formatMonth(thisMonth.key)} so far`}>
            <StatPair a={{ label: 'Received', value: received }} b={{ label: 'Kosh expects', value: upcoming }} />
            <Box marginTop="spacing.4">
              <ProgressBar value={(received / Math.max(1, received + upcoming)) * 100} accessibilityLabel="Revenue received this month" color="positive" />
            </Box>
            <Box display="flex" flexDirection="column" gap="spacing.4" marginTop="spacing.5">
              {thisMonth.revenueReceived.map((i) => (
                <ItemRow key={i.id} label={i.label} date={i.date} amount={i.amount} source={i.source} status="done" tone="in" />
              ))}
              {thisMonth.revenueUpcoming.map((i) => (
                <ItemRow key={i.id} label={i.label} date={i.date} amount={i.amount} source={i.source} status="upcoming" tone="in" />
              ))}
            </Box>
          </Section>
        </Reveal>
      </Box>
    </Box>
  );
}
