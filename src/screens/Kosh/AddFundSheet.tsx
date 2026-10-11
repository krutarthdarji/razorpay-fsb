import { BottomSheet, BottomSheetBody, BottomSheetHeader, Button } from '@razorpay/blade/components';
import type { Fund, FundId } from '../../data/funds';
import { SheetPortal } from '../../components/app/SheetLayer';
import { SHEET_Z } from '../../components/app/layers';
import { FundList } from './FundList';

type Props = { isOpen: boolean; onDismiss: () => void; funds: Fund[]; onAdd: (id: FundId) => void; onOpen: (id: FundId) => void };

/** Funds not yet in the split. Add one, or open it to read more first. */
export function AddFundSheet({ isOpen, onDismiss, funds, onAdd, onOpen }: Props) {
  return (
    <SheetPortal>
      <BottomSheet isOpen={isOpen} onDismiss={onDismiss} zIndex={SHEET_Z} snapPoints={[0.7, 0.85, 0.95]}>
        <BottomSheetHeader title="Add a fund" subtitle="It starts at 0%. Use + to give it a share." />
        <BottomSheetBody>
          <FundList
            funds={funds}
            onOpen={onOpen}
            trailing={(f) => (
              <Button size="small" variant="secondary" onClick={() => onAdd(f.id)}>
                Add
              </Button>
            )}
          />
        </BottomSheetBody>
      </BottomSheet>
    </SheetPortal>
  );
}
