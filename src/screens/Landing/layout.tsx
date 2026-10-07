/** Layout pieces shared by the landing page sections */
import styled from 'styled-components';
import { Badge, Box, Display, Text } from '@razorpay/blade/components';
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
  // Generous vertical rhythm like razorpay.com: 2 × spacing.11 on desktop, spacing.11 on phones
  paddingTop: theme.spacing[11],
  paddingBottom: theme.spacing[11],
  [`@media (min-width: ${theme.breakpoints.m}px)`]: {
    paddingTop: theme.spacing[11] * 2,
    paddingBottom: theme.spacing[11] * 2,
  },
}));

export function Section({ id, tone = 'white', children }: { id?: string; tone?: Tone; children: React.ReactNode }) {
  return (
    <SectionBox id={id} $tone={tone}>
      <Container>{children}</Container>
    </SectionBox>
  );
}

/** Small pill above a heading, like "PAY AT SCALE WITH" on razorpay.com/x */
export function Eyebrow({ children }: { children: string }) {
  return (
    <Badge color="neutral" size="medium">
      {children.toUpperCase()}
    </Badge>
  );
}

/**
 * RazorpayX-style heading: light weight, one phrase in blue.
 * `before` + `highlight` + `after`.
 */
export function HighlightHeading({
  before,
  highlight,
  after = '',
  size = 'medium',
  align = 'center',
  as = 'h2',
}: {
  before: string;
  highlight: string;
  after?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  align?: 'center' | 'left';
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <Display as={as} size={size} weight="regular" textAlign={align}>
      {before}
      <Display as="span" size={size} weight="regular" color="surface.text.primary.normal">
        {highlight}
      </Display>
      {after}
    </Display>
  );
}

/** Eyebrow + heading + optional sub line, centred */
export function SectionIntro({
  eyebrow,
  before,
  highlight,
  after,
  sub,
}: {
  eyebrow: string;
  before: string;
  highlight: string;
  after?: string;
  sub?: string;
}) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.5" maxWidth="760px" marginX="auto">
      <Eyebrow>{eyebrow}</Eyebrow>
      <HighlightHeading before={before} highlight={highlight} after={after} />
      {sub && (
        <Text size="large" color="surface.text.gray.muted" textAlign="center">
          {sub}
        </Text>
      )}
    </Box>
  );
}

/** Light blue-grey panel that holds a product visual, like the illustration panels on razorpay.com/x */
export const VisualPanel = styled.div(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // Extra room top and bottom on phones so the floating label doesn't cover the card
  padding: `${theme.spacing[11]}px ${theme.spacing[5]}px`,
  minHeight: 300,
  [`@media (min-width: ${theme.breakpoints.m}px)`]: { padding: theme.spacing[8] },
  borderRadius: theme.border.radius.large,
  background: `linear-gradient(135deg, ${theme.colors.surface.background.cloud.subtle}, ${theme.colors.surface.background.sea.subtle})`,
}));

/** Green floating label on a visual, like "Pay Employees" on razorpay.com/x */
export const FloatingLabel = styled.div(({ theme }) => ({
  position: 'absolute',
  padding: `${theme.spacing[3]}px ${theme.spacing[4]}px`,
  borderRadius: theme.border.radius.medium,
  backgroundColor: theme.colors.feedback.background.positive.intense,
  color: theme.colors.surface.text.staticWhite.normal,
  fontFamily: theme.typography.fonts.family.heading,
  fontSize: theme.typography.fonts.size[200],
  boxShadow: theme.elevation.midRaised,
}));
