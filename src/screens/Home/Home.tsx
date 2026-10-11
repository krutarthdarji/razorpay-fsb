import { useNavigate } from 'react-router-dom';
import { Box } from '@razorpay/blade/components';
import { recommendation, standing } from '../../lib/recommendation';
import { useDemo } from '../../state/demo';
import { paths } from '../../routes';
import { CycleComplete } from '../../components/app/CycleComplete';
import { Reveal } from '../../components/app/Reveal';
import { TimeMachine } from '../../components/app/TimeMachine';
import { HomeHero } from './HomeHero';
import { StatCards } from './StatCards';
import { InvestedCard, KoshCard } from './KoshCard';
import { CompoundingCard, EarnCard } from './EarnCard';
import { LiquidityCard } from './LiquidityCard';

/**
 * Balance, three numbers, Kosh's recommendation, what the money earns, and why it stays liquid.
 * Once Kosh's cycle is over, the result takes the place of the recommendation.
 */
export function Home() {
  const navigate = useNavigate();
  const { balance, totalInvested, value, earned, holdings, finished, startFlow } = useDemo();
  const r = recommendation;
  const s = standing(totalInvested);
  const toKosh = () => {
    startFlow();
    navigate(paths.kosh);
  };

  return (
    <Box paddingBottom="spacing.7">
      <HomeHero balance={balance} />
      <Box padding="spacing.5" paddingTop="spacing.4" display="flex" flexDirection="column" gap="spacing.4">
        {finished && (
          <Reveal index={0}>
            <CycleComplete />
          </Reveal>
        )}
        <Reveal index={0}>
          <StatCards />
        </Reveal>
        {!finished && (
          <>
            <Reveal index={1}>
              {s.status === 'none' ? (
                <KoshCard onInvest={toKosh} onExplain={() => navigate(paths.liquidity)} />
              ) : (
                <InvestedCard invested={totalInvested} {...s} status={s.status} months={r.months} onPortfolio={() => navigate(paths.portfolio)} onKosh={toKosh} />
              )}
            </Reveal>
            <Reveal index={2}>
              {s.status === 'none' ? (
                r.amount > 0 && <EarnCard amount={r.amount} months={r.months} days={r.days} />
              ) : (
                <CompoundingCard holdings={holdings} value={value} earned={earned} />
              )}
            </Reveal>
          </>
        )}
        <Reveal index={3}>
          <LiquidityCard />
        </Reveal>
        <TimeMachine />
      </Box>
    </Box>
  );
}
