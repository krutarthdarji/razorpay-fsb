import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  Box,
  ChevronRightIcon,
  Heading,
  Text,
  WalletIcon,
  type IconComponent,
} from '@razorpay/blade/components';
import { formatLakh } from '../../lib/format';
import { recommendation, totals } from '../../lib/recommendation';
import { paths } from '../../routes';

/** A tappable card. Native button so it works with keyboard and screen readers. */
const Tile = styled.button(({ theme }) => ({
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[2],
  cursor: 'pointer',
  padding: theme.spacing[4],
  borderRadius: theme.border.radius.large,
  backgroundColor: theme.colors.surface.background.gray.intense,
  border: `${theme.border.width.thin}px solid ${theme.colors.surface.border.gray.subtle}`,
  boxShadow: theme.elevation.lowRaised,
  transition: `transform ${theme.motion.duration.quick}ms ${theme.motion.easing.standard}`,
  '&:active': { transform: 'scale(0.97)' },
  '&:focus-visible': { outline: `${theme.border.width.thick}px solid ${theme.colors.surface.border.primary.normal}` },
}));

type Stat = { icon: IconComponent; tone: 'in' | 'out' | 'neutral'; label: string; value: number; caption: string; to: string };

/** Home's three numbers, projected by Kosh: what comes in, what goes out, what's left. Tap any for details. */
export function StatCards() {
  const navigate = useNavigate();
  const stats: Stat[] = [
    { icon: ArrowDownLeftIcon, tone: 'in', label: 'Monthly revenue', value: totals.revenuePerMonth, caption: 'average, coming in', to: paths.revenue },
    { icon: ArrowUpRightIcon, tone: 'out', label: 'Estimated expenses', value: totals.expensesPerMonth, caption: 'average, going out', to: paths.expenses },
    { icon: WalletIcon, tone: 'neutral', label: 'Projected liquid money', value: recommendation.lowest.balance, caption: `lowest, on ${recommendation.lowest.day}`, to: paths.liquidity },
  ];
  const iconColor = { in: 'feedback.icon.positive.intense', out: 'feedback.icon.negative.intense', neutral: 'surface.icon.primary.normal' } as const;
  const iconBg = { in: 'feedback.background.positive.subtle', out: 'feedback.background.negative.subtle', neutral: 'surface.background.primary.subtle' } as const;

  return (
    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="spacing.3">
      {stats.map(({ icon: Icon, tone, label, value, caption, to }) => (
        <Tile key={label} onClick={() => navigate(to)} aria-label={`${label}, details`}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box padding="spacing.2" borderRadius="medium" backgroundColor={iconBg[tone]} display="flex">
              <Icon size="small" color={iconColor[tone]} />
            </Box>
            <ChevronRightIcon size="small" color="surface.icon.gray.muted" />
          </Box>
          <Heading size="medium" weight="semibold">
            {formatLakh(value)}
          </Heading>
          <Box>
            <Text size="xsmall" weight="semibold">
              {label}
            </Text>
            <Text size="xsmall" color="surface.text.gray.muted">
              {caption}
            </Text>
          </Box>
        </Tile>
      ))}
    </Box>
  );
}
