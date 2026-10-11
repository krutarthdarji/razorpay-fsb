import { Box, CheckCircleIcon, Heading, MinusCircleIcon, Text } from '@razorpay/blade/components';
import { Section, SectionIntro } from './layout';

const chose = [
  { what: 'An agent, not a calculator', why: 'Merchants want an answer, not a tool.' },
  { what: 'One tap by default', why: 'Habit forms when the effort is near zero.' },
  { what: 'Only liquid and short-term debt funds', why: 'Working capital must stay safe and liquid. Trust comes before yield.' },
  { what: 'Free 1-day instant credit', why: 'Removes the last fear: "what if I need it?"' },
  { what: 'Value in rupees vs idle and sweep FD', why: 'That is how owners think.' },
];

const leftOut = [
  { what: 'Auto-invest', why: 'Trust first. Automation comes once the habit forms.' },
  { what: 'Fund research tools', why: 'Eight top-rated funds are enough. More recreates the effort we are removing.' },
  { what: 'Equity and long-term products', why: 'This is working capital, not wealth.' },
  { what: 'Full dashboards', why: 'Focus beats breadth.' },
];

function List({ title, rows, kind }: { title: string; rows: { what: string; why: string }[]; kind: 'chose' | 'left' }) {
  const Icon = kind === 'chose' ? CheckCircleIcon : MinusCircleIcon;
  return (
    <Box padding="spacing.7" borderRadius="2xlarge" borderWidth="thin" borderColor={kind === 'chose' ? 'surface.border.primary.normal' : 'surface.border.gray.subtle'} backgroundColor="surface.background.gray.intense">
      <Heading size="large">{title}</Heading>
      <Box display="flex" flexDirection="column" marginTop="spacing.5">
        {rows.map((r, i) => (
          <Box key={r.what} display="flex" gap="spacing.4" alignItems="flex-start" paddingY="spacing.4" borderTopWidth={i === 0 ? 'none' : 'thin'} borderTopColor="surface.border.gray.subtle">
            <Box flexShrink={0} display="flex" marginTop="spacing.1">
              <Icon size="medium" color={kind === 'chose' ? 'feedback.icon.positive.intense' : 'surface.icon.gray.muted'} />
            </Box>
            <Box>
              <Text weight="semibold">{r.what}</Text>
              <Text color="surface.text.gray.muted" marginTop="spacing.1">
                {r.why}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function DecisionsSection() {
  return (
    <Section id="decisions">
      <SectionIntro eyebrow="Product decisions" before="What we built, and what we " highlight="chose not to." />
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.6" marginTop={{ base: 'spacing.9', m: 'spacing.11' }}>
        <List title="We chose" rows={chose} kind="chose" />
        <List title="We left out" rows={leftOut} kind="left" />
      </Box>
    </Section>
  );
}
