import { Box, Display, Text } from '@razorpay/blade/components';
import { formatMonths } from '../../lib/dates';
import { formatINR } from '../../lib/format';
import { compare, koshSplit } from '../../lib/funds';
import { cycle } from '../../lib/recommendation';
import { Label, Section, SectionBody, SectionIntro, Takeaway } from './layout';

/** The problem, sized: what idle cash earns, how much of it there is, and what one merchant gives up */
export function ProblemSection() {
  const earn = compare(cycle.amount, koshSplit, cycle.days);
  const facts = [
    { label: 'What a current account pays', value: '0%', body: 'Banks are not allowed to pay interest on current account balances.', source: 'RBI rule' },
    { label: 'Money in demand deposits at Indian banks', value: '₹30 lakh crore', body: 'This includes every business current account in the country.', source: 'RBI, February 2026' },
    {
      label: `What one merchant gives up in ${formatMonths(cycle.months)}`,
      value: `About ${formatINR(earn.kosh)}`,
      body: `What ${formatINR(cycle.amount)} of spare cash could earn in liquid funds. Left idle, it earns ₹0.`,
      source: "At the funds' pace over the last 12 months",
    },
  ];

  return (
    <Section id="problem">
      <SectionIntro
        step="01"
        label="The problem"
        title="Businesses keep spare cash in an account that pays nothing. "
        highlight="Not by choice."
        sub="Owners want their money to earn. What stops them is one question nobody answers for them."
      />

      <SectionBody>
        <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3, 1fr)' }} gap="spacing.5">
          {facts.map((f) => (
            <Box key={f.label} padding="spacing.7" borderRadius="xlarge" borderWidth="thin" borderColor="surface.border.gray.subtle" backgroundColor="surface.background.gray.intense" display="flex" flexDirection="column">
              <Label tone="muted">{f.label}</Label>
              <Display size="small" weight="semibold" marginTop="spacing.3">
                {f.value}
              </Display>
              <Text size="large" marginTop="spacing.3">
                {f.body}
              </Text>
              <Box marginTop="auto" paddingTop="spacing.4">
                <Text size="small" color="surface.text.gray.muted">
                  {f.source}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>

        <Takeaway>
          <Label>The question nobody answers</Label>
          <Box marginTop="spacing.2">
            <Display as="span" size="small" weight="semibold">
              "How much of my balance can I safely spare, and for how long?"
            </Display>
          </Box>
          <Text size="large" color="surface.text.gray.subtle" marginTop="spacing.3">
            Without the answer, the safe thing to do is nothing. So the money sits.
          </Text>
        </Takeaway>
      </SectionBody>
    </Section>
  );
}
