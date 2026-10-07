import styled, { css } from 'styled-components';
import { Box, Text } from '@razorpay/blade/components';

type Props = {
  min: number;
  max: number;
  step: number;
  value: number;
  /** Kosh's recommended amount, marked on the track */
  recommended: number;
  onChange: (value: number) => void;
  formatLabel: (value: number) => string;
  accessibilityLabel: string;
};

const thumb = css`
  width: ${({ theme }) => theme.spacing[7]}px;
  height: ${({ theme }) => theme.spacing[7]}px;
  border-radius: ${({ theme }) => theme.border.radius.round};
  background: ${({ theme }) => theme.colors.surface.background.gray.intense};
  border: ${({ theme }) => `${theme.border.width.thicker}px solid ${theme.colors.interactive.background.primary.default}`};
  box-shadow: ${({ theme }) => theme.elevation.midRaised};
  cursor: grab;
`;

/** Native range input, styled with Blade tokens. The filled part shows the chosen amount. */
const Range = styled.input<{ $fill: number }>`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: ${({ theme }) => theme.spacing[7]}px;
  margin: 0;
  background: transparent;
  outline: none;

  &::-webkit-slider-runnable-track {
    height: ${({ theme }) => theme.spacing[2]}px;
    border-radius: ${({ theme }) => theme.border.radius.max}px;
    background: ${({ theme, $fill }) =>
      `linear-gradient(to right, ${theme.colors.interactive.background.primary.default} ${$fill}%, ${theme.colors.surface.border.gray.subtle} ${$fill}%)`};
  }
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    margin-top: ${({ theme }) => -(theme.spacing[7] - theme.spacing[2]) / 2}px;
    ${thumb}
  }
  &::-moz-range-track {
    height: ${({ theme }) => theme.spacing[2]}px;
    border-radius: ${({ theme }) => theme.border.radius.max}px;
    background: ${({ theme }) => theme.colors.surface.border.gray.subtle};
  }
  &::-moz-range-progress {
    height: ${({ theme }) => theme.spacing[2]}px;
    border-radius: ${({ theme }) => theme.border.radius.max}px;
    background: ${({ theme }) => theme.colors.interactive.background.primary.default};
  }
  &::-moz-range-thumb {
    ${thumb}
  }
  &:focus-visible::-webkit-slider-thumb {
    box-shadow: ${({ theme }) => `0 0 0 ${theme.spacing[1]}px ${theme.colors.surface.border.primary.muted}`};
  }
`;

/** Small tick under the track where Kosh's recommendation sits */
const Marker = styled.div<{ $at: number }>`
  position: absolute;
  top: 0;
  left: ${({ $at }) => `${$at}%`};
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Tick = styled.div`
  width: ${({ theme }) => theme.border.width.thicker}px;
  height: ${({ theme }) => theme.spacing[3]}px;
  background: ${({ theme }) => theme.colors.surface.text.primary.normal};
`;

export function AmountSlider({ min, max, step, value, recommended, onChange, formatLabel, accessibilityLabel }: Props) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <Box>
      <Range
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        $fill={pct(value)}
        aria-label={accessibilityLabel}
        aria-valuetext={formatLabel(value)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <Box position="relative" height="36px" marginTop="spacing.1">
        <Box position="absolute" left="0px" top="spacing.4">
          <Text size="xsmall" color="surface.text.gray.muted">
            {formatLabel(min)}
          </Text>
        </Box>
        <Marker $at={pct(recommended)}>
          <Tick />
          <Text size="xsmall" weight="semibold" color="surface.text.primary.normal">
            Kosh: {formatLabel(recommended)}
          </Text>
        </Marker>
        <Box position="absolute" right="0px" top="spacing.4">
          <Text size="xsmall" color="surface.text.gray.muted">
            {formatLabel(max)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
