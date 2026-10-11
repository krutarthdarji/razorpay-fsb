import { useNavigate } from 'react-router-dom';
import { Amount, ArrowRightIcon, Box, Button, Divider, Text } from '@razorpay/blade/components';
import { cushionBasis } from '../../data';
import { formatDay, formatMonth, formatMonths } from '../../lib/dates';
import { formatINR, formatLakh } from '../../lib/format';
import { cycle } from '../../lib/recommendation';
import { useDemo } from '../../state/demo';
import { paths } from '../../routes';
import { PageTitle } from '../../components/app/PageTitle';
import { Reveal } from '../../components/app/Reveal';
import { KoshTag } from '../../components/app/KoshTag';
import { ProjectionChart } from '../../components/app/ProjectionChart';
import { HowKoshKnows, MonthBars, Section, type MonthBar } from './parts';

/**
 * How Kosh arrived at its recommendation: projected balance, cushion, surplus.
 * It explains the recommendation as Kosh made it, at the start of the cycle, so it
 * reads the same however far the demo clock has moved.
 */
export function Liquidity() {
  const navigate = useNavigate();
  const { startFlow, today, totalInvested, finished } = useDemo();
  const r = cycle;
  const started = today > r.start;
  const lowestMonth = r.lowest.date.slice(0, 7);

  const bars: MonthBar[] = r.monthly.map((m, i) => ({
    key: m.month,
    label: formatMonth(m.month),
    value: m.closing,
    kind: i === 0 ? ('now' as const) : ('projected' as const),
    note: m.month === lowestMonth ? `Dips to ${formatLakh(r.lowest.balance)} on ${r.lowest.day}` : `${formatLakh(m.moneyIn)} in, ${formatLakh(m.moneyOut)} out`,
  }));

  return (
    <Box paddingBottom="spacing.7">
      <PageTitle title="Projected liquid money" subtitle="How Kosh arrived at its recommendation" />
      <Box padding="spacing.5" display="flex" flexDirection="column" gap="spacing.5">
        <Reveal index={0}>
          <Box padding="spacing.5" borderRadius="xlarge" backgroundColor="surface.background.primary.subtle">
            <KoshTag label="Kosh recommends" />
            <Box marginTop="spacing.3" display="flex" alignItems="baseline" gap="spacing.2" flexWrap="wrap">
              <Amount value={r.amount} type="heading" size="xlarge" weight="semibold" suffix="none" />
              <Text size="large" weight="semibold">
                for {formatMonths(r.months)}
              </Text>
            </Box>
            <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
              Surplus you won't need. Invested, it earns more and stays 100% liquid.
            </Text>
          </Box>
        </Reveal>

        <Reveal index={1}>
          <Section title="1. Kosh projects your balance" subtitle={`From ${formatINR(r.startBalance)} ${started ? `on ${formatDay(r.start)}` : 'today'}. Balance at the end of each month.`}>
            <MonthBars rows={bars} tone="balance" />
            <Box marginTop="spacing.5">
              <ProjectionChart points={r.projection} cushion={r.cushion} markDay={r.lowest.day} height="220px" />
            </Box>
            <Text size="small" color="surface.text.gray.muted" marginTop="spacing.2">
              Lowest point in {formatMonths(r.months)}: {formatINR(r.lowest.balance)} on {r.lowest.day}. Term fees refill the account on {formatDay(r.totals.nextTermFees.date)}.
            </Text>
          </Section>
        </Reveal>

        <Reveal index={2}>
          <Section title={`2. Kosh recommends a ${formatINR(r.cushion)} cushion`} subtitle="For the surprises of the last 12 months. It stays in your account.">
            <Box display="flex" flexDirection="column" gap="spacing.3">
              {cushionBasis.map((c) => (
                <Box key={c.id} display="flex" justifyContent="space-between" alignItems="center" gap="spacing.3">
                  <Box>
                    <Text size="small">{c.label}</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">
                      {c.note}
                    </Text>
                  </Box>
                  <Amount value={c.amount} size="small" weight="semibold" suffix="none" />
                </Box>
              ))}
            </Box>
          </Section>
        </Reveal>

        <Reveal index={3}>
          <Section title="3. The rest is surplus" subtitle={`Money no payment needs for the whole ${formatMonths(r.months)}`}>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.muted">
                  Lowest balance Kosh projects
                </Text>
                <Amount value={r.lowest.balance} size="small" weight="semibold" suffix="none" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.muted">
                  − Kosh's cushion
                </Text>
                <Amount value={r.cushion} size="small" weight="semibold" suffix="none" />
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Text weight="semibold" color="feedback.text.positive.intense">
                  Kosh recommends investing
                </Text>
                <Amount value={r.amount} size="large" weight="semibold" suffix="none" color="feedback.text.positive.intense" />
              </Box>
              <Text size="xsmall" color="surface.text.gray.muted">
                Kosh rounds down, so you always keep a little extra.
              </Text>
            </Box>
          </Section>
        </Reveal>

        <Reveal index={4}>
          <Section title="Want a different duration?" subtitle="Kosh's recommendation changes with how long you invest">
            <Box display="flex" flexDirection="column" gap="spacing.3">
              {r.byDuration.map((d) => (
                <Box key={d.months} display="flex" justifyContent="space-between" alignItems="center">
                  <Text weight={d.months === r.months ? 'semibold' : 'regular'}>{formatMonths(d.months)}</Text>
                  <Amount value={d.amount} size="medium" weight="semibold" suffix="none" color={d.months === r.months ? 'feedback.text.positive.intense' : undefined} />
                </Box>
              ))}
            </Box>
          </Section>
        </Reveal>

        <Reveal index={5}>
          <HowKoshKnows sources={['collections', 'payroll', 'vendor payments', 'tax payments']} />
        </Reveal>

        {/* Only while there is something left to invest */}
        {!finished && totalInvested === 0 && r.amount > 0 && (
          <Button
            isFullWidth
            size="large"
            icon={ArrowRightIcon}
            iconPosition="right"
            onClick={() => {
              startFlow();
              navigate(paths.kosh);
            }}
          >
            {`Put my ${formatINR(r.amount)} to work`}
          </Button>
        )}
      </Box>
    </Box>
  );
}
