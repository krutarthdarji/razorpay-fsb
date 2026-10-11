import { Box, ProgressBar, Text } from '@razorpay/blade/components';
import { expenseNotes } from '../../data';
import { formatMonth } from '../../lib/dates';
import { formatLakh } from '../../lib/format';
import { cycle, monthly, pastMonths, sum, thisMonth, totals } from '../../lib/recommendation';
import { PageTitle } from '../../components/app/PageTitle';
import { Reveal } from '../../components/app/Reveal';
import { ItemRow, KoshSays, MonthBars, Section, StatPair, type MonthBar } from './parts';

const monthOf = (key: string) => Number(key.slice(5, 7));

export function Expenses() {
  const paid = sum(thisMonth.expensesPaid);
  const due = sum(thisMonth.expensesDue);
  const ahead = monthly.slice(1, cycle.months + 1);
  const low = ahead.reduce((a, b) => (b.moneyOut < a.moneyOut ? b : a));
  const high = ahead.reduce((a, b) => (b.moneyOut > a.moneyOut ? b : a));

  const bars: MonthBar[] = [
    ...pastMonths.map((m) => ({ key: m.month, label: formatMonth(m.month), value: m.expenses, kind: 'tracked' as const })),
    { key: thisMonth.key, label: formatMonth(thisMonth.key), value: paid + due, kind: 'now' as const, note: `${formatLakh(paid)} paid so far` },
    ...ahead.map((m) => ({ key: m.month, label: formatMonth(m.month), value: m.moneyOut, kind: 'projected' as const, note: expenseNotes[monthOf(m.month)] })),
  ];

  return (
    <Box paddingBottom="spacing.7">
      <PageTitle title="Money going out" subtitle="Tracked by Razorpay. Projected by Kosh." />
      <Box padding="spacing.5" display="flex" flexDirection="column" gap="spacing.5">
        <Reveal index={0}>
          <KoshSays>
            <Text size="large" weight="semibold">
              About {formatLakh(totals.expensesPerMonth)} a month, from {formatLakh(low.moneyOut)} in {formatMonth(low.month)} to {formatLakh(high.moneyOut)} in{' '}
              {formatMonth(high.month)}.
            </Text>
            <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
              Kosh keeps every one of these payments covered before it recommends investing a rupee.
            </Text>
          </KoshSays>
        </Reveal>

        <Reveal index={1}>
          <Section title="Month by month" subtitle="Solid: tracked by Razorpay. Light: Kosh's projection.">
            <MonthBars rows={bars} tone="out" />
          </Section>
        </Reveal>

        <Reveal index={2}>
          <Section title={`${formatMonth(thisMonth.key)} so far`}>
            <StatPair a={{ label: 'Paid', value: paid }} b={{ label: 'Kosh expects', value: due }} />
            <Box marginTop="spacing.4">
              <ProgressBar value={(paid / Math.max(1, paid + due)) * 100} accessibilityLabel="Expenses paid this month" />
            </Box>
            <Box display="flex" flexDirection="column" gap="spacing.4" marginTop="spacing.5">
              {thisMonth.expensesPaid.map((i) => (
                <ItemRow key={i.id} label={i.label} date={i.date} amount={i.amount} source={i.source} status="done" tone="out" />
              ))}
              {thisMonth.expensesDue.map((i) => (
                <ItemRow key={i.id} label={i.label} date={i.date} amount={i.amount} source={i.source} status="upcoming" tone="out" />
              ))}
            </Box>
          </Section>
        </Reveal>
      </Box>
    </Box>
  );
}
