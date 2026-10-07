import { useEffect, useState } from 'react';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetHeader,
  Box,
  Button,
  InstantSettlementIcon,
  Text,
  TextInput,
} from '@razorpay/blade/components';
import { SheetPortal } from '../../components/app/SheetLayer';
import { SHEET_Z } from '../../components/app/layers';
import { formatINR } from '../../lib/format';

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
  /** Current value of the holding: the most that can be withdrawn */
  maxAmount: number;
  onContinue: (amount: number) => void;
};

/** Pick how much to take back. Instant credit means it lands now, free for a day. */
export function WithdrawSheet({ isOpen, onDismiss, maxAmount, onContinue }: Props) {
  const [raw, setRaw] = useState(String(maxAmount));

  useEffect(() => {
    if (isOpen) setRaw(String(maxAmount));
  }, [isOpen, maxAmount]);

  const amount = Number(raw.replace(/[^0-9]/g, '')) || 0;
  const invalid = amount <= 0 || amount > maxAmount;

  return (
    <SheetPortal>
    <BottomSheet isOpen={isOpen} onDismiss={onDismiss} zIndex={SHEET_Z} snapPoints={[0.6, 0.8, 0.95]}>
      <BottomSheetHeader title="Withdraw" subtitle={`Up to ${formatINR(maxAmount)}`} />
      <BottomSheetBody>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <TextInput
            label="Amount"
            prefix="₹"
            type="number"
            value={raw}
            onChange={({ value }) => setRaw(value ?? '')}
            validationState={invalid ? 'error' : 'none'}
            errorText={`Enter up to ${formatINR(maxAmount)}`}
          />
          <Box display="flex" gap="spacing.3" alignItems="flex-start" padding="spacing.4" borderRadius="large" backgroundColor="feedback.background.positive.subtle">
            <InstantSettlementIcon size="medium" color="feedback.icon.positive.intense" />
            <Box>
              <Text size="small" weight="semibold" color="feedback.text.positive.intense">
                Instant credit, free for a day
              </Text>
              <Text size="small" color="feedback.text.positive.intense" marginTop="spacing.1">
                Razorpay puts the money in your account now and settles with the fund tomorrow. No charge.
              </Text>
            </Box>
          </Box>
        </Box>
      </BottomSheetBody>
      <BottomSheetFooter>
        <Button isFullWidth isDisabled={invalid} onClick={() => onContinue(amount)}>
          {`Withdraw ${formatINR(amount)}`}
        </Button>
      </BottomSheetFooter>
    </BottomSheet>
    </SheetPortal>
  );
}
