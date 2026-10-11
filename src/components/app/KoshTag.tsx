import { Box, Heading, Text } from '@razorpay/blade/components';
import { brand } from '../../brand';
import { KoshAvatar } from './KoshAvatar';

type Props = { label?: string; onDark?: boolean; size?: 'medium' | 'large' };

/** "Kosh · Razorpay's agentic AI": marks anything Kosh recommends or projects. `large` makes it the card's title. */
export function KoshTag({ label, onDark, size = 'medium' }: Props) {
  const title = label ?? brand.name;
  return (
    <Box display="flex" alignItems="center" gap="spacing.3">
      <KoshAvatar size={size === 'large' ? 'large' : 'medium'} />
      <Box>
        {size === 'large' ? (
          <Heading size="large">{title}</Heading>
        ) : (
          <Text size="small" weight="semibold" color={onDark ? 'surface.text.staticWhite.normal' : 'surface.text.gray.normal'}>
            {title}
          </Text>
        )}
        <Text size="xsmall" color={onDark ? 'surface.text.staticWhite.muted' : 'surface.text.gray.muted'}>
          {brand.descriptor}
        </Text>
      </Box>
    </Box>
  );
}
