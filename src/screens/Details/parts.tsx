/** Pieces shared by the Revenue, Expenses and Liquidity screens */
import { motion } from 'framer-motion';
import { Amount, Badge, Box, Card, CardBody, Divider, Heading, Text, useTheme } from '@razorpay/blade/components';
import { formatLakh } from '../../lib/format';
import { msToS, toBezier } from '../../lib/motion';
import { KoshTag } from '../../components/app/KoshTag';

export function Section({ title, subtitle, right, children }: { title: string; subtitle?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card padding="spacing.5" elevation="lowRaised">
      <CardBody>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap="spacing.3">
          <Box>
            <Heading size="small">{title}</Heading>
            {subtitle && (
              <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
                {subtitle}
              </Text>
            )}
          </Box>
          {right}
        </Box>
        <Box marginTop="spacing.4">{children}</Box>
      </CardBody>
    </Card>
  );
}

/** Kosh's one-line read of the screen, at the top */
export function KoshSays({ children }: { children: React.ReactNode }) {
  return (
    <Box padding="spacing.5" borderRadius="xlarge" backgroundColor="surface.background.primary.subtle">
      <KoshTag label="Kosh projects" />
      <Box marginTop="spacing.3">{children}</Box>
    </Box>
  );
}

export type Status = 'done' | 'upcoming' | 'monthly';

/** One line of money: date pill, label, where Razorpay tracks it, amount */
export function ItemRow({
  label,
  date,
  dayOfMonth,
  amount,
  source,
  status,
  tone,
}: {
  label: string;
  date?: string;
  dayOfMonth?: number;
  amount: number;
  source?: string;
  status: Status;
  tone: 'in' | 'out';
}) {
  const d = date ? new Date(`${date}T00:00:00Z`) : null;
  const top = d ? String(d.getUTCDate()) : String(dayOfMonth ?? '');
  const bottom = d ? d.toLocaleDateString('en-IN', { month: 'short', timeZone: 'UTC' }) : 'monthly';
  const statusText = status === 'done' ? (tone === 'in' ? 'Received' : 'Paid') : status === 'upcoming' ? 'Expected' : undefined;

  return (
    <Box display="flex" alignItems="center" gap="spacing.4">
      <Box width="44px" paddingY="spacing.2" borderRadius="medium" backgroundColor="surface.background.gray.moderate" textAlign="center" flexShrink={0}>
        <Text weight="semibold">{top}</Text>
        <Text size="xsmall" color="surface.text.gray.muted">
          {bottom}
        </Text>
      </Box>
      <Box flex={1}>
        <Text weight="semibold">{label}</Text>
        <Box display="flex" gap="spacing.2" alignItems="center" flexWrap="wrap">
          {statusText && (
            <Badge size="small" color={status === 'done' ? 'positive' : 'neutral'}>
              {statusText}
            </Badge>
          )}
          {source && (
            <Text size="xsmall" color="surface.text.gray.muted">
              via {source}
            </Text>
          )}
        </Box>
      </Box>
      <Amount value={amount} size="medium" weight="semibold" suffix="none" color={tone === 'in' ? 'feedback.text.positive.intense' : undefined} />
    </Box>
  );
}

export type MonthBar = { key: string; label: string; value: number; kind: 'tracked' | 'now' | 'projected'; note?: string };

/**
 * One row per month: a bar, the amount, and a note when the month stands out.
 * Solid bars are tracked by Razorpay. Lighter bars are Kosh's projection.
 */
export function MonthBars({ rows, tone }: { rows: MonthBar[]; tone: 'in' | 'out' | 'balance' }) {
  const { theme } = useTheme();
  const palette = theme.colors.data.background.categorical[tone === 'in' ? 'green' : tone === 'out' ? 'red' : 'blue'];
  const max = Math.max(...rows.map((r) => r.value));
  const firstProjected = rows.findIndex((r) => r.kind === 'projected');

  return (
    <Box display="flex" flexDirection="column" gap="spacing.3">
      {rows.map((r, i) => (
        <Box key={r.key}>
          {i === firstProjected && (
            <Box display="flex" alignItems="center" gap="spacing.3" marginBottom="spacing.3" marginTop="spacing.2">
              <Box flex={1}>
                <Divider />
              </Box>
              <Text size="xsmall" weight="semibold" color="surface.text.primary.normal">
                KOSH PROJECTS
              </Text>
              <Box flex={1}>
                <Divider />
              </Box>
            </Box>
          )}
          <Box display="flex" alignItems="center" gap="spacing.3">
            <Box width="36px" flexShrink={0}>
              <Text size="small" weight="semibold" color={r.kind === 'now' ? 'surface.text.primary.normal' : 'surface.text.gray.normal'}>
                {r.label}
              </Text>
            </Box>
            <Box flex={1} height="14px" borderRadius="max" backgroundColor="surface.background.gray.moderate" overflow="hidden">
              <motion.div
                style={{ height: '100%', borderRadius: theme.border.radius.max, backgroundColor: r.kind === 'projected' ? palette.subtle : palette.intense }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(2, (r.value / max) * 100)}%` }}
                transition={{ delay: i * 0.03, duration: msToS(theme.motion.duration.gentle), ease: toBezier(theme.motion.easing.entrance) }}
              />
            </Box>
            <Box width="60px" flexShrink={0} textAlign="right">
              <Text size="small" weight="semibold">
                {formatLakh(r.value)}
              </Text>
            </Box>
          </Box>
          {r.note && (
            <Text size="xsmall" color="surface.text.gray.muted" marginLeft="48px">
              {r.note}
            </Text>
          )}
        </Box>
      ))}
    </Box>
  );
}

/** Two numbers side by side */
export function StatPair({ a, b }: { a: { label: string; value: number }; b: { label: string; value: number } }) {
  return (
    <Box display="flex" gap="spacing.3">
      {[a, b].map((s) => (
        <Box key={s.label} flex={1} padding="spacing.4" borderRadius="large" backgroundColor="surface.background.gray.moderate">
          <Text size="xsmall" color="surface.text.gray.muted">
            {s.label}
          </Text>
          <Amount value={s.value} type="body" size="large" weight="semibold" suffix="none" />
        </Box>
      ))}
    </Box>
  );
}

/**
 * How Kosh knows. Names the Razorpay products that exist today, and what Kosh adds.
 * Cashflow Insights and the Cashflow Forecaster are real Razorpay products.
 */
export function HowKoshKnows({ sources }: { sources: string[] }) {
  const steps = [
    { title: 'Razorpay tracks it', body: `Every rupee is already recorded: ${sources.join(', ')}. RazorpayX Cashflow Insights adds it up.` },
    { title: 'Razorpay forecasts the week', body: "Razorpay's Cashflow Forecaster agent predicts your cash position 3 to 7 days ahead." },
    { title: 'Kosh projects the year', body: 'Kosh learns your seasons from that history and projects the next 12 months, month by month.' },
  ];
  return (
    <Section title="How Kosh knows" subtitle="Built on what Razorpay already tracks for you">
      <Box display="flex" flexDirection="column" gap="spacing.4">
        {steps.map((s, i) => (
          <Box key={s.title} display="flex" gap="spacing.4" alignItems="flex-start">
            <Box width="28px" height="28px" flexShrink={0} borderRadius="round" backgroundColor="surface.background.primary.subtle" display="flex" alignItems="center" justifyContent="center">
              <Text size="small" weight="semibold" color="surface.text.primary.normal">
                {i + 1}
              </Text>
            </Box>
            <Box>
              <Text weight="semibold">{s.title}</Text>
              <Text size="small" color="surface.text.gray.muted">
                {s.body}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
