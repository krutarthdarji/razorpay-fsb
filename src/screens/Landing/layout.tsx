/** Layout pieces shared by the landing page sections */
import styled from 'styled-components';
import { Box, Display, Text } from '@razorpay/blade/components';
import { PAGE_MAX_WIDTH } from '../../components/LandingNav';

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <Box maxWidth={`${PAGE_MAX_WIDTH}px`} marginX="auto" paddingX={{ base: 'spacing.5', m: 'spacing.8' }}>
      {children}
    </Box>
  );
}

type Tone = 'white' | 'gray';

const SectionBox = styled.section<{ $tone: Tone }>(({ theme, $tone }) => ({
  backgroundColor:
    $tone === 'white' ? theme.colors.surface.background.gray.intense : theme.colors.surface.background.gray.moderate,
  // Nav links land with the section's label just below the fixed nav
  scrollMarginTop: theme.spacing[10],
  paddingTop: theme.spacing[11],
  paddingBottom: theme.spacing[11],
  [`@media (min-width: ${theme.breakpoints.m}px)`]: {
    paddingTop: theme.spacing[11] * 1.5,
    paddingBottom: theme.spacing[11] * 1.5,
  },
}));

export function Section({ id, tone = 'white', children }: { id?: string; tone?: Tone; children: React.ReactNode }) {
  return (
    <SectionBox id={id} $tone={tone}>
      <Container>{children}</Container>
    </SectionBox>
  );
}

/**
 * Section header: a numbered label, a strong title with one phrase in blue, and one
 * line that says what the section shows. Left-aligned and in the same place every
 * time, so the page reads top to bottom like a document.
 */
export function SectionIntro({ step, label, title, highlight, sub }: { step: string; label: string; title: string; highlight?: string; sub?: string }) {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4" maxWidth="840px">
      <Box display="flex" alignItems="center" gap="spacing.3">
        <Box paddingX="spacing.3" paddingY="spacing.1" borderRadius="max" backgroundColor="surface.background.primary.intense">
          <Text weight="semibold" color="surface.text.staticWhite.normal">
            {step}
          </Text>
        </Box>
        <Text size="large" weight="semibold" color="surface.text.primary.normal">
          {label}
        </Text>
      </Box>
      <Display as="h2" size="small" weight="semibold">
        {title}
        {highlight && (
          <Display as="span" size="small" weight="semibold" color="surface.text.primary.normal">
            {highlight}
          </Display>
        )}
      </Display>
      {sub && (
        <Text size="large" color="surface.text.gray.subtle">
          {sub}
        </Text>
      )}
    </Box>
  );
}

/** The space between a section's header and its content */
export function SectionBody({ children }: { children: React.ReactNode }) {
  return <Box marginTop={{ base: 'spacing.8', m: 'spacing.10' }}>{children}</Box>;
}

const labelColor = {
  primary: 'surface.text.primary.normal',
  positive: 'feedback.text.positive.intense',
  negative: 'feedback.text.negative.intense',
  notice: 'feedback.text.notice.intense',
  muted: 'surface.text.gray.muted',
  onDark: 'surface.text.staticWhite.muted',
} as const;

/** A short label above a piece of content. Sentence case and body size, so it reads at a glance. */
export function Label({ children, tone = 'primary' }: { children: React.ReactNode; tone?: keyof typeof labelColor }) {
  return (
    <Text weight="semibold" color={labelColor[tone]}>
      {children}
    </Text>
  );
}

/** The closing line of a section: the one thing to take away from it */
export function Takeaway({ children }: { children: React.ReactNode }) {
  return (
    <Box marginTop={{ base: 'spacing.7', m: 'spacing.8' }} padding={{ base: 'spacing.6', m: 'spacing.7' }} borderRadius="xlarge" backgroundColor="surface.background.primary.subtle" borderLeftWidth="thicker" borderLeftColor="surface.border.primary.normal">
      {children}
    </Box>
  );
}
