import { useNavigate } from 'react-router-dom';
import { Box } from '@razorpay/blade/components';
import { investOptions, merchant, upcomingOutflows } from '../../data';
import { cashflow, recommendation } from '../../lib/recommendation';
import { useDemo } from '../../state/demo';
import { paths } from '../../routes';
import { Reveal } from '../../components/app/Reveal';
import { HomeHero } from './HomeHero';
import { KoshNudge } from './KoshNudge';
import { UpcomingPayments } from './UpcomingPayments';
import { CashflowCard } from './CashflowCard';

export function Home() {
  const navigate = useNavigate();
  const { balance, investment, startFlow } = useDemo();
  const r = recommendation;
  const fundName = investment ? investOptions[investment.optionId].name : undefined;

  return (
    <Box paddingBottom="spacing.7">
      <HomeHero
        balance={balance}
        idle={r.surplus}
        idleDays={merchant.idleDays}
        invested={investment?.amount ?? 0}
        fundName={fundName}
      />

      {/* Cards overlap the blue band */}
      <Box position="relative" zIndex={1} paddingX="spacing.5" marginTop="-56px" display="flex" flexDirection="column" gap="spacing.5">
        <Reveal index={0}>
          {investment && fundName ? (
            <KoshNudge
              state="invested"
              invested={investment.amount}
              fundName={fundName}
              allotmentDate={r.allotmentDate}
              onSee={() => navigate(paths.portfolio)}
            />
          ) : (
            <KoshNudge
              state="recommend"
              safe={r.safe}
              days={r.days}
              earnings={r.expectedEarnings}
              moreThanSweepFd={r.comparison.moreThanSweepFd}
              onSee={() => {
                startFlow();
                navigate(paths.kosh);
              }}
            />
          )}
        </Reveal>
        <Reveal index={1}>
          <UpcomingPayments outflows={upcomingOutflows} />
        </Reveal>
        <Reveal index={2}>
          <CashflowCard days={r.days} weeks={cashflow.weeks} moneyIn={cashflow.totalIn} moneyOut={cashflow.totalOut} />
        </Reveal>
      </Box>
    </Box>
  );
}
