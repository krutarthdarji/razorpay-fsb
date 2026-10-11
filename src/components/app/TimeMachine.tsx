import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Amount,
  BottomSheet,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetHeader,
  Box,
  Button,
  ClockIcon,
  Divider,
  SkipForwardIcon,
  Text,
} from '@razorpay/blade/components';
import { formatDay, formatMonths, formatWeekday } from '../../lib/dates';
import { formatApprox, formatINR } from '../../lib/format';
import { cycle } from '../../lib/recommendation';
import { useDemo } from '../../state/demo';
import { paths } from '../../routes';
import { SheetPortal } from './SheetLayer';
import { SHEET_Z } from './layers';

/** Dashed, so it reads as a demo tool and not part of the product */
const Frame = styled.div(({ theme }) => ({
  padding: theme.spacing[5],
  borderRadius: theme.border.radius.xlarge,
  border: `${theme.border.width.thin}px dashed ${theme.colors.surface.border.gray.normal}`,
  backgroundColor: theme.colors.surface.background.gray.intense,
}));

/** One segment per month of the cycle, filled as the months pass */
const Segment = styled.div<{ $done: boolean }>(({ theme, $done }) => ({
  flex: 1,
  height: theme.spacing[2],
  borderRadius: theme.border.radius.max,
  backgroundColor: $done ? theme.colors.feedback.background.positive.intense : theme.colors.surface.background.gray.moderate,
}));

/**
 * Demo controls: move the clock forward to see what happens next. Everything in the
 * account (balance, fees in, payments out, the investment's value) follows the date.
 *
 * The demo plays one cycle: Kosh's recommendation, month by month, to its end. The
 * buttons are offered only while the merchant is invested as Kosh recommends; off that
 * path, the card says how to get back. When the cycle is over, the screens show
 * `CycleComplete` instead.
 */
export function TimeMachine() {
  const { today, holdings, totalInvested, value, earned, asRecommended, cycleMonth, finished, pendingAllotment, skipToAllotment, skipMonth } = useDemo();
  if (!holdings.length || finished) return null;

  return (
    <Frame>
      <Box display="flex" alignItems="center" gap="spacing.2">
        <ClockIcon size="small" color="surface.icon.gray.muted" />
        <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">
          DEMO CONTROLS
        </Text>
      </Box>
      <Text size="small" marginTop="spacing.2">
        Today in this demo: <Text as="span" size="small" weight="semibold">{formatWeekday(today)}</Text>
      </Text>

      <Box display="flex" gap="spacing.1" marginTop="spacing.3">
        {cycle.stops.map((stop, i) => (
          <Segment key={stop} $done={i < cycleMonth} />
        ))}
      </Box>
      <Text size="xsmall" color="surface.text.gray.muted" marginTop="spacing.2">
        {cycleMonth} of {formatMonths(cycle.months)} done. The demo ends on {formatDay(cycle.until)}.
        {earned > 0 ? ` ${formatINR(totalInvested)} has grown to about ${formatINR(value)}.` : ''}
      </Text>

      {asRecommended ? (
        <Box display="flex" flexDirection="column" gap="spacing.3" marginTop="spacing.4">
          {pendingAllotment && (
            <Button isFullWidth variant="secondary" size="small" icon={SkipForwardIcon} onClick={skipToAllotment}>
              {`Fast-forward to allotment (${formatWeekday(pendingAllotment)})`}
            </Button>
          )}
          <Button isFullWidth variant="secondary" size="small" icon={SkipForwardIcon} onClick={skipMonth}>
            Fast-forward 1 month
          </Button>
        </Box>
      ) : (
        <Text size="xsmall" color="surface.text.gray.muted" marginTop="spacing.3">
          Fast-forward is available when your investment matches Kosh's recommendation of {formatINR(cycle.amount)}.
        </Text>
      )}
    </Frame>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="baseline" gap="spacing.3">
      <Text size="small" color="surface.text.gray.muted">
        {label}
      </Text>
      {children}
    </Box>
  );
}

/** What happened while the clock moved: money in, money out, the balance, and the investment */
export function JumpSheet() {
  const { lastJump: j, dismissJump, totalInvested, earned } = useDemo();
  const navigate = useNavigate();
  if (!j) return null;
  const monthsDone = cycle.stops.filter((d) => d <= j.to).length;
  const final = j.to >= cycle.until;
  const title = j.kind === 'allotment' ? 'Units allotted' : final ? `${formatMonths(cycle.months)} done: cycle complete` : `Month ${monthsDone} of ${cycle.months} done`;
  // The last fast-forward ends the demo: go to Home, where the result is
  const close = () => {
    dismissJump();
    if (final) navigate(paths.home);
  };
  const moneyIn = j.events.filter((e) => e.kind === 'in');
  const moneyOut = j.events.filter((e) => e.kind === 'out');
  const total = (list: typeof j.events) => list.reduce((s, e) => s + e.amount, 0);
  const biggest = [...j.events].sort((a, b) => b.amount - a.amount).slice(0, 5).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <SheetPortal>
      <BottomSheet isOpen onDismiss={close} zIndex={SHEET_Z} snapPoints={[0.75, 0.85, 0.95]}>
        <BottomSheetHeader title={title} subtitle={`${formatDay(j.from)} to ${formatDay(j.to)}`} />
        <BottomSheetBody>
          <Box display="flex" flexDirection="column" gap="spacing.5">
            {final && (
              <Box padding="spacing.4" borderRadius="large" backgroundColor="feedback.background.positive.subtle">
                <Text size="small" weight="semibold" color="feedback.text.positive.intense">
                  Kosh's {formatMonths(cycle.months)} are over
                </Text>
                <Text size="small" marginTop="spacing.1">
                  {formatINR(totalInvested)} grew to about {formatINR(j.valueAfter)}. Every payment went through on the way.
                </Text>
              </Box>
            )}

            <Box>
              <Text weight="semibold">Your investment</Text>
              <Box display="flex" flexDirection="column" gap="spacing.2" marginTop="spacing.3">
                <Row label={`On ${formatDay(j.from)}`}>
                  <Text weight="semibold">{formatApprox(j.valueBefore)}</Text>
                </Row>
                <Row label={`On ${formatDay(j.to)}`}>
                  <Text weight="semibold" color="feedback.text.positive.intense">
                    {formatApprox(j.valueAfter)}
                  </Text>
                </Row>
                {j.valueAfter > j.valueBefore && (
                  <Text size="small" color="feedback.text.positive.intense">
                    About {formatINR(j.valueAfter - j.valueBefore)} earned in this stretch, at the funds' recent pace.
                  </Text>
                )}
                {earned > 0 && (
                  <Row label="Earned since you invested">
                    <Text weight="semibold" color="feedback.text.positive.intense">
                      {formatApprox(earned)}
                    </Text>
                  </Row>
                )}
              </Box>
            </Box>

            <Divider />

            <Box>
              <Text weight="semibold">Your current account</Text>
              <Box display="flex" flexDirection="column" gap="spacing.2" marginTop="spacing.3">
                <Row label={`Came in (${moneyIn.length})`}>
                  <Amount value={total(moneyIn)} size="medium" weight="semibold" suffix="none" color="feedback.text.positive.intense" />
                </Row>
                <Row label={`Went out (${moneyOut.length})`}>
                  <Amount value={total(moneyOut)} size="medium" weight="semibold" suffix="none" />
                </Row>
                <Row label="Balance now">
                  <Amount value={j.balanceAfter} size="medium" weight="semibold" suffix="none" />
                </Row>
              </Box>
            </Box>

            {biggest.length > 0 && (
              <Box>
                <Text size="small" weight="semibold" color="surface.text.gray.muted">
                  LARGEST MOVEMENTS
                </Text>
                <Box display="flex" flexDirection="column" gap="spacing.2" marginTop="spacing.3">
                  {biggest.map((e) => (
                    <Box key={e.id} display="flex" justifyContent="space-between" gap="spacing.3">
                      <Text size="small">
                        {formatDay(e.date)} · {e.label}
                      </Text>
                      <Text size="small" weight="semibold" color={e.kind === 'in' ? 'feedback.text.positive.intense' : undefined}>
                        {e.kind === 'in' ? '+' : '−'}
                        {formatINR(e.amount)}
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button isFullWidth onClick={close}>
            {final ? 'See the result' : 'Got it'}
          </Button>
        </BottomSheetFooter>
      </BottomSheet>
    </SheetPortal>
  );
}
