import styled from 'styled-components';
import {
  AlertTriangleIcon,
  Amount,
  ArrowRightIcon,
  Badge,
  Box,
  Button,
  CheckIcon,
  HelpCircleIcon,
  InstantSettlementIcon,
  Text,
  ZapIcon,
  type IconComponent,
} from '@razorpay/blade/components';
import { brand } from '../../brand';
import { formatDay } from '../../lib/dates';
import { formatINR } from '../../lib/format';
import { recommendation } from '../../lib/recommendation';
import { KoshAvatar } from '../../components/app/KoshAvatar';
import { Section, SectionIntro } from './layout';

const Bubble = styled.div(({ theme }) => ({
  padding: theme.spacing[5],
  borderRadius: `${theme.border.radius.xsmall}px ${theme.border.radius.xlarge}px ${theme.border.radius.xlarge}px ${theme.border.radius.xlarge}px`,
  backgroundColor: theme.colors.surface.background.gray.intense,
  boxShadow: theme.elevation.lowRaised,
}));

function KoshSays({ children }: { children: React.ReactNode }) {
  return (
    <Box display="flex" gap="spacing.3" alignItems="flex-start">
      <KoshAvatar size="medium" />
      <Box flex={1}>
        <Bubble>{children}</Bubble>
      </Box>
    </Box>
  );
}

const fixes: { icon: IconComponent; friction: string; fix: string }[] = [
  { icon: HelpCircleIcon, friction: 'Knowledge', fix: `${brand.name} tells you what's safe: the amount, for how long, and where.` },
  { icon: AlertTriangleIcon, friction: 'Fear', fix: 'Payroll comes first. Every payment, plus a safety buffer Kosh sizes from your history, is kept aside.' },
  { icon: ZapIcon, friction: 'Effort', fix: 'One tap invests it, inside RazorpayX. No new app, no paperwork.' },
  { icon: InstantSettlementIcon, friction: 'Liquidity', fix: 'Withdraw anytime. Razorpay credits you instantly, free for a day.' },
];

const family = [
  { name: 'Cashflow Forecaster', by: 'Agent Studio' },
  { name: 'Agentic banking', by: 'RazorpayX' },
  { name: `${brand.name}, treasury agent`, by: 'RazorpayX', isUs: true },
];

export function SolutionSection() {
  const r = recommendation;

  return (
    <Section id="solution" tone="gray">
      <SectionIntro
        eyebrow="The solution"
        before={`Meet ${brand.name}. `}
        highlight="An agent, not a calculator."
        sub={`${brand.name} reads the real cash flow and gives an answer, not a tool. ${brand.meaning}: every business gets a treasury desk.`}
      />

      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap={{ base: 'spacing.8', m: 'spacing.10' }} marginTop={{ base: 'spacing.9', m: 'spacing.11' }} alignItems="center">
        {/* The agent, in its own words */}
        <Box padding="spacing.7" borderRadius="2xlarge" backgroundColor="surface.background.cloud.subtle" display="flex" flexDirection="column" gap="spacing.5">
          <KoshSays>
            <Box display="flex" flexWrap="wrap" alignItems="baseline" columnGap="spacing.2">
              <Amount value={r.safe} type="heading" size="large" weight="semibold" suffix="none" />
              <Text size="large">is safe to invest for {r.days} days.</Text>
            </Box>
            <Text color="surface.text.gray.muted" marginTop="spacing.2">
              Recommended: {r.option.name}. Earns about {formatINR(r.comparison.option)}, vs {formatINR(r.comparison.sweepFd)} in your sweep FD.
            </Text>
            <Box display="flex" gap="spacing.3" marginTop="spacing.4">
              <Box flex={1}>
                <Button isFullWidth size="small">{`Invest ${formatINR(r.safe)}`}</Button>
              </Box>
              <Button size="small" variant="secondary">
                Customise
              </Button>
            </Box>
          </KoshSays>
          <Box alignSelf="flex-end">
            <Badge color="primary" size="large" icon={CheckIcon}>
              Invested with one tap and MPIN
            </Badge>
          </Box>
          <KoshSays>
            <Text weight="semibold">Order placed.</Text>
            <Text color="surface.text.gray.muted" marginTop="spacing.1">
              Units allotted on {formatDay(r.allotmentDate)}. Need it back? Instant credit, free for a day.
            </Text>
          </KoshSays>
        </Box>

        {/* Each friction, removed */}
        <Box display="flex" flexDirection="column" gap="spacing.5">
          {fixes.map(({ icon: Icon, friction, fix }) => (
            <Box key={friction} display="flex" gap="spacing.4" alignItems="flex-start" padding="spacing.5" borderRadius="xlarge" backgroundColor="surface.background.gray.intense">
              <Box flexShrink={0} padding="spacing.3" borderRadius="medium" backgroundColor="feedback.background.positive.subtle" display="flex">
                <Icon size="medium" color="feedback.icon.positive.intense" />
              </Box>
              <Box>
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Text size="small" weight="semibold" color="feedback.text.negative.intense" textDecorationLine="line-through">
                    {friction}
                  </Text>
                  <ArrowRightIcon size="small" color="surface.icon.gray.muted" />
                  <Text size="small" weight="semibold" color="feedback.text.positive.intense">
                    Solved
                  </Text>
                </Box>
                <Text marginTop="spacing.2">{fix}</Text>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box marginTop={{ base: 'spacing.9', m: 'spacing.11' }} textAlign="center">
        <Text size="small" weight="semibold" color="surface.text.gray.muted">
          PART OF RAZORPAY'S AGENTIC FAMILY
        </Text>
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap="spacing.4" marginTop="spacing.4">
          {family.map((f) => (
            <Box
              key={f.name}
              display="flex"
              alignItems="center"
              gap="spacing.3"
              paddingX="spacing.5"
              paddingY="spacing.3"
              borderRadius="max"
              borderWidth="thin"
              borderColor={f.isUs ? 'surface.border.primary.normal' : 'surface.border.gray.subtle'}
              backgroundColor="surface.background.gray.intense"
            >
              {f.isUs && <KoshAvatar size="small" />}
              <Text size="small" color="surface.text.gray.muted">
                {f.by}
              </Text>
              <Text size="small" weight="semibold">
                {f.name}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Section>
  );
}
