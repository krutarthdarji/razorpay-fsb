import { useEffect, useState } from 'react';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetHeader,
  Box,
  Button,
  InstantSettlementIcon,
  Radio,
  RadioGroup,
  Text,
  TextInput,
} from '@razorpay/blade/components';
import type { FundId } from '../../data/funds';
import { formatApprox, formatINR } from '../../lib/format';
import { SheetPortal } from '../../components/app/SheetLayer';
import { SHEET_Z } from '../../components/app/layers';

export type WithdrawChoice = { fundId: FundId | null; amount: number };

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
  /** Each fund held, with its approximate value today */
  funds: { fundId: FundId; name: string; value: number }[];
  /** Open with this fund already chosen (from a fund's own Withdraw button) */
  initialFund?: FundId | null;
  onContinue: (choice: WithdrawChoice) => void;
};

const ALL = 'all';

/** Pick where to withdraw from, and how much. Instant credit means it lands now, free for a day. */
export function WithdrawSheet({ isOpen, onDismiss, funds, initialFund = null, onContinue }: Props) {
  const totalValue = funds.reduce((s, f) => s + f.value, 0);
  const [from, setFrom] = useState<string>(initialFund ?? ALL);
  const max = from === ALL ? totalValue : (funds.find((f) => f.fundId === from)?.value ?? 0);
  const [raw, setRaw] = useState(String(max));

  // Opening the sheet, or switching fund, starts from the most that can be taken
  useEffect(() => {
    if (isOpen) setFrom(initialFund ?? ALL);
  }, [isOpen, initialFund]);
  useEffect(() => {
    if (isOpen) setRaw(String(max));
  }, [isOpen, max]);

  // Whole rupees only. Anything that isn't a plain positive number counts as nothing entered.
  const typed = Number(raw);
  const amount = Number.isFinite(typed) && typed > 0 ? Math.floor(typed) : 0;
  const invalid = amount <= 0 || amount > max;

  return (
    <SheetPortal>
      <BottomSheet isOpen={isOpen} onDismiss={onDismiss} zIndex={SHEET_Z} snapPoints={[0.8, 0.9, 0.95]}>
        <BottomSheetHeader title="Withdraw" subtitle="Credited to your current account instantly" />
        <BottomSheetBody>
          <Box display="flex" flexDirection="column" gap="spacing.5">
            <RadioGroup label="Withdraw from" value={from} onChange={({ value }) => setFrom(value)}>
              {funds.length > 1 ? (
                <Radio value={ALL} helpText={`${formatApprox(totalValue)} in all. Taken from each fund in proportion.`}>
                  All funds
                </Radio>
              ) : (
                <></>
              )}
              {funds.map((f) => (
                <Radio key={f.fundId} value={f.fundId} helpText={`${formatApprox(f.value)} available`}>
                  {f.name}
                </Radio>
              ))}
            </RadioGroup>

            <TextInput
              label="Amount"
              prefix="₹"
              type="number"
              value={raw}
              onChange={({ value }) => setRaw(value ?? '')}
              validationState={invalid ? 'error' : 'none'}
              errorText={`Enter up to ${formatINR(max)}`}
              helpText={`Up to ${formatINR(max)}`}
            />

            <Box display="flex" gap="spacing.3" alignItems="flex-start" padding="spacing.4" borderRadius="large" backgroundColor="feedback.background.positive.subtle">
              <InstantSettlementIcon size="medium" color="feedback.icon.positive.intense" />
              <Box>
                <Text size="small" weight="semibold" color="feedback.text.positive.intense">
                  Instant credit, free for a day
                </Text>
                <Text size="small" color="feedback.text.positive.intense" marginTop="spacing.1">
                  Razorpay puts the money in your account now and settles with the fund on the next working day. No charge.
                </Text>
              </Box>
            </Box>
          </Box>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button isFullWidth isDisabled={invalid} onClick={() => onContinue({ fundId: from === ALL ? null : (from as FundId), amount })}>
            {`Withdraw ${formatINR(amount)}`}
          </Button>
        </BottomSheetFooter>
      </BottomSheet>
    </SheetPortal>
  );
}
