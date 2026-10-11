import { Box, ChevronLeftIcon, Heading, IconButton, Text } from '@razorpay/blade/components';
import { useGoBack } from '../../lib/useGoBack';
import { paths } from '../../routes';

/** Back arrow and title for screens you drill into */
export function PageTitle({ title, subtitle, backTo = paths.home }: { title: string; subtitle?: string; backTo?: string }) {
  const goBack = useGoBack(backTo);
  return (
    <Box display="flex" alignItems="center" gap="spacing.3" paddingX="spacing.5" paddingTop="spacing.5">
      <IconButton icon={ChevronLeftIcon} accessibilityLabel="Back" size="large" onClick={goBack} />
      <Box>
        <Heading size="medium">{title}</Heading>
        {subtitle && (
          <Text size="small" color="surface.text.gray.muted">
            {subtitle}
          </Text>
        )}
      </Box>
    </Box>
  );
}
