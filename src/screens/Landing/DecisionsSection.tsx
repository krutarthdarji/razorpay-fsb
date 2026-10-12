import { Box, CheckCircleIcon, Heading, MinusCircleIcon, Text } from '@razorpay/blade/components';
import { Label, Section, SectionBody, SectionIntro } from './layout';

const chose = [
  { what: 'An agent that gives one answer', why: 'Owners want to be told the amount, not handed a calculator.' },
  { what: 'One tap by default', why: 'A habit forms when the effort is close to zero. Changing the plan stays optional.' },
  { what: 'Only liquid and short-term debt funds', why: 'This is working capital. It must stay safe and liquid. Trust comes before yield.' },
  { what: 'Instant credit on withdrawal, free for a day', why: 'It removes the last fear: "what if I need it tomorrow?"' },
  { what: 'Everything in rupees, against idle cash', why: 'An owner thinks in rupees earned, not in percentages.' },
];

const leftOut = [
  { what: 'Auto-invest', why: 'Trust first. Automation can come once the habit has formed.' },
  { what: 'Fund search and research tools', why: 'Eight top-rated funds are enough. More choice brings back the effort we are removing.' },
  { what: 'Shares and long-term products', why: 'That is wealth management. This is spare working capital.' },
  { what: 'A full cash-flow dashboard', why: 'One job, done well: find what is safe and invest it.' },
  { what: 'A credit product', why: 'Instant credit is a promise inside the withdraw step, not a loan to apply for.' },
];

function List({ label, title, rows, kind }: { label: string; title: string; rows: { what: string; why: string }[]; kind: 'chose' | 'left' }) {
  const Icon = kind === 'chose' ? CheckCircleIcon : MinusCircleIcon;
  return (
    <Box padding="spacing.7" borderRadius="xlarge" borderWidth="thin" borderColor={kind === 'chose' ? 'surface.border.primary.normal' : 'surface.border.gray.subtle'} backgroundColor="surface.background.gray.intense">
      <Label tone={kind === 'chose' ? 'primary' : 'muted'}>{label}</Label>
      <Heading size="large" marginTop="spacing.1">
        {title}
      </Heading>
      <Box display="flex" flexDirection="column" marginTop="spacing.4">
        {rows.map((r, i) => (
          <Box key={r.what} display="flex" gap="spacing.4" alignItems="flex-start" paddingY="spacing.4" borderTopWidth={i === 0 ? 'none' : 'thin'} borderTopColor="surface.border.gray.subtle">
            <Box flexShrink={0} display="flex" marginTop="spacing.1">
              <Icon size="large" color={kind === 'chose' ? 'feedback.icon.positive.intense' : 'surface.icon.gray.muted'} />
            </Box>
            <Box>
              <Text size="large" weight="semibold">
                {r.what}
              </Text>
              <Text color="surface.text.gray.subtle" marginTop="spacing.1">
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
    <Section id="decisions" tone="gray">
      <SectionIntro
        step="08"
        label="Product decisions"
        title="What we built, and what we "
        highlight="chose not to."
        sub="One merchant job, done from start to finish. Everything that did not serve that job was left out on purpose."
      />
      <SectionBody>
        <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.5">
          <List label="Built" title="We chose" rows={chose} kind="chose" />
          <List label="Not built" title="We left out" rows={leftOut} kind="left" />
        </Box>
      </SectionBody>
    </Section>
  );
}
