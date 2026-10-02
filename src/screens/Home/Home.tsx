import { useNavigate } from 'react-router-dom';
import { AppBar, AppBarLeading, Box, Text } from '@razorpay/blade/components';
import { merchant, plan, predictedSpends, upcomingOutflows } from '../../data';
import { formatDay } from '../../lib/dates';
import { cashflow, recommendation } from '../../lib/recommendation';
import { paths } from '../../routes';
import { BalanceCard } from './BalanceCard';
import { NudgeCard } from './NudgeCard';
import { CashflowCard } from './CashflowCard';
import { ForecastCard } from './ForecastCard';

export function Home() {
  const navigate = useNavigate();
  const r = recommendation;

  return (
    <Box>
      <AppBar variant="subtle" backgroundColor="surface.background.gray.moderate">
        <AppBarLeading title={merchant.businessName} />
      </AppBar>

      <Box paddingX="spacing.5" paddingBottom="spacing.7" display="flex" flexDirection="column" gap="spacing.5">
        <Text color="surface.text.gray.muted">Hi {merchant.ownerName.split(' ')[0]}</Text>
        <BalanceCard
          accountName={merchant.accountName}
          balance={merchant.balance}
          moneyIn={cashflow.totalIn}
          moneyOut={cashflow.totalOut}
          days={r.days}
        />
        <NudgeCard
          balance={merchant.balance}
          scheduled={r.scheduled}
          predicted={r.predicted}
          safeAmount={r.safe}
          idleDays={merchant.idleDays}
          days={r.days}
          earnings={r.comparison}
          optionName={r.option.name}
          onSeeSafeAmount={() => navigate(paths.insight)}
        />
        <CashflowCard days={r.days} weeks={cashflow.weeks} scheduled={upcomingOutflows} predicted={predictedSpends} />
        <ForecastCard
          points={cashflow.balance}
          invested={r.safe}
          keyDays={[formatDay(plan.today), ...upcomingOutflows.filter((o) => o.id === 'salaries' || o.id === 'gst').map((o) => formatDay(o.payments[0].date))]}
        />
      </Box>
    </Box>
  );
}
