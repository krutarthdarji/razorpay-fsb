import {
  ArrowRightIcon,
  BellIcon,
  Box,
  Button,
  CheckCircleIcon,
  Heading,
  LockIcon,
  PieChartIcon,
  SparklesIcon,
  Text,
  type IconComponent,
} from '@razorpay/blade/components';
import { formatINR } from '../../lib/format';
import { formatDay, formatMonths } from '../../lib/dates';
import { cycle } from '../../lib/recommendation';
import { Section, SectionIntro } from './layout';

type Step = { time: string; icon: IconComponent; title: string; body: string };

export function FlowSection({ onDemo }: { onDemo: () => void }) {
  const r = cycle;
  const steps: Step[] = [
    { time: '0:00', icon: BellIcon, title: 'Nudge', body: 'Cash lands. Kosh spots the idle money and nudges.' },
    { time: '0:15', icon: SparklesIcon, title: 'Recommendation', body: `Kosh recommends ${formatINR(r.amount)} for ${formatMonths(r.months)}, split across two top-rated funds.` },
    { time: '0:40', icon: LockIcon, title: 'One tap', body: 'Invest, then confirm with the MPIN used for payouts.' },
    { time: '0:55', icon: CheckCircleIcon, title: 'Order placed', body: `With the allotment date: ${formatDay(r.allotmentDate)}.` },
    { time: '1:10', icon: PieChartIcon, title: 'Portfolio', body: 'Earnings vs idle and sweep FD, in rupees.' },
  ];

  return (
    <Section id="flow">
      <SectionIntro eyebrow="The flow" before="From nudge to invested in " highlight="under 2 minutes." />

      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(5, 1fr)' }} gap="spacing.5" marginTop={{ base: 'spacing.9', m: 'spacing.11' }}>
        {steps.map(({ time, icon: Icon, title, body }, i) => (
          <Box key={title} position="relative" padding="spacing.6" borderRadius="xlarge" borderWidth="thin" borderColor={i === 2 ? 'surface.border.primary.normal' : 'surface.border.gray.subtle'} backgroundColor={i === 2 ? 'surface.background.primary.subtle' : 'surface.background.gray.intense'}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box padding="spacing.3" borderRadius="medium" backgroundColor="surface.background.primary.subtle" display="flex">
                <Icon size="medium" color="surface.icon.primary.normal" />
              </Box>
              <Text size="small" weight="semibold" color="surface.text.gray.muted">
                {time}
              </Text>
            </Box>
            <Heading size="small" marginTop="spacing.5">
              {`${i + 1}. ${title}`}
            </Heading>
            <Text size="small" color="surface.text.gray.muted" marginTop="spacing.2">
              {body}
            </Text>
          </Box>
        ))}
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.4" marginTop="spacing.8">
        <Text color="surface.text.gray.muted" textAlign="center">
          Want a different amount or fund? Customise is one tap away, and never in the way.
        </Text>
        <Button variant="secondary" icon={ArrowRightIcon} iconPosition="right" onClick={onDemo}>
          Try the flow
        </Button>
      </Box>
    </Section>
  );
}
