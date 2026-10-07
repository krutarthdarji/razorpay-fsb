import {
  AlertTriangleIcon,
  Box,
  CheckIcon,
  CloseIcon,
  Heading,
  HelpCircleIcon,
  InstantSettlementIcon,
  Text,
  ZapIcon,
  type IconComponent,
} from '@razorpay/blade/components';
import { investOptions } from '../../data';
import { Section, SectionIntro } from './layout';

const workarounds = [
  { title: 'Leave it idle', good: 'Safe', bad: 'Earns ₹0' },
  { title: 'Hold an oversized buffer', good: 'Feels safe', bad: 'Most of it never earns' },
  { title: 'Sweep at a guessed limit', good: 'Automatic', bad: `About ${investOptions.sweepFd.annualRatePct}%, and the limit is a guess` },
  { title: 'Invest by hand on another app', good: 'Better returns', bad: 'Hours of effort and paperwork' },
];

const frictions: { icon: IconComponent; name: string; question: string }[] = [
  { icon: HelpCircleIcon, name: 'Knowledge', question: "What's actually spare?" },
  { icon: AlertTriangleIcon, name: 'Fear', question: 'What if payroll bounces?' },
  { icon: ZapIcon, name: 'Effort', question: 'Another platform, more paperwork.' },
  { icon: InstantSettlementIcon, name: 'Liquidity', question: 'What if I need it tomorrow?' },
];

function Pro({ text, good }: { text: string; good: boolean }) {
  const Icon = good ? CheckIcon : CloseIcon;
  return (
    <Box display="flex" gap="spacing.2" alignItems="flex-start">
      <Box flexShrink={0} display="flex" marginTop="spacing.1">
        <Icon size="small" color={good ? 'feedback.icon.positive.intense' : 'feedback.icon.negative.intense'} />
      </Box>
      <Text size="small" color={good ? 'surface.text.gray.subtle' : 'feedback.text.negative.intense'}>
        {text}
      </Text>
    </Box>
  );
}

export function TodaySection() {
  return (
    <Section id="today">
      <SectionIntro
        eyebrow="How it's handled today"
        before="Every option forces a "
        highlight="trade-off."
        sub="Safety or returns. Effort or idle money. This is what owners like Ravi do now."
      />

      <Box display="grid" gridTemplateColumns={{ base: '1fr', s: 'repeat(2, 1fr)', l: 'repeat(4, 1fr)' }} gap="spacing.5" marginTop={{ base: 'spacing.9', m: 'spacing.11' }}>
        {workarounds.map((w) => (
          <Box key={w.title} padding="spacing.6" borderRadius="xlarge" borderWidth="thin" borderColor="surface.border.gray.subtle">
            <Heading size="small">{w.title}</Heading>
            <Box display="flex" flexDirection="column" gap="spacing.2" marginTop="spacing.4">
              <Pro text={w.good} good />
              <Pro text={w.bad} good={false} />
            </Box>
          </Box>
        ))}
      </Box>

      <Box marginTop={{ base: 'spacing.9', m: 'spacing.11' }}>
        <Text size="large" weight="semibold" textAlign="center">
          Where it hurts
        </Text>
        <Box display="grid" gridTemplateColumns={{ base: '1fr', s: 'repeat(2, 1fr)', l: 'repeat(4, 1fr)' }} gap="spacing.5" marginTop="spacing.6">
          {frictions.map(({ icon: Icon, name, question }) => (
            <Box key={name} padding="spacing.6" borderRadius="xlarge" backgroundColor="feedback.background.negative.subtle">
              <Box display="flex" alignItems="center" gap="spacing.2">
                <Icon size="medium" color="feedback.icon.negative.intense" />
                <Text size="small" weight="semibold" color="feedback.text.negative.intense">
                  {name.toUpperCase()}
                </Text>
              </Box>
              <Text size="large" weight="semibold" marginTop="spacing.3">
                {question}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Section>
  );
}
