import styled, { css } from 'styled-components';
import { Box, CheckIcon, IconButton, MinusIcon, PlusIcon, Text, useTheme } from '@razorpay/blade/components';

type Props = {
  min: number;
  max: number;
  step: number;
  value: number;
  /** Kosh's recommendation, marked on the track */
  marker?: number;
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

/** Native range input, styled with Blade tokens. Blade's own SliderInput does not render correctly here. */
const Range = styled.input<{ $fill: string }>`
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: ${({ theme }) => theme.spacing[7]}px;
  margin: 0;
  background: transparent;
  outline: none;

  &::-webkit-slider-runnable-track {
    height: ${({ theme }) => theme.spacing[2]}px;
    border-radius: ${({ theme }) => theme.border.radius.max}px;
    background: ${({ theme, $fill }) =>
      `linear-gradient(to right, ${theme.colors.interactive.background.primary.default} ${$fill}, ${theme.colors.surface.border.gray.subtle} ${$fill})`};
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

/** A notch through the track, exactly where the thumb's centre sits at Kosh's recommendation */
const Notch = styled.div<{ $left: string }>`
  position: absolute;
  top: 50%;
  left: ${({ $left }) => $left};
  width: ${({ theme }) => theme.border.width.thicker}px;
  height: ${({ theme }) => theme.spacing[5]}px;
  transform: translate(-50%, -50%);
  border-radius: ${({ theme }) => theme.border.radius.max}px;
  background: ${({ theme }) => theme.colors.data.background.categorical.purple.intense};
`;

/** The label under the notch, with a small pointer up to it */
const Flag = styled.div<{ $left: string; $on: boolean }>`
  position: absolute;
  top: 0;
  left: ${({ $left }) => $left};
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]}px;
  white-space: nowrap;
  padding: ${({ theme }) => `${theme.spacing[1]}px ${theme.spacing[3]}px`};
  border-radius: ${({ theme }) => theme.border.radius.max}px;
  background: ${({ theme, $on }) => ($on ? theme.colors.data.background.categorical.purple.intense : theme.colors.surface.background.primary.subtle)};
  transition: ${({ theme }) => `background ${theme.motion.duration.quick}ms ${theme.motion.easing.standard}`};

  &::before {
    content: '';
    position: absolute;
    top: ${({ theme }) => -theme.spacing[2]}px;
    left: 50%;
    transform: translateX(-50%);
    border: ${({ theme }) => theme.spacing[2]}px solid transparent;
    border-top: 0;
    border-bottom-color: ${({ theme, $on }) => ($on ? theme.colors.data.background.categorical.purple.intense : theme.colors.surface.background.primary.subtle)};
  }
`;

/**
 * A slider with − and + buttons. Kosh's recommendation is marked by a notch on the
 * track and a flag below it; the flag fills in when the slider sits on it.
 */
export function RangeSlider({ min, max, step, value, marker, onChange, formatLabel, accessibilityLabel }: Props) {
  const { theme } = useTheme();
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const fraction = (v: number) => (max > min ? (clamp(v) - min) / (max - min) : 0);
  // The thumb's centre travels from half a thumb in, to half a thumb from the end.
  // Everything that must line up with it (the fill, the notch, the flag) uses the same maths.
  const thumbSize = theme.spacing[7];
  const at = (v: number) => `calc(${thumbSize / 2}px + (100% - ${thumbSize}px) * ${fraction(v)})`;
  // Step from the nearest multiple, so 5,05,000 − 10,000 lands on 5,00,000 rather than 4,95,000
  const stepBy = (dir: 1 | -1) => onChange(clamp((dir > 0 ? Math.floor(value / step) : Math.ceil(value / step)) * step + dir * step));
  const showMarker = marker !== undefined && marker >= min && marker <= max;
  const onMarker = showMarker && value === marker;

  return (
    <Box display="flex" alignItems="flex-start" gap="spacing.3" width="100%">
      <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.1" flexShrink={0}>
        <IconButton icon={MinusIcon} size="large" emphasis="intense" accessibilityLabel={`${accessibilityLabel}: less`} isDisabled={value <= min} onClick={() => stepBy(-1)} />
        <Text size="xsmall" color="surface.text.gray.muted">
          {formatLabel(min)}
        </Text>
      </Box>

      <Box flex={1} minWidth="0px">
        <Box position="relative">
          {showMarker && <Notch $left={at(marker)} />}
          <Range
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            $fill={at(value)}
            aria-label={accessibilityLabel}
            aria-valuetext={formatLabel(value)}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </Box>
        {showMarker && (
          <Box position="relative" height="28px" marginTop="spacing.3">
            <Flag $left={at(marker)} $on={onMarker}>
              {onMarker && <CheckIcon size="xsmall" color="surface.icon.staticWhite.normal" />}
              <Text size="xsmall" weight="semibold" color={onMarker ? 'surface.text.staticWhite.normal' : 'surface.text.primary.normal'}>
                Kosh recommends {formatLabel(marker)}
              </Text>
            </Flag>
          </Box>
        )}
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.1" flexShrink={0}>
        <IconButton icon={PlusIcon} size="large" emphasis="intense" accessibilityLabel={`${accessibilityLabel}: more`} isDisabled={value >= max} onClick={() => stepBy(1)} />
        <Text size="xsmall" color="surface.text.gray.muted">
          {formatLabel(max)}
        </Text>
      </Box>
    </Box>
  );
}
