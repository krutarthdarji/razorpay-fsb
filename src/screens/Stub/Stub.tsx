import { useNavigate } from 'react-router-dom';
import { AppBar, AppBarLeading, Box, Text } from '@razorpay/blade/components';

/** Placeholder for screens not built yet */
export function Stub({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <Box>
      <AppBar
        variant="subtle"
        backButton={{ onClick: () => navigate(-1), accessibilityLabel: 'Back' }}
      >
        <AppBarLeading title={title} />
      </AppBar>
      <Box padding="spacing.5">
        <Text color="surface.text.gray.muted">Coming next.</Text>
      </Box>
    </Box>
  );
}
