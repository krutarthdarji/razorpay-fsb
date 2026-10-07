import { Box, Display, Text } from '@razorpay/blade/components';
import { Section, SectionIntro } from './layout';

/** Market numbers from the founder's research. Labelled as estimates on the page. */
const facts = [
  { tag: 'The money exists', value: '₹25 lakh crore', body: 'sits idle in current accounts.' },
  { tag: 'The intent exists', value: 'Idle money hurts', body: 'Indian owners want every rupee working.' },
  { tag: "The behaviour doesn't", value: '86M+ vs ~1.4M', body: 'MSMEs vs institutional mutual fund folios.' },
];

export function ProblemSection() {
  return (
    <Section id="problem">
      <SectionIntro
        eyebrow="The problem"
        before="The money exists. The intent exists. "
        highlight="The behaviour doesn't."
      />

      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', m: 'repeat(3, 1fr)' }}
        gap="spacing.6"
        marginTop={{ base: 'spacing.9', m: 'spacing.11' }}
      >
        {facts.map((f, i) => (
          <Box
            key={f.tag}
            padding="spacing.7"
            borderRadius="xlarge"
            borderWidth="thin"
            borderColor={i === 2 ? 'surface.border.primary.normal' : 'surface.border.gray.subtle'}
            backgroundColor={i === 2 ? 'surface.background.primary.subtle' : 'surface.background.gray.intense'}
          >
            <Text size="small" weight="semibold" color={i === 2 ? 'surface.text.primary.normal' : 'surface.text.gray.muted'}>
              {f.tag.toUpperCase()}
            </Text>
            <Display size="small" weight="medium" marginTop="spacing.4">
              {f.value}
            </Display>
            <Text size="large" color="surface.text.gray.muted" marginTop="spacing.2">
              {f.body}
            </Text>
          </Box>
        ))}
      </Box>

      <Box marginTop="spacing.8" textAlign="center">
        <Text size="large" weight="semibold">
          The gap between intent and behaviour is the problem.
        </Text>
        <Text size="small" color="surface.text.gray.muted" marginTop="spacing.2">
          Figures are industry estimates.
        </Text>
      </Box>
    </Section>
  );
}
