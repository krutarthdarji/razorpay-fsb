import { useTheme } from '@razorpay/blade/components';

/** A tiny line of values, no axes. For cards. */
export function Sparkline({ values, height = 40, markIndex }: { values: number[]; height?: number; markIndex?: number }) {
  const { theme } = useTheme();
  const w = 100;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const y = (v: number) => height - ((v - min) / (max - min || 1)) * (height - 4) - 2;
  const x = (i: number) => (i / (values.length - 1)) * w;
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
  const stroke = theme.colors.data.background.categorical.blue.strong;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} preserveAspectRatio="none" aria-hidden>
      <path d={`${line} L${w},${height} L0,${height} Z`} fill={theme.colors.data.background.categorical.blue.faint} />
      <path d={line} fill="none" stroke={stroke} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      {markIndex !== undefined && (
        <circle cx={x(markIndex)} cy={y(values[markIndex])} r={3} fill={theme.colors.feedback.background.notice.intense} vectorEffect="non-scaling-stroke" />
      )}
    </svg>
  );
}

/** Tiny bars, the last one highlighted. For cards. */
export function MiniBars({ values, tone }: { values: number[]; tone: 'in' | 'out' }) {
  const { theme } = useTheme();
  const max = Math.max(...values);
  const palette = theme.colors.data.background.categorical[tone === 'in' ? 'green' : 'red'];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: theme.spacing[1], height: theme.spacing[9] }} aria-hidden>
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${Math.max(8, (v / max) * 100)}%`,
            borderRadius: theme.border.radius.xsmall,
            backgroundColor: i === values.length - 1 ? palette.intense : palette.faint,
          }}
        />
      ))}
    </div>
  );
}
