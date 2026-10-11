import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Amount,
  ArrowRightIcon,
  Box,
  Button,
  Card,
  CardBody,
  CheckCircleIcon,
  Heading,
  InstantSettlementIcon,
  Link,
  PlusIcon,
  Text,
} from '@razorpay/blade/components';
import { plan as config } from '../../data';
import type { FundId } from '../../data/funds';
import { formatDay, formatMonths } from '../../lib/dates';
import { formatINR, formatLakh } from '../../lib/format';
import { couldEarn, fundById, funds, holdingsSplit, splitAmount, yearlyPace } from '../../lib/funds';
import { maxInvestable, paymentsAtStake, recommendation, standing } from '../../lib/recommendation';
import type { CashEvent } from '../../lib/forecast';
import { useDemo } from '../../state/demo';
import { usePlan } from '../../state/plan';
import { paths } from '../../routes';
import { ActionBar } from '../../components/app/ActionBar';
import { TimeMachine } from '../../components/app/TimeMachine';
import { CycleComplete } from '../../components/app/CycleComplete';
import { CycleGrowth } from '../../components/app/CycleGrowth';
import { GrowthProjection } from '../../components/app/GrowthProjection';
import { KoshTag } from '../../components/app/KoshTag';
import { MpinSheet } from '../../components/app/MpinSheet';
import { RangeSlider } from '../../components/app/RangeSlider';
import { Reveal } from '../../components/app/Reveal';
import { PlanEditor } from './PlanEditor';
import { FundList } from './FundList';
import { AddFundSheet } from './AddFundSheet';

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Card padding="spacing.5" elevation="lowRaised">
      <CardBody>
        <Heading size="small">{title}</Heading>
        {subtitle && (
          <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
            {subtitle}
          </Text>
        )}
        <Box marginTop="spacing.4">{children}</Box>
      </CardBody>
    </Card>
  );
}

/** A slider with its label and current value on one line, in body-size type */
function SliderRow({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="baseline">
        <Text size="small" color="surface.text.gray.muted">
          {label}
        </Text>
        <Text weight="semibold">{value}</Text>
      </Box>
      <Box marginTop="spacing.2">{children}</Box>
    </Box>
  );
}

/** The payments that may need invested money back */
function PaymentsList({ payments }: { payments: CashEvent[] }) {
  if (!payments.length) return null;
  return (
    <Box marginTop="spacing.2" display="flex" flexDirection="column" gap="spacing.1">
      {payments.slice(0, 3).map((e) => (
        <Box key={e.id} display="flex" justifyContent="space-between">
          <Text size="small">
            {formatDay(e.date)} · {e.label}
          </Text>
          <Text size="small" weight="semibold">
            {formatINR(e.amount)}
          </Text>
        </Box>
      ))}
      {payments.length > 3 && (
        <Text size="xsmall" color="surface.text.gray.muted">
          and {payments.length - 3} more
        </Text>
      )}
    </Box>
  );
}

/**
 * Invest through Kosh. What the page shows depends on where the merchant stands:
 * nothing invested or below Kosh's recommendation (Kosh recommends, sliders on top),
 * invested as recommended (a confirmation, nothing pre-filled), or above it
 * (which payments may need money back). Money only goes into liquid and short-term debt funds.
 */
export function Kosh() {
  const navigate = useNavigate();
  const { totalInvested, value, earned, finished, holdings, invest, startFlow } = useDemo();
  const plan = usePlan();
  const [adding, setAdding] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Kosh's assessment looks only at what is actually invested, against its recommendation
  // for the cycle. It never reacts to the sliders: the merchant is free to choose, and
  // Kosh weighs in again once the order is placed.
  /** Months Kosh's cycle has left */
  const period = recommendation.months;
  const s = standing(totalInvested);
  /** Kosh recommends investing (more), so its amount and split are pre-filled */
  const recommending = !finished && (s.status === 'none' || s.status === 'under');
  // Once the cycle is over the demo is done: nothing more to set up
  const composing = !finished && (recommending || plan.isExtra);

  // The order being set up. Plain inputs: an amount, capped at what the account can spare, and a duration.
  const months = plan.months ?? period;
  const maxMore = maxInvestable(totalInvested);
  const canAdd = maxMore >= config.slider.min;
  const sliderMax = Math.max(config.slider.min, maxMore);
  // With nothing to recommend, the slider starts at its smallest amount
  const wanted = plan.isExtra ? (plan.amount ?? 0) : (plan.amount ?? Math.max(s.remaining, config.slider.min));
  const amount = canAdd ? Math.min(wanted, maxMore) : 0;
  const changed = plan.amount !== null || plan.months !== null;

  const parts = splitAmount(amount, plan.allocations);
  const belowMin = parts.find((p) => p.amount < fundById[p.fundId].minInvestment);
  const inPlan = new Set(plan.allocations.map((a) => a.fundId));
  const canInvest = amount > 0 && parts.length > 0 && !belowMin;
  const openFund = (id: FundId) => navigate(paths.fund(id));
  const heldPace = yearlyPace(holdingsSplit(holdings));

  return (
    <Box minHeight="100%" display="flex" flexDirection="column">
      <Box padding="spacing.5" display="flex" flexDirection="column" gap="spacing.5" flex={1}>
        {/* 1. Where the merchant stands */}
        <Reveal index={0}>
          {finished ? (
            <CycleComplete />
          ) : recommending ? (
            <Card padding="spacing.5" elevation="midRaised">
              <CardBody>
                <KoshTag size="large" label="Kosh recommends" />
                <Box marginTop="spacing.4">
                  {s.status === 'none' && s.recommended === 0 ? (
                    <Text size="large" weight="semibold">
                      Your payments need what's in the account right now. You can still invest a little.
                    </Text>
                  ) : s.status === 'none' ? (
                    <Text size="large" weight="semibold">
                      Invest {formatINR(s.recommended)} of your surplus for {formatMonths(period)}.
                    </Text>
                  ) : (
                    <>
                      <Text size="large" weight="semibold">
                        {formatINR(s.remaining)} more of your surplus can grow.
                      </Text>
                      <Text color="surface.text.gray.muted" marginTop="spacing.1">
                        You've invested {formatINR(totalInvested)}. Kosh recommends {formatINR(s.recommended)} for the next {formatMonths(period)}.
                      </Text>
                    </>
                  )}
                  <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
                    More returns than idle cash, and 100% liquid.{' '}
                    <Link size="small" onClick={() => navigate(paths.liquidity)}>
                      See why
                    </Link>
                  </Text>
                </Box>

                {!canAdd && (
                  <Box marginTop="spacing.4" padding="spacing.4" borderRadius="large" backgroundColor="surface.background.gray.moderate">
                    <Text size="small">Nothing more can be invested right now. This month's payments and Kosh's cushion need what's in the account.</Text>
                  </Box>
                )}
                {canAdd && (
                <Box marginTop="spacing.6" display="flex" flexDirection="column" gap="spacing.4">
                  <SliderRow label={s.status === 'under' ? 'Add' : 'Amount'} value={formatINR(amount)}>
                    <RangeSlider
                      accessibilityLabel="Amount to invest"
                      min={config.slider.min}
                      max={sliderMax}
                      step={config.slider.step}
                      value={Math.min(amount, sliderMax)}
                      marker={s.remaining > 0 ? Math.min(s.remaining, sliderMax) : undefined}
                      onChange={plan.setAmount}
                      formatLabel={formatLakh}
                    />
                  </SliderRow>
                  <SliderRow label="Duration" value={formatMonths(months)}>
                    <RangeSlider
                      accessibilityLabel="How long to invest"
                      min={config.minMonths}
                      max={config.maxMonths}
                      step={1}
                      value={months}
                      marker={period}
                      onChange={plan.setMonths}
                      formatLabel={(m) => `${m} mo`}
                    />
                  </SliderRow>
                </Box>
                )}

                {canAdd && changed && (
                  <Box marginTop="spacing.3">
                    <Link size="small" onClick={plan.resetPlan}>
                      Back to Kosh's recommendation
                    </Link>
                  </Box>
                )}
              </CardBody>
            </Card>
          ) : s.status === 'at' ? (
            <Box padding="spacing.6" borderRadius="2xlarge" backgroundColor="feedback.background.positive.subtle" borderWidth="thin" borderColor="interactive.border.positive.default">
              <Box display="flex" alignItems="center" gap="spacing.3">
                <CheckCircleIcon size="2xlarge" color="feedback.icon.positive.intense" />
                <Heading size="large" color="feedback.text.positive.intense">
                  You're invested as Kosh recommends
                </Heading>
              </Box>
              <Text size="large" weight="semibold" marginTop="spacing.4">
                Your idle cash is earning returns.
              </Text>
              <Text color="surface.text.gray.muted" marginTop="spacing.1">
                {formatINR(totalInvested)} for the next {formatMonths(period)}, earning about {formatINR(couldEarn(value, heldPace, 1))} a day.
                {earned > 0 ? ` It has grown to about ${formatINR(value)} so far.` : ''} Still 100% liquid.
              </Text>
              <Box display="flex" flexDirection="column" gap="spacing.3" marginTop="spacing.5">
                <Button isFullWidth icon={ArrowRightIcon} iconPosition="right" onClick={() => navigate(paths.portfolio)}>
                  View portfolio
                </Button>
                {!plan.isExtra && (
                  <Button isFullWidth variant="secondary" icon={PlusIcon} onClick={plan.startExtra}>
                    Want to invest more?
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Box padding="spacing.6" borderRadius="2xlarge" backgroundColor="feedback.background.notice.subtle" borderWidth="thin" borderColor="surface.border.gray.subtle">
              <KoshTag size="large" label="Kosh suggests a look" />
              <Text size="large" weight="semibold" marginTop="spacing.4">
                You might need to withdraw {formatINR(s.excess)}.
              </Text>
              <Text color="surface.text.gray.muted" marginTop="spacing.1">
                You've invested {formatINR(totalInvested)}. Kosh recommends {formatINR(s.recommended)} for the next {formatMonths(period)}. These payments may need the rest:
              </Text>
              <PaymentsList payments={paymentsAtStake(totalInvested)} />
              <Text size="small" color="surface.text.gray.muted" marginTop="spacing.3">
                No rush: withdrawing is instant, and your money keeps earning until then.
              </Text>
              <Box display="flex" flexDirection="column" gap="spacing.3" marginTop="spacing.5">
                <Button isFullWidth onClick={() => navigate(paths.portfolio)}>
                  Go to withdraw
                </Button>
                {!plan.isExtra && (
                  <Button isFullWidth variant="tertiary" icon={PlusIcon} onClick={plan.startExtra}>
                    Invest more anyway
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Reveal>

        {/* 2. Investing beyond the recommendation: starts at zero, nothing pre-picked */}
        {plan.isExtra && !recommending && !finished && (
          <Reveal index={1}>
            <Panel title="Invest more" subtitle={`For the same ${formatMonths(period)}. Pick an amount and your funds.`}>
              {canAdd ? (
                <SliderRow label="Amount" value={formatINR(amount)}>
                  <RangeSlider
                    accessibilityLabel="Amount to invest"
                    min={0}
                    max={maxMore}
                    step={config.slider.step}
                    value={amount}
                    onChange={plan.setAmount}
                    formatLabel={(v) => (v === 0 ? '₹0' : formatLakh(v))}
                  />
                </SliderRow>
              ) : (
                <Text size="small">Nothing more can be invested right now. This month's payments and Kosh's cushion need what's in the account.</Text>
              )}
              <Box marginTop="spacing.3">
                <Link size="small" onClick={plan.resetPlan}>
                  Not now
                </Link>
              </Box>
            </Panel>
          </Reveal>
        )}

        {/* 3. The split */}
        {composing && (
          <Reveal index={2}>
            {plan.allocations.length === 0 ? (
              <Panel title="Choose your funds" subtitle="Nothing is picked for you here. Add one or more funds.">
                <Button isFullWidth variant="secondary" icon={PlusIcon} onClick={() => setAdding(true)}>
                  Add a fund
                </Button>
              </Panel>
            ) : (
              <Panel
                title={plan.isCustom ? 'Your split' : "Kosh's recommended split"}
                subtitle={plan.isCustom ? 'Tap − or + to change a share.' : 'Half in a top-rated liquid fund, half in a top-rated short-term debt fund. Change it if you like.'}
              >
                <PlanEditor
                  amount={amount}
                  allocations={plan.allocations}
                  isCustom={plan.isCustom && !plan.isExtra}
                  onPct={plan.setPct}
                  onRemove={plan.removeFund}
                  onReset={plan.resetSplit}
                  onAdd={() => setAdding(true)}
                  onOpenFund={openFund}
                />
              </Panel>
            )}
          </Reveal>
        )}

        {/* 4. Projected growth for the investment period */}
        {composing && amount > 0 && plan.allocations.length > 0 && (
          <Reveal index={3}>
            <Panel title="Projected growth" subtitle={`How ${formatINR(amount)} could grow over ${formatMonths(months)}`}>
              <GrowthProjection amount={amount} pace={yearlyPace(plan.allocations)} months={months} />
            </Panel>
          </Reveal>
        )}
        {!composing && !finished && (
          <Reveal index={3}>
            <Panel title="Your investment is growing" subtitle={`Across Kosh's ${formatMonths(config.recommendMonths)}`}>
              <CycleGrowth />
            </Panel>
          </Reveal>
        )}

        {/* 5. Liquidity */}
        <Reveal index={4}>
          <Box display="flex" gap="spacing.3" alignItems="flex-start" padding="spacing.5" borderRadius="xlarge" backgroundColor="surface.background.primary.subtle">
            <InstantSettlementIcon size="large" color="surface.icon.primary.normal" />
            <Box>
              <Text weight="semibold">100% liquid, always</Text>
              <Text size="small" color="surface.text.gray.muted">
                Withdraw any time. Razorpay credits you instantly, with {config.freeCreditDays} day of free credit until the fund pays out.
              </Text>
            </Box>
          </Box>
        </Reveal>

        {/* 6. Every fund Kosh can use */}
        <Reveal index={5}>
          <Panel title="Funds Kosh invests in" subtitle="Only liquid and short-term debt funds. No shares, no lock-in.">
            <Text size="xsmall" weight="semibold" color="surface.text.primary.normal">
              LIQUID FUNDS
            </Text>
            <FundList funds={funds.filter((f) => f.group === 'liquid')} onOpen={openFund} />
            <Text size="xsmall" weight="semibold" color="surface.text.primary.normal" marginTop="spacing.4">
              SHORT-TERM DEBT FUNDS · NO EXIT LOAD
            </Text>
            <FundList funds={funds.filter((f) => f.group === 'debt')} onOpen={openFund} />
          </Panel>
        </Reveal>

        <TimeMachine />

        <Text size="xsmall" color="surface.text.gray.muted" textAlign="center">
          Returns shown are past returns and are not guaranteed. Mutual fund investments are subject to market risks.
        </Text>
      </Box>

      {composing && canAdd && (
        <ActionBar>
          {belowMin && (
            <Text size="small" color="feedback.text.notice.intense" marginBottom="spacing.3">
              {fundById[belowMin.fundId].name} needs at least {formatINR(fundById[belowMin.fundId].minInvestment)}. Give it a bigger share or remove it.
            </Text>
          )}
          <Button
            isFullWidth
            size="large"
            icon={ArrowRightIcon}
            iconPosition="right"
            isDisabled={!canInvest}
            onClick={() => {
              startFlow();
              setConfirming(true);
            }}
          >
            {amount > 0 ? `Invest ${formatINR(amount)}${totalInvested > 0 ? ' more' : ` for ${formatMonths(months)}`}` : 'Pick an amount to invest'}
          </Button>
        </ActionBar>
      )}

      <AddFundSheet
        isOpen={adding}
        onDismiss={() => setAdding(false)}
        funds={funds.filter((f) => !inPlan.has(f.id))}
        onAdd={(id) => {
          plan.addFund(id);
          setAdding(false);
        }}
        onOpen={(id) => {
          setAdding(false);
          openFund(id);
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
              for {formatMonths(months)}, across {parts.length} fund{parts.length === 1 ? '' : 's'}, from your RazorpayX current account
            </Text>
          </>
        }
        onConfirmed={() => {
          // Adding without touching the duration keeps the period already chosen
          invest(parts, months, totalInvested > 0 && plan.months === null);
          plan.resetPlan();
          setConfirming(false);
          navigate(paths.order);
        }}
      />
    </Box>
  );
}
