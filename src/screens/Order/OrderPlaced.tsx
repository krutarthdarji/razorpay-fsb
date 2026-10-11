import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  Amount,
  ArrowRightIcon,
  Badge,
  Box,
  Button,
  CheckIcon,
  ClockIcon,
  Display,
  InstantSettlementIcon,
  StepGroup,
  StepItem,
  StepItemIcon,
  Text,
  useTheme,
} from '@razorpay/blade/components';
import { fundById } from '../../lib/funds';
import { formatDay, formatMonths, formatWeekday } from '../../lib/dates';
import { msToS, toBezier } from '../../lib/motion';
import { formatINR } from '../../lib/format';
import { useDemo } from '../../state/demo';
import { paths } from '../../routes';
import { Reveal } from '../../components/app/Reveal';
import { TimeMachine } from '../../components/app/TimeMachine';

const Badge3D = styled(motion.div)(({ theme }) => ({
  width: theme.spacing[11] + theme.spacing[5],
  height: theme.spacing[11] + theme.spacing[5],
  borderRadius: theme.border.radius.round,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.feedback.background.positive.intense,
  boxShadow: `0 0 0 ${theme.spacing[3]}px ${theme.colors.feedback.background.positive.subtle}`,
}));

const formatElapsed = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Order placed: what happens next and when, plus how long it took */
export function OrderPlaced() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { lastOrder, totalInvested, today } = useDemo();

  if (!lastOrder) return <Navigate to={paths.home} replace />;
  const lastFlowSeconds = lastOrder.seconds;
  const allotted = today >= lastOrder.allotOn;
  const placedLabel = lastOrder.placedOn === today ? `Today, ${formatDay(today)}` : formatWeekday(lastOrder.placedOn);

  return (
    <Box padding="spacing.6" display="flex" flexDirection="column" alignItems="center" minHeight="100%">
      <Box marginTop="spacing.8">
        <Badge3D
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: msToS(theme.motion.duration.xgentle), ease: toBezier(theme.motion.easing.overshoot) }}
        >
          <CheckIcon size="2xlarge" color="surface.icon.staticWhite.normal" />
        </Badge3D>
      </Box>

      <Reveal index={1}>
        <Box textAlign="center" marginTop="spacing.7">
          <Display size="small" weight="semibold" textAlign="center">
            Order placed
          </Display>
          <Box display="flex" justifyContent="center" alignItems="baseline" gap="spacing.2" marginTop="spacing.2" flexWrap="wrap">
            <Amount value={lastOrder.amount} type="heading" size="medium" weight="semibold" suffix="none" />
            <Text size="large" color="surface.text.gray.muted">
              {`across ${lastOrder.items.length} fund${lastOrder.items.length === 1 ? '' : 's'}`}
            </Text>
          </Box>
          <Box marginTop="spacing.4" display="flex" justifyContent="center" gap="spacing.2" flexWrap="wrap">
            {lastFlowSeconds !== null && (
              <Badge color="positive" size="large" icon={ClockIcon}>
                {`Done in ${formatElapsed(lastFlowSeconds)}`}
              </Badge>
            )}
            <Badge color="primary" size="large">
              {`For ${formatMonths(lastOrder.months)} · 100% liquid`}
            </Badge>
          </Box>
          {totalInvested > lastOrder.amount && (
            <Text size="small" color="surface.text.gray.muted" marginTop="spacing.3">
              {`${formatINR(totalInvested)} invested in total`}
            </Text>
          )}
        </Box>
      </Reveal>

      <Reveal index={2}>
        <Box marginTop="spacing.6" padding="spacing.5" borderRadius="xlarge" backgroundColor="surface.background.gray.intense" elevation="lowRaised" width="100%">
          <Text size="small" weight="semibold">
            Where it went
          </Text>
          <Box display="flex" flexDirection="column" gap="spacing.3" marginTop="spacing.3">
            {lastOrder.items.map((item) => (
              <Box key={item.fundId} display="flex" justifyContent="space-between" alignItems="center" gap="spacing.3">
                <Box>
                  <Text size="small">{fundById[item.fundId].name}</Text>
                  <Text size="xsmall" color="surface.text.gray.muted">
                    {fundById[item.fundId].kind}
                  </Text>
                </Box>
                <Amount value={item.amount} size="small" weight="semibold" suffix="none" />
              </Box>
            ))}
          </Box>
        </Box>
      </Reveal>

      <Reveal index={3}>
        <Box
          marginTop="spacing.5"
          padding="spacing.5"
          borderRadius="xlarge"
          backgroundColor="surface.background.gray.intense"
          elevation="lowRaised"
          width="100%"
        >
          <StepGroup orientation="vertical" size="medium">
            <StepItem title="Order placed" timestamp={placedLabel} stepProgress="full" marker={<StepItemIcon icon={CheckIcon} color="positive" />} />
            <StepItem
              title="Money sent from your current account"
              timestamp={placedLabel}
              stepProgress={allotted ? 'full' : 'start'}
              marker={<StepItemIcon icon={CheckIcon} color="positive" />}
            />
            <StepItem
              title={allotted ? 'Units allotted' : 'Units will be allotted'}
              timestamp={formatWeekday(lastOrder.allotOn)}
              marker={<StepItemIcon icon={allotted ? CheckIcon : ClockIcon} color={allotted ? 'positive' : 'notice'} />}
            />
          </StepGroup>
        </Box>
      </Reveal>

      <Reveal index={4}>
        <Box marginTop="spacing.5" display="flex" gap="spacing.3" alignItems="flex-start" padding="spacing.4" borderRadius="large" backgroundColor="surface.background.primary.subtle">
          <InstantSettlementIcon size="medium" color="surface.icon.primary.normal" />
          <Text size="small">
            Need it back? Withdraw anytime. Razorpay credits your account instantly, free for a day.
          </Text>
        </Box>
      </Reveal>

      <Box width="100%" marginTop="spacing.5">
        <TimeMachine />
      </Box>

      <Box width="100%" marginTop="auto" paddingTop="spacing.7" display="flex" flexDirection="column" gap="spacing.3">
        <Button isFullWidth size="large" icon={ArrowRightIcon} iconPosition="right" onClick={() => navigate(paths.portfolio)}>
          View portfolio
        </Button>
        <Button isFullWidth variant="tertiary" onClick={() => navigate(paths.home)}>
          Back to home
        </Button>
      </Box>
    </Box>
  );
}
