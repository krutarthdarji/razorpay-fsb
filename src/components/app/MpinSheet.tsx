import { useEffect, useState } from 'react';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetHeader,
  Box,
  LockIcon,
  OTPInput,
  Spinner,
  Text,
  useTheme,
} from '@razorpay/blade/components';
import { SheetPortal } from './SheetLayer';
import { SHEET_Z } from './layers';

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
  title: string;
  /** One or two lines on what is being confirmed */
  summary: React.ReactNode;
  onConfirmed: () => void;
};

/** Confirm with the same 4-digit MPIN used for payouts. Any 4 digits work in the prototype. */
export function MpinSheet({ isOpen, onDismiss, title, summary, onConfirmed }: Props) {
  const { theme } = useTheme();
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPin('');
      setProcessing(false);
    }
  }, [isOpen]);

  const onFilled = () => {
    setProcessing(true);
    // A short beat so the confirmation feels real
    setTimeout(onConfirmed, theme.motion.duration['2xgentle']);
  };

  return (
    <SheetPortal>
    <BottomSheet isOpen={isOpen} onDismiss={onDismiss} zIndex={SHEET_Z} snapPoints={[0.6, 0.8, 0.95]}>
      <BottomSheetHeader title={title} />
      <BottomSheetBody>
        <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.5" paddingBottom="spacing.5">
          <Box textAlign="center">{summary}</Box>
          {processing ? (
            <Box display="flex" alignItems="center" gap="spacing.3" paddingY="spacing.4">
              <Spinner accessibilityLabel="Placing order" size="medium" />
              <Text color="surface.text.gray.muted">Confirming…</Text>
            </Box>
          ) : (
            <OTPInput
              label="Enter your MPIN"
              otpLength={4}
              isMasked
              autoFocus
              value={pin}
              onChange={({ value }) => setPin(value ?? '')}
              onOTPFilled={onFilled}
              helpText="Prototype: any 4 digits"
            />
          )}
          <Box display="flex" alignItems="center" gap="spacing.2">
            <LockIcon size="small" color="surface.icon.gray.muted" />
            <Text size="xsmall" color="surface.text.gray.muted">
              Same MPIN you use to approve payouts
            </Text>
          </Box>
        </Box>
      </BottomSheetBody>
    </BottomSheet>
    </SheetPortal>
  );
}
