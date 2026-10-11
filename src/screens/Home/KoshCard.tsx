import styled from 'styled-components';
import { Amount, ArrowRightIcon, Box, Button, CheckCircleIcon, CheckIcon, Link, Text, useTheme } from '@razorpay/blade/components';
import { formatMonths } from '../../lib/dates';
import { formatINR, formatLakh } from '../../lib/format';
import { balanceToday, recommendation, type Standing } from '../../lib/recommendation';
import { koshGradient } from '../../components/app/KoshAvatar';
import { KoshTag } from '../../components/app/KoshTag';

/** White card with a thin Kosh-gradient border */
const GradientBorder = styled.div(({ theme }) => ({
  padding: theme.border.width.thicker,
  borderRadius: theme.border.radius['2xlarge'],
  background: koshGradient(theme),
  boxShadow: theme.elevation.highRaised,
}));
const Inner = styled.div(({ theme }) => ({
  padding: theme.spacing[5],
  borderRadius: theme.border.radius['2xlarge'] - theme.border.width.thicker,
  backgroundColor: theme.colors.surface.background.gray.intense,
}));

const promises = ['More returns', '100% liquid', 'No lock-in'];

type Props = { onInvest: () => void; onExplain: () => void };

/** Before investing. Kosh's recommendation: how much surplus to invest, and for how long. */
export function KoshCard({ onInvest, onExplain }: Props) {
  const { theme } = useTheme();
  const r = recommendation;
  const forPayments = balanceToday - r.lowest.balance;
  const parts = [
    { label: 'For your payments', value: forPayments, color: theme.colors.data.background.categorical.gray.intense },
    { label: "Kosh's cushion", value: r.cushion, color: theme.colors.data.background.categorical.gold.moderate },
    { label: 'Surplus to invest', value: r.amount, color: theme.colors.data.background.categorical.green.intense },
  ];

  return (
    <GradientBorder>
      <Inner>
        <KoshTag size="large" label="Kosh's recommendation" />

        <Text size="large" weight="semibold" marginTop="spacing.4">
          {r.amount > 0
            ? `Invest ${formatINR(r.amount)} of your surplus for ${formatMonths(r.months)}.`
            : "Keep your cash in the account for now. Upcoming payments need it. Kosh will tell you when surplus builds up."}
        </Text>
        <Box display="flex" flexWrap="wrap" columnGap="spacing.4" rowGap="spacing.1" marginTop="spacing.2">
          {promises.map((p) => (
            <Box key={p} display="flex" alignItems="center" gap="spacing.1">
              <CheckIcon size="small" color="feedback.icon.positive.intense" />
              <Text size="small" weight="semibold" color="feedback.text.positive.intense">
                {p}
              </Text>
            </Box>
          ))}
        </Box>

        {/* Today's balance, as Kosh sees it */}
        <Box marginTop="spacing.5">
          <Box display="flex" height="12px" borderRadius="max" overflow="hidden" gap="spacing.1">
            {parts.map((p) => (
              <div key={p.label} style={{ width: `${(p.value / balanceToday) * 100}%`, backgroundColor: p.color }} />
            ))}
          </Box>
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="spacing.2" marginTop="spacing.3">
            {parts.map((p) => (
              <Box key={p.label}>
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <div style={{ width: 8, height: 8, flexShrink: 0, borderRadius: theme.border.radius.round, backgroundColor: p.color }} />
                  <Text size="small" weight="semibold">
                    {formatLakh(p.value)}
                  </Text>
                </Box>
                <Text size="xsmall" color="surface.text.gray.muted">
                  {p.label}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>

        {r.amount > 0 && (
          <Box marginTop="spacing.5">
            <Button isFullWidth size="large" icon={ArrowRightIcon} iconPosition="right" onClick={onInvest}>
              {`Put my ${formatINR(r.amount)} to work`}
            </Button>
          </Box>
        )}
        <Box marginTop="spacing.3" textAlign="center">
          <Link size="small" onClick={onExplain}>
            Why this amount?
          </Link>
        </Box>
      </Inner>
    </GradientBorder>
  );
}

type InvestedProps = {
  invested: number;
  status: Exclude<Standing, 'none'>;
  recommended: number;
  remaining: number;
  excess: number;
  months: number;
  onPortfolio: () => void;
  onKosh: () => void;
};

/**
 * After investing. What's invested next to what Kosh recommends, and Kosh's
 * suggestion whenever the two differ.
 */
export function InvestedCard({ invested, status, recommended, remaining, excess, months, onPortfolio, onKosh }: InvestedProps) {
  const { theme } = useTheme();
  const scale = Math.max(invested, recommended, 1);
  const tone = status === 'over' ? 'notice' : 'positive';
  const message = {
    at: 'Your idle cash is earning returns.',
    under: `${formatINR(remaining)} more of your surplus can grow.`,
    over: `You might need to withdraw ${formatINR(excess)}.`,
  }[status];
  const detail = {
    at: `You've invested exactly what Kosh recommends for the next ${formatMonths(months)}. It stays 100% liquid.`,
    under: `Kosh recommends investing ${formatINR(remaining)} more for the next ${formatMonths(months)}. Idle, it earns nothing.`,
    over: `That's ${formatINR(excess)} above Kosh's recommendation for the next ${formatMonths(months)}. Upcoming payments may need it. Withdrawing is instant.`,
  }[status];

  return (
    <GradientBorder>
      <Inner>
        <KoshTag size="large" label="Kosh's recommendation" />

        <Box display="flex" alignItems="center" gap="spacing.2" marginTop="spacing.4">
          {status === 'at' && <CheckCircleIcon size="medium" color="feedback.icon.positive.intense" />}
          <Text size="large" weight="semibold" color={status === 'at' ? 'feedback.text.positive.intense' : status === 'over' ? 'feedback.text.notice.intense' : undefined}>
            {status === 'at' ? "You're invested as Kosh recommends." : message}
          </Text>
        </Box>
        {status === 'at' && <Text marginTop="spacing.1">{message}</Text>}

        {/* Invested, next to what Kosh recommends */}
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.3" marginTop="spacing.4">
          <Box padding="spacing.4" borderRadius="large" backgroundColor="surface.background.gray.moderate">
            <Text size="xsmall" color="surface.text.gray.muted">
              You've invested
            </Text>
            <Amount value={invested} type="body" size="large" weight="semibold" suffix="none" />
          </Box>
          <Box padding="spacing.4" borderRadius="large" backgroundColor="surface.background.primary.subtle">
            <Text size="xsmall" color="surface.text.primary.normal">
              Kosh recommends
            </Text>
            <Amount value={recommended} type="body" size="large" weight="semibold" suffix="none" />
          </Box>
        </Box>
        <Box position="relative" height="10px" borderRadius="max" backgroundColor="surface.background.gray.moderate" marginTop="spacing.3" overflow="hidden">
          <div
            style={{
              width: `${(invested / scale) * 100}%`,
              height: '100%',
              borderRadius: theme.border.radius.max,
              backgroundColor: theme.colors.feedback.background[tone].intense,
            }}
          />
        </Box>
        <Text size="small" color="surface.text.gray.muted" marginTop="spacing.3">
          {detail}
        </Text>

        <Box display="flex" flexDirection="column" gap="spacing.3" marginTop="spacing.5">
          {status === 'under' && (
            <Button isFullWidth icon={ArrowRightIcon} iconPosition="right" onClick={onKosh}>
              {`Invest ${formatINR(remaining)} more`}
            </Button>
          )}
          {status === 'over' && (
            <Button isFullWidth icon={ArrowRightIcon} iconPosition="right" onClick={onKosh}>
              See what Kosh suggests
            </Button>
          )}
          <Button isFullWidth variant={status === 'at' ? 'primary' : 'secondary'} icon={status === 'at' ? ArrowRightIcon : undefined} iconPosition="right" onClick={onPortfolio}>
            View portfolio
          </Button>
          {status === 'at' && (
            <Button isFullWidth variant="secondary" onClick={onKosh}>
              Want to invest more?
            </Button>
          )}
        </Box>
      </Inner>
    </GradientBorder>
  );
}
