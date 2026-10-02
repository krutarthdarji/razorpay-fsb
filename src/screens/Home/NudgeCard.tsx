import {
  Amount,
  ArrowRightIcon,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  SparklesIcon,
  Text,
} from '@razorpay/blade/components';

type Props = {
  safeAmount: number;
  idleDays: number;
  expectedEarnings: number;
  days: number;
  onSeeSafeAmount: () => void;
};

/** The hero of Home: how much idle cash can earn, and one tap to see why */
export function NudgeCard({ safeAmount, idleDays, expectedEarnings, days, onSeeSafeAmount }: Props) {
  return (
    <Card padding="spacing.5" elevation="midRaised" isSelected>
      <CardBody>
        <Badge color="primary" icon={SparklesIcon} size="small">
          For your idle cash
        </Badge>

        <Box marginTop="spacing.4" display="flex" flexWrap="wrap" alignItems="baseline" columnGap="spacing.2">
          <Amount value={safeAmount} type="heading" size="xlarge" weight="semibold" suffix="none" />
          <Heading size="large" weight="regular">
            can earn for you
          </Heading>
        </Box>

        <Box marginTop="spacing.3">
          <Text color="surface.text.gray.muted">Idle for {idleDays} days.</Text>
          <Box display="flex" flexWrap="wrap" alignItems="baseline" columnGap="spacing.2">
            <Text color="surface.text.gray.muted">Could earn about</Text>
            <Amount
              value={expectedEarnings}
              type="body"
              size="medium"
              weight="semibold"
              suffix="none"
              color="feedback.text.positive.intense"
              isAffixSubtle={false}
            />
            <Text color="surface.text.gray.muted">in {days} days.</Text>
          </Box>
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
