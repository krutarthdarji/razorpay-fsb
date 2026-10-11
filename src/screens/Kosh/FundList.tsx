import styled from 'styled-components';
import { Box, ChevronRightIcon, Text } from '@razorpay/blade/components';
import type { Fund, FundId } from '../../data/funds';
import { yearlyReturn } from '../../lib/funds';
import { formatPct } from '../../lib/format';

const Row = styled.button(({ theme }) => ({
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[3],
  flex: 1,
  cursor: 'pointer',
  padding: `${theme.spacing[4]}px 0`,
  '&:focus-visible': { outline: `${theme.border.width.thick}px solid ${theme.colors.surface.border.primary.normal}` },
}));

/** Funds as tappable rows: name, kind, rating, and the return over the last 12 months */
export function FundList({ funds, onOpen, trailing }: { funds: Fund[]; onOpen: (id: FundId) => void; trailing?: (f: Fund) => React.ReactNode }) {
  return (
    <Box display="flex" flexDirection="column">
      {funds.map((f, i) => {
        const r = yearlyReturn(f, '1Y');
        return (
          <Box key={f.id} borderTopWidth={i === 0 ? 'none' : 'thin'} borderTopColor="surface.border.gray.subtle" display="flex" alignItems="center" gap="spacing.2">
            <Row onClick={() => onOpen(f.id)} aria-label={`${f.name}, details`}>
              <Box flex={1}>
                <Text weight="semibold">{f.name}</Text>
                <Text size="xsmall" color="surface.text.gray.muted" marginTop="spacing.1">
                  {f.kind} · {f.rating}★ rated
                </Text>
              </Box>
              <Box textAlign="right">
                <Text weight="semibold" color="feedback.text.positive.intense">
                  {r === null ? '—' : formatPct(r)}
                </Text>
                <Text size="xsmall" color="surface.text.gray.muted">
                  last 1 year
                </Text>
              </Box>
              {!trailing && <ChevronRightIcon size="small" color="surface.icon.gray.muted" />}
            </Row>
            {trailing?.(f)}
          </Box>
        );
      })}
    </Box>
  );
}
