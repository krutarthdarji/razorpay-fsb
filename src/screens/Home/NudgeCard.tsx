import {
  Amount,
  ArrowRightIcon,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  ChartDonut,
  ChartDonutCell,
  ChartDonutWrapper,
  ChartTooltip,
  Divider,
  Heading,
  SparklesIcon,
  Text,
  useTheme,
} from '@razorpay/blade/components';
import { formatINR, formatLakh } from '../../lib/format';

type Props = {
  balance: number;
  scheduled: number;
  predicted: number;
  safeAmount: number;
  idleDays: number;
  days: number;
  earnings: { option: number; sweepFd: number; idle: number };
  optionName: string;
  onSeeSafeAmount: () => void;
};

/** The hero of Home: RazorpayX's recommended amount, where the balance goes, one tap to see why */
export function NudgeCard({
  balance,
  scheduled,
  predicted,
  safeAmount,
  idleDays,
  days,
  earnings,
  optionName,
  onSeeSafeAmount,
}: Props) {
  const { theme } = useTheme();
  const chartColors = theme.colors.data.background.categorical;
  // Same order and colours as the donut cells below
  const split = [
    { name: 'Scheduled', value: scheduled, dot: chartColors.gray.intense },
    { name: 'Predicted spends', value: predicted, dot: chartColors.purple.moderate },
    { name: 'Recommended', value: safeAmount, dot: chartColors.green.intense },
  ];
  const compare = [
    { label: optionName, value: earnings.option, isBest: true },
    { label: 'Sweep FD', value: earnings.sweepFd, isBest: false },
    { label: 'Idle', value: earnings.idle, isBest: false },
  ];

  return (
    <Card padding="spacing.5" elevation="midRaised" isSelected>
      <CardBody>
        <Badge color="primary" icon={SparklesIcon} size="small">
          RazorpayX recommends
        </Badge>

        <Box marginTop="spacing.4" display="flex" flexWrap="wrap" alignItems="baseline" columnGap="spacing.2">
          <Amount value={safeAmount} type="heading" size="xlarge" weight="semibold" suffix="none" />
          <Heading size="large" weight="regular">
            can earn for you
          </Heading>
        </Box>
        <Text size="small" color="surface.text.gray.muted" marginTop="spacing.2">
          Idle for {idleDays} days. Worked out from your own cash flow.
        </Text>

        {/* Where today's balance goes */}
        <ChartDonutWrapper
          height="110px"
          marginTop="spacing.4"
          content={{ value: formatLakh(safeAmount) }}
        >
          <ChartDonut dataKey="value" nameKey="name" data={split} radius="small" type="semicircle">
            <ChartDonutCell color="data.background.categorical.gray.intense" />
            <ChartDonutCell color="data.background.categorical.purple.moderate" />
            <ChartDonutCell color="data.background.categorical.green.intense" />
          </ChartDonut>
          <ChartTooltip formatter={(v) => formatINR(Number(v))} />
        </ChartDonutWrapper>
        <Box display="flex" justifyContent="center" flexWrap="wrap" columnGap="spacing.5" rowGap="spacing.2">
          {split.map((s) => (
            <Box key={s.name} display="flex" alignItems="center" gap="spacing.2">
              <div style={{ width: 8, height: 8, borderRadius: theme.border.radius.round, backgroundColor: s.dot }} />
              <Text size="xsmall" color="surface.text.gray.muted">
                {s.name}
              </Text>
            </Box>
          ))}
        </Box>
        <Text size="xsmall" color="surface.text.gray.muted" textAlign="center" marginTop="spacing.2">
          Out of {formatINR(balance)} in your account today
        </Text>

        <Divider marginY="spacing.5" />

        {/* Same money, three outcomes, in rupees */}
        <Text size="small" color="surface.text.gray.muted">
          What {formatINR(safeAmount)} earns in {days} days
        </Text>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="spacing.3" marginTop="spacing.3">
          {compare.map((c) => (
            <Box
              key={c.label}
              padding="spacing.3"
              borderRadius="medium"
              backgroundColor={c.isBest ? 'feedback.background.positive.subtle' : 'surface.background.gray.moderate'}
            >
              <Text size="xsmall" color={c.isBest ? 'feedback.text.positive.intense' : 'surface.text.gray.muted'}>
                {c.label}
              </Text>
              <Amount
                value={c.value}
                type="body"
                size="large"
                weight="semibold"
                suffix="none"
                color={c.isBest ? 'feedback.text.positive.intense' : undefined}
              />
            </Box>
          ))}
        </Box>

        <Box marginTop="spacing.5">
          <Button isFullWidth icon={ArrowRightIcon} iconPosition="right" onClick={onSeeSafeAmount}>
            See safe amount
          </Button>
        </Box>
      </CardBody>
    </Card>
  );
}
