import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import {
  Amount,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  ChartArea,
  ChartAreaWrapper,
  ChartCartesianGrid,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  CheckIcon,
  Display,
  Heading,
  SegmentedControl,
  SegmentedControlItem,
  Text,
} from '@razorpay/blade/components';
import { fundsAsOf, type FundId } from '../../data/funds';
import { formatDay } from '../../lib/dates';
import { formatINR, formatPct } from '../../lib/format';
import { fundById, latestNav, lowestStretch, navSeries, periodById, periodReturn, periods, yearlyReturn, type Period } from '../../lib/funds';
import { recommendation } from '../../lib/recommendation';
import { usePlan } from '../../state/plan';
import { paths } from '../../routes';
import { PageTitle } from '../../components/app/PageTitle';
import { useGoBack } from '../../lib/useGoBack';
import { Reveal } from '../../components/app/Reveal';
import { ActionBar } from '../../components/app/ActionBar';

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Text size="xsmall" color="surface.text.gray.muted">
        {label}
      </Text>
      <Box marginTop="spacing.1">{children}</Box>
    </Box>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <Box paddingY="spacing.3" borderTopWidth="thin" borderTopColor="surface.border.gray.subtle">
      <Text size="xsmall" color="surface.text.gray.muted">
        {label}
      </Text>
      <Text size="small" marginTop="spacing.1">
        {value}
      </Text>
    </Box>
  );
}

/** One fund in full: price history from 1 month to 5 years, returns, and the details that matter */
export function FundDetail() {
  const { id } = useParams();
  const goBack = useGoBack(paths.kosh);
  const plan = usePlan();
  const [period, setPeriod] = useState<Period>('1Y');

  const fund = id ? fundById[id as FundId] : undefined;
  if (!fund) return <Navigate to={paths.kosh} replace />;

  const nav = latestNav(fund);
  const total = periodReturn(fund, period);
  const yearly = yearlyReturn(fund, period);
  const isLong = periodById[period].days > 366;
  const series = navSeries(fund, period);
  // Dates are the axis key (day labels repeat across years); three ticks: start, middle, end
  const ticks = [series[0]?.date, series[Math.floor(series.length / 2)]?.date, series[series.length - 1]?.date].filter(Boolean) as string[];
  const tickLabel = (iso: string) =>
    isLong ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { month: 'short', year: '2-digit', timeZone: 'UTC' }) : formatDay(iso);
  // Zoom the y-axis to the data; a zero baseline would flatten the line
  const navs = series.map((p) => p.nav);
  const lo = Math.min(...navs);
  const hi = Math.max(...navs);
  const pad = (hi - lo) * 0.15 || hi * 0.01;
  const digits = hi - lo < 5 ? 2 : hi - lo < 50 ? 1 : 0;
  const example = recommendation.amount;
  const inPlan = plan.allocations.find((a) => a.fundId === fund.id);
  const lowestMonth = lowestStretch(fund, 30);

  return (
    <Box minHeight="100%" display="flex" flexDirection="column">
      <Box flex={1} paddingBottom="spacing.7">
        <PageTitle title={fund.name} subtitle={`${fund.fundHouse} · Direct, Growth`} backTo={paths.kosh} />
        <Box padding="spacing.5" display="flex" flexDirection="column" gap="spacing.5">
          <Reveal index={0}>
            <Box display="flex" gap="spacing.2" flexWrap="wrap">
              <Badge color="primary" size="medium">
                {`${fund.rating}★ rated`}
              </Badge>
              <Badge color="neutral" size="medium">
                {fund.kind}
              </Badge>
              <Badge color="positive" size="medium">
                {fund.group === 'liquid' ? 'No exit load after 6 days' : 'No exit load'}
              </Badge>
            </Box>
            <Box marginTop="spacing.4" display="flex" alignItems="baseline" gap="spacing.3" flexWrap="wrap">
              <Display size="small" weight="semibold" color="feedback.text.positive.intense">
                {yearly === null ? '—' : formatPct(yearly)}
              </Display>
              <Text color="surface.text.gray.muted">{isLong ? `a year, over ${periodById[period].label}` : `in ${periodById[period].label}`}</Text>
            </Box>
          </Reveal>

          <Reveal index={1}>
            <Card padding="spacing.4" elevation="lowRaised">
              <CardBody>
                {/* Blade's area wrapper forces height: 100%, so the Box sets the size */}
                <Box height="220px">
                  <ChartAreaWrapper data={series}>
                    <ChartCartesianGrid />
                    <ChartXAxis dataKey="date" ticks={ticks} interval={0} tickFormatter={tickLabel} padding={{ left: 12, right: 28 }} />
                    <ChartYAxis domain={[lo - pad, hi + pad]} allowDataOverflow width={52} tickFormatter={(v: number) => v.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })} />
                    <ChartTooltip formatter={(v) => `₹${Number(v).toFixed(2)}`} labelFormatter={(l) => formatDay(String(l))} />
                    <ChartArea dataKey="nav" name="NAV" type="monotone" color="data.background.categorical.green.intense" />
                  </ChartAreaWrapper>
                </Box>
                <Box marginTop="spacing.3">
                  <SegmentedControl accessibilityLabel="Chart period" value={period} onChange={({ value }) => setPeriod(value as Period)} size="small">
                    {periods.map((p) => (
                      <SegmentedControlItem key={p.id} value={p.id}>
                        {p.id}
                      </SegmentedControlItem>
                    ))}
                  </SegmentedControl>
                </Box>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal index={2}>
            <Card padding="spacing.5" elevation="lowRaised">
              <CardBody>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.5">
                  <Stat label={`NAV, ${formatDay(nav.date)}`}>
                    <Text weight="semibold">₹{nav.nav.toFixed(2)}</Text>
                  </Stat>
                  <Stat label="Fund size">
                    <Text weight="semibold">₹{fund.fundSizeCr.toLocaleString('en-IN')} Cr</Text>
                  </Stat>
                  <Stat label="Minimum to invest">
                    <Amount value={fund.minInvestment} size="medium" weight="semibold" suffix="none" />
                  </Stat>
                  <Stat label="Money back in">
                    <Text weight="semibold">Instant, with Kosh</Text>
                  </Stat>
                </Box>
                <Box marginTop="spacing.5" padding="spacing.4" borderRadius="large" backgroundColor="feedback.background.positive.subtle">
                  <Text size="small" weight="semibold" color="feedback.text.positive.intense">
                    {lowestMonth >= 0 ? 'Not one down month in the last 5 years.' : `Its lowest month in 5 years: ${formatPct(lowestMonth)}.`}
                  </Text>
                </Box>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal index={3}>
            <Card padding="spacing.5" elevation="lowRaised">
              <CardBody>
                <Heading size="small">Return calculator</Heading>
                <Box marginTop="spacing.4" padding="spacing.4" borderRadius="large" backgroundColor="feedback.background.positive.subtle">
                  <Text size="small" color="surface.text.gray.muted">
                    {formatINR(example)} invested {periodById[period].label} ago would be
                  </Text>
                  <Amount value={Math.round(example * (1 + (total ?? 0)))} type="heading" size="large" weight="semibold" suffix="none" color="feedback.text.positive.intense" />
                </Box>
                <Box display="grid" gridTemplateColumns="repeat(6, 1fr)" gap="spacing.2" marginTop="spacing.5">
                  {periods.map((p) => {
                    const y = yearlyReturn(fund, p.id);
                    return (
                      <Box key={p.id} textAlign="center">
                        <Text size="xsmall" color="surface.text.gray.muted">
                          {p.id}
                        </Text>
                        <Text size="small" weight="semibold" color={y !== null && y < 0 ? 'feedback.text.notice.intense' : 'feedback.text.positive.intense'}>
                          {y === null ? '—' : formatPct(y)}
                        </Text>
                      </Box>
                    );
                  })}
                </Box>
                <Text size="xsmall" color="surface.text.gray.muted" marginTop="spacing.3">
                  Up to 1Y: total return. 3Y and 5Y: per year.
                </Text>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal index={4}>
            <Card padding="spacing.5" elevation="lowRaised">
              <CardBody>
                <Heading size="small">About this fund</Heading>
                <Text marginTop="spacing.3" marginBottom="spacing.3">
                  {fund.what}
                </Text>
                <Detail label="Exit load" value={fund.exitLoad} />
                <Detail label="Getting your money back" value="Instant through Kosh: Razorpay credits you and waits for the fund, free for a day." />
                <Detail label="Measured against" value={fund.benchmark} />
                <Detail label="Fund house" value={fund.fundHouse} />
              </CardBody>
            </Card>
          </Reveal>

          <Text size="xsmall" color="surface.text.gray.muted" textAlign="center">
            NAVs as of {formatDay(fundsAsOf)}, from published AMFI data. Rating by Groww. Past returns are not guaranteed. Mutual fund investments are subject to
            market risks.
          </Text>
        </Box>
      </Box>

      <ActionBar>
        {inPlan ? (
          <Button isFullWidth size="large" variant="secondary" icon={CheckIcon} onClick={goBack}>
            {`In your split at ${inPlan.pct}%. Back`}
          </Button>
        ) : (
          <Button
            isFullWidth
            size="large"
            onClick={() => {
              plan.addFund(fund.id);
              goBack();
            }}
          >
            Add to my split
          </Button>
        )}
      </ActionBar>
    </Box>
  );
}
