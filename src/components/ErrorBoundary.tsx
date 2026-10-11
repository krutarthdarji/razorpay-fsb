import { Component } from 'react';
import { Box, Button, Heading, Text } from '@razorpay/blade/components';
import { brand } from '../brand';
import { paths } from '../routes';

/** Clears the saved demo and opens the app again from the start */
function restart() {
  try {
    sessionStorage.clear();
  } catch {
    /* storage blocked: reloading is enough */
  }
  window.location.assign(paths.home);
}

/** If a screen ever fails to draw, show a way back instead of a blank page */
export class ErrorBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <Box minHeight="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="spacing.4" padding="spacing.7" textAlign="center">
        <Heading size="large">{`${brand.name} needs a fresh start`}</Heading>
        <Text color="surface.text.gray.muted">Something didn't load as it should. Restart the demo to carry on.</Text>
        <Button onClick={restart}>Restart demo</Button>
      </Box>
    );
  }
}
