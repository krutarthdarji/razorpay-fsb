import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Amount, ArrowRightIcon, Box, Button, Card, CardBody, Heading, Text } from '@razorpay/blade/components';
import { investOptions } from '../../data';
import type { InvestOptionId } from '../../data';
import { earnings } from '../../lib/forecast';
import { formatDay } from '../../lib/dates';
import { formatINR } from '../../lib/format';
import { recommendation } from '../../lib/recommendation';
import { useDemo } from '../../state/demo';
import { paths } from '../../routes';
import { AgentMessage } from '../../components/app/AgentMessage';
import { ActionBar } from '../../components/app/ActionBar';
import { EarningsCompare } from '../../components/app/EarningsCompare';
import { MpinSheet } from '../../components/app/MpinSheet';
import { Reveal } from '../../components/app/Reveal';
import { FundCard } from './FundCard';
import { WhySafe } from './WhySafe';
import { CustomiseSheet } from './CustomiseSheet';

/** Kosh's recommendation: the answer first, one tap to act, the working on request */
export function Kosh() {
  const navigate = useNavigate();
  const { investment, invest, startFlow } = useDemo();
  const r = recommendation;

  const [amount, setAmount] = useState(r.safe);
  const [optionId, setOptionId] = useState<InvestOptionId>(r.option.id);
  const [customising, setCustomising] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const option = investOptions[optionId];
  const isDefault = amount === r.safe && optionId === r.option.id;

  // Already invested: Kosh has nothing new to recommend today
  if (investment) {
    return (
      <Box padding="spacing.5">
        <Reveal>
          <Card padding="spacing.5" elevation="midRaised">
            <CardBody>
              <AgentMessage instant caption="all set">
                <Heading size="medium">You're all set.</Heading>
                <Text color="surface.text.gray.muted" marginTop="spacing.3">
                  {formatINR(investment.amount)} is in {investOptions[investment.optionId].name}. Units allotted on{' '}
                  {formatDay(r.allotmentDate)}. I'll nudge you the next time cash sits idle.
                </Text>
                <Box marginTop="spacing.5">
                  <Button isFullWidth variant="secondary" icon={ArrowRightIcon} iconPosition="right" onClick={() => navigate(paths.portfolio)}>
                    View portfolio
                  </Button>
                </Box>
              </AgentMessage>
            </CardBody>
          </Card>
        </Reveal>
      </Box>
    );
  }

  return (
    <Box minHeight="100%" display="flex" flexDirection="column">
      <Box padding="spacing.5" display="flex" flexDirection="column" gap="spacing.5" flex={1}>
        <Reveal index={0}>
          <AgentMessage instant caption="recommendation">
            <Text color="surface.text.gray.muted">Safe to invest for {r.days} days</Text>
            <Amount value={amount} type="display" size="small" weight="semibold" suffix="none" />
            {!isDefault && (
              <Text size="small" color="surface.text.primary.normal" marginTop="spacing.1">
                Customised. Kosh recommends {formatINR(r.safe)} in {r.option.name}.
              </Text>
            )}
          </AgentMessage>
        </Reveal>

        <Reveal index={1}>
          <FundCard option={option} days={r.days} />
        </Reveal>

        <Reveal index={2}>
          <Card padding="spacing.5" elevation="lowRaised">
            <CardBody>
              <Text size="small" weight="semibold">
                What {formatINR(amount)} earns in {r.days} days
              </Text>
              <Box marginTop="spacing.4">
                <EarningsCompare
                  rows={[
                    { label: option.name, value: earnings(amount, option.annualRatePct, r.days), isBest: true },
                    { label: 'Sweep FD', value: earnings(amount, investOptions.sweepFd.annualRatePct, r.days) },
                    { label: 'Left idle', value: 0 },
                  ]}
                />
              </Box>
            </CardBody>
          </Card>
        </Reveal>

        <Reveal index={3}>
          <Card padding="spacing.5" elevation="lowRaised">
            <CardBody>
              <WhySafe />
            </CardBody>
          </Card>
        </Reveal>

        <Text size="xsmall" color="surface.text.gray.muted" textAlign="center">
          Returns are illustrative and before tax. Mutual funds are subject to market risks.
        </Text>
      </Box>

      <ActionBar>
        <Box display="flex" gap="spacing.3">
          <Button variant="secondary" size="large" onClick={() => setCustomising(true)}>
            Customise
          </Button>
          <Box flex={1}>
            <Button
              isFullWidth
              size="large"
              onClick={() => {
                startFlow();
                setConfirming(true);
              }}
            >
              {`Invest ${formatINR(amount)}`}
            </Button>
          </Box>
        </Box>
      </ActionBar>

      <CustomiseSheet
        isOpen={customising}
        onDismiss={() => setCustomising(false)}
        safe={r.safe}
        days={r.days}
        amount={amount}
        optionId={optionId}
        onApply={(a, o) => {
          setAmount(a);
          setOptionId(o);
          setCustomising(false);
        }}
      />

      <MpinSheet
        isOpen={confirming}
        onDismiss={() => setConfirming(false)}
        title="Confirm investment"
        summary={
          <>
            <Amount value={amount} type="heading" size="large" weight="semibold" suffix="none" />
            <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
              into {option.name}, from your RazorpayX current account
            </Text>
          </>
        }
        onConfirmed={() => {
          invest(amount, optionId);
          setConfirming(false);
          navigate(paths.order);
        }}
      />
    </Box>
  );
}
