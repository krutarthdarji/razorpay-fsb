import {
  Amount,
  Box,
  CheckIcon,
  Collapsible,
  CollapsibleBody,
  CollapsibleLink,
  Divider,
  SparklesIcon,
  Text,
} from '@razorpay/blade/components';
import { bufferBasis, merchant, plan, upcomingOutflows } from '../../data';
import { cashflow, recommendation } from '../../lib/recommendation';
import { formatDay } from '../../lib/dates';
import { formatINR } from '../../lib/format';
import { BalanceSplitBar } from '../../components/BalanceSplitBar';
import { BalanceChart } from './BalanceChart';

function Line({ label, value, sign, strong }: { label: string; value: number; sign?: string; strong?: boolean }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="baseline">
      <Text size="small" weight={strong ? 'semibold' : 'regular'} color={strong ? 'feedback.text.positive.intense' : 'surface.text.gray.muted'}>
        {sign ? `${sign} ` : ''}
        {label}
      </Text>
      <Amount
        value={value}
        size="medium"
        weight="semibold"
        suffix="none"
        color={strong ? 'feedback.text.positive.intense' : undefined}
      />
    </Box>
  );
}

/** How Kosh got to the number. Closed by default: the answer comes first, the working on request. */
export function WhySafe() {
  const r = recommendation;
  const salaries = upcomingOutflows.find((o) => o.id === 'salaries');
  const gst = upcomingOutflows.find((o) => o.id === 'gst');
  const keyDays = [plan.today, salaries?.payments[0].date, gst?.payments[0].date]
    .filter((d): d is string => Boolean(d))
    .map(formatDay);

  return (
    <Collapsible>
      <CollapsibleLink>{`Why ${formatINR(r.safe)} is safe`}</CollapsibleLink>
      <CollapsibleBody>
        <Box display="flex" flexDirection="column" gap="spacing.3" paddingTop="spacing.4">
          <Line label="Balance today" value={merchant.balance} />
          <Line label={`Payments due in ${r.days} days`} value={r.scheduled} sign="−" />
          <Line label="Safety buffer, sized by Kosh" value={r.buffer} sign="−" />
          <Divider />
          <Line label="Safe to invest" value={r.safe} strong />
        </Box>

        <Box marginTop="spacing.5">
          <BalanceSplitBar due={r.scheduled} buffer={r.buffer} safe={r.safe} />
        </Box>

        <Box marginTop="spacing.6">
          <Box display="flex" alignItems="center" gap="spacing.2">
            <SparklesIcon size="small" color="surface.icon.primary.normal" />
            <Text size="small" weight="semibold">
              How Kosh sized your buffer
            </Text>
          </Box>
          <Text size="xsmall" color="surface.text.gray.muted" marginTop="spacing.1">
            From your own account history, not a rule of thumb
          </Text>
          <Box display="flex" flexDirection="column" gap="spacing.3" marginTop="spacing.3">
            {bufferBasis.map((b) => (
              <Box key={b.id} display="flex" justifyContent="space-between" alignItems="center" gap="spacing.3">
                <Box>
                  <Text size="small">{b.label}</Text>
                  <Text size="xsmall" color="surface.text.gray.muted">
                    {b.basis}
                  </Text>
                </Box>
                <Amount value={b.amount} size="small" weight="semibold" suffix="none" />
              </Box>
            ))}
          </Box>
        </Box>

        <Box marginTop="spacing.6">
          <Text size="small" weight="semibold">
            Your balance over the next {r.days} days
          </Text>
          <Box marginTop="spacing.3">
            <BalanceChart points={cashflow.balance} invested={r.safe} keyDays={keyDays} />
          </Box>
          <Box display="flex" gap="spacing.2" alignItems="center" marginTop="spacing.3">
            <CheckIcon size="small" color="feedback.icon.positive.intense" />
            <Text size="small" color="feedback.text.positive.intense">
              Every payment covered, with fees you expect to receive
            </Text>
          </Box>
        </Box>
      </CollapsibleBody>
    </Collapsible>
  );
}
