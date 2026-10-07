import { useEffect, useState } from 'react';
import {
  Alert,
  Amount,
  BottomSheet,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetHeader,
  Box,
  Button,
  Radio,
  RadioGroup,
  Text,
} from '@razorpay/blade/components';
import { SheetPortal } from '../../components/app/SheetLayer';
import { SHEET_Z } from '../../components/app/layers';
import { investOptions, plan, upcomingOutflows } from '../../data';
import { AmountSlider } from '../../components/app/AmountSlider';
import type { InvestOptionId } from '../../data';
import { earnings, isAboveSafe } from '../../lib/forecast';
import { formatDay } from '../../lib/dates';
import { formatINR, formatLakh } from '../../lib/format';

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
  safe: number;
  days: number;
  amount: number;
  optionId: InvestOptionId;
  onApply: (amount: number, optionId: InvestOptionId) => void;
};

const choices: InvestOptionId[] = ['liquid', 'overnight'];

/** Optional: change the amount or the fund. Never in the way of the one-tap default. */
export function CustomiseSheet({ isOpen, onDismiss, safe, days, amount, optionId, onApply }: Props) {
  const [draftAmount, setDraftAmount] = useState(amount);
  const [draftOption, setDraftOption] = useState(optionId);

  useEffect(() => {
    if (isOpen) {
      setDraftAmount(amount);
      setDraftOption(optionId);
    }
  }, [isOpen, amount, optionId]);

  const salaries = upcomingOutflows.find((o) => o.id === 'salaries');
  const above = isAboveSafe(draftAmount, safe);

  return (
    <SheetPortal>
    <BottomSheet isOpen={isOpen} onDismiss={onDismiss} zIndex={SHEET_Z} snapPoints={[0.85, 0.9, 0.95]}>
      <BottomSheetHeader title="Customise" subtitle="Kosh's pick stays the default" />
      <BottomSheetBody>
        <Box display="flex" flexDirection="column" gap="spacing.6">
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="baseline">
              <Text size="small" color="surface.text.gray.muted">
                Amount
              </Text>
              <Amount value={draftAmount} type="heading" size="medium" weight="semibold" suffix="none" />
            </Box>
            <Box marginTop="spacing.4">
              <AmountSlider
                accessibilityLabel="Amount to invest"
                min={plan.slider.min}
                max={plan.slider.max}
                step={plan.slider.step}
                value={draftAmount}
                recommended={safe}
                onChange={setDraftAmount}
                formatLabel={formatLakh}
              />
            </Box>
            {above && (
              <Box marginTop="spacing.4">
                <Alert
                  color="notice"
                  isFullWidth
                  description={`Above the safe amount. Less cushion before salaries on ${salaries ? formatDay(salaries.payments[0].date) : 'payday'}.`}
                />
              </Box>
            )}
          </Box>

          <RadioGroup label="Fund" value={draftOption} onChange={({ value }) => setDraftOption(value as InvestOptionId)}>
            {choices.map((id) => {
              const o = investOptions[id];
              return (
                <Radio key={id} value={id} helpText={`${o.note} Earns about ${formatINR(earnings(draftAmount, o.annualRatePct, days))} in ${days} days.`}>
                  {o.isRecommended ? `${o.name} (recommended)` : o.name}
                </Radio>
              );
            })}
          </RadioGroup>
        </Box>
      </BottomSheetBody>
      <BottomSheetFooter>
        <Button isFullWidth onClick={() => onApply(draftAmount, draftOption)}>
          Done
        </Button>
      </BottomSheetFooter>
    </BottomSheet>
    </SheetPortal>
  );
}
