import styled from 'styled-components';
import { SparklesIcon, type Theme } from '@razorpay/blade/components';

/** Kosh's mark: a blue-to-violet orb with a sparkle. Used wherever the agent speaks. */
const Orb = styled.div<{ $size: number }>(({ theme, $size }) => ({
  width: $size,
  height: $size,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.border.radius.round,
  background: koshGradient(theme),
  boxShadow: theme.elevation.midRaised,
}));

const sizes = { small: 20, medium: 32, large: 44 } as const;
const iconSizes = { small: 'xsmall', medium: 'medium', large: 'large' } as const;

export function KoshAvatar({ size = 'medium' }: { size?: keyof typeof sizes }) {
  return (
    <Orb $size={sizes[size]} aria-hidden>
      <SparklesIcon size={iconSizes[size]} color="surface.icon.staticWhite.normal" />
    </Orb>
  );
}

/** Gradient used for Kosh surfaces (borders, highlights) */
export const koshGradient = (theme: Theme) =>
  `linear-gradient(135deg, ${theme.colors.interactive.background.primary.default}, ${theme.colors.data.background.categorical.purple.intense})`;
