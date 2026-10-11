import { Amount, Box, Button, ChevronRightIcon, IconButton, Link, MinusIcon, PlusIcon, Text, TrashIcon, useTheme } from '@razorpay/blade/components';
import type { FundId } from '../../data/funds';
import { fundById, splitAmount, type Allocation } from '../../lib/funds';
import { fundColor } from '../../components/app/fundStyle';

type Props = {
  amount: number;
  allocations: Allocation[];
  isCustom: boolean;
  onPct: (fundId: FundId, pct: number) => void;
  onRemove: (fundId: FundId) => void;
  onReset: () => void;
  onAdd: () => void;
  onOpenFund: (fundId: FundId) => void;
};

const STEP = 5;

/** The split across funds. Change any share; the rest rebalance so it always adds to 100%. */
export function PlanEditor({ amount, allocations, isCustom, onPct, onRemove, onReset, onAdd, onOpenFund }: Props) {
  const { theme } = useTheme();
  const amounts = new Map(splitAmount(amount, allocations).map((p) => [p.fundId, p.amount]));

  return (
    <Box>
      <Box display="flex" height="12px" borderRadius="max" overflow="hidden" gap="spacing.1">
        {allocations
          .filter((a) => a.pct > 0)
          .map((a) => (
            <div key={a.fundId} style={{ width: `${a.pct}%`, backgroundColor: fundColor(theme, a.fundId), transition: `width ${theme.motion.duration.moderate}ms ${theme.motion.easing.standard}` }} />
          ))}
      </Box>

      <Box display="flex" flexDirection="column" marginTop="spacing.3">
        {allocations.map((a, i) => {
          const f = fundById[a.fundId];
          return (
            <Box key={a.fundId} paddingY="spacing.4" borderTopWidth={i === 0 ? 'none' : 'thin'} borderTopColor="surface.border.gray.subtle">
              <Box display="flex" alignItems="flex-start" gap="spacing.3">
                <div style={{ width: 10, height: 10, marginTop: 6, flexShrink: 0, borderRadius: theme.border.radius.round, backgroundColor: fundColor(theme, a.fundId) }} />
                <Box flex={1}>
                  <Link size="medium" color="neutral" icon={ChevronRightIcon} iconPosition="right" onClick={() => onOpenFund(a.fundId)}>
                    {f.name}
                  </Link>
                  <Text size="xsmall" color="surface.text.gray.muted" marginTop="spacing.1">
                    {f.kind} · {f.rating}★ rated
                  </Text>
                </Box>
                <Amount value={amounts.get(a.fundId) ?? 0} size="medium" weight="semibold" suffix="none" />
              </Box>

              <Box display="flex" alignItems="center" justifyContent="space-between" marginTop="spacing.3" paddingLeft="spacing.6">
                <Box display="flex" alignItems="center" gap="spacing.4">
                  <IconButton icon={MinusIcon} size="large" emphasis="intense" accessibilityLabel={`Less in ${f.name}`} isDisabled={a.pct <= 0} onClick={() => onPct(a.fundId, a.pct - STEP)} />
                  <Box width="48px" textAlign="center">
                    <Text weight="semibold">{a.pct}%</Text>
                  </Box>
                  <IconButton icon={PlusIcon} size="large" emphasis="intense" accessibilityLabel={`More in ${f.name}`} isDisabled={a.pct >= 100} onClick={() => onPct(a.fundId, a.pct + STEP)} />
                </Box>
                {allocations.length > 1 && <IconButton icon={TrashIcon} size="medium" accessibilityLabel={`Remove ${f.name}`} onClick={() => onRemove(a.fundId)} />}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="spacing.2">
        <Button variant="tertiary" size="small" icon={PlusIcon} onClick={onAdd}>
          Add a fund
        </Button>
        {isCustom && (
          <Link size="small" onClick={onReset}>
            Back to Kosh's split
          </Link>
        )}
      </Box>
    </Box>
  );
}
