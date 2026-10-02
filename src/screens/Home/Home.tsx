import { useNavigate } from 'react-router-dom';
import { AppBar, AppBarLeading, Box, Text } from '@razorpay/blade/components';
import { merchant } from '../../data';
import { recommendation } from '../../lib/recommendation';
import { BalanceCard } from './BalanceCard';
import { NudgeCard } from './NudgeCard';

export function Home() {
  const navigate = useNavigate();

  return (
    <Box>
      <AppBar variant="subtle">
        <AppBarLeading title={merchant.businessName} />
      </AppBar>

      <Box paddingX="spacing.5" paddingBottom="spacing.7" display="flex" flexDirection="column" gap="spacing.5">
        <Text color="surface.text.gray.muted">Hi {merchant.ownerName.split(' ')[0]}</Text>
        <BalanceCard accountName={merchant.accountName} balance={merchant.balance} />
        <NudgeCard
          safeAmount={recommendation.safe}
          idleDays={merchant.idleDays}
          expectedEarnings={recommendation.expectedEarnings}
          days={recommendation.days}
          onSeeSafeAmount={() => navigate('/insight')}
        />
      </Box>
    </Box>
  );
}
