import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  BottomSheet,
  BottomSheetBody,
  BottomSheetHeader,
  Box,
  Button,
  RefreshIcon,
  Text,
  useToast,
} from '@razorpay/blade/components';
import { merchant } from '../../data';
import { useDemo } from '../../state/demo';
import { paths } from '../../routes';
import { SheetPortal } from './SheetLayer';
import { SHEET_Z } from './layers';

/** Opened from the avatar: who's signed in, and a way to start the demo again */
export function AccountSheet({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  const { reset } = useDemo();
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <SheetPortal>
      <BottomSheet isOpen={isOpen} onDismiss={onDismiss} zIndex={SHEET_Z} snapPoints={[0.5, 0.7, 0.9]}>
        <BottomSheetHeader title="Account" />
        <BottomSheetBody>
          <Box display="flex" alignItems="center" gap="spacing.4">
            <Avatar name={merchant.ownerName} size="large" color="primary" />
            <Box>
              <Text weight="semibold">{merchant.ownerName}</Text>
              <Text size="small" color="surface.text.gray.muted">
                {merchant.businessName} · {merchant.accountName}
              </Text>
            </Box>
          </Box>
          <Box marginTop="spacing.7" padding="spacing.5" borderRadius="large" backgroundColor="surface.background.gray.moderate">
            <Text weight="semibold">Reset demo</Text>
            <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
              Clears investments and withdrawals, sets the date back to today, and starts again from Kosh's recommendation.
            </Text>
            <Box marginTop="spacing.4">
              <Button
                isFullWidth
                variant="secondary"
                color="negative"
                icon={RefreshIcon}
                onClick={() => {
                  reset();
                  onDismiss();
                  navigate(paths.home);
                  toast.show({ content: 'Demo reset', color: 'neutral', autoDismiss: true });
                }}
              >
                Reset demo
              </Button>
            </Box>
          </Box>
        </BottomSheetBody>
      </BottomSheet>
    </SheetPortal>
  );
}
