import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle(({ theme }) => ({
  '*, *::before, *::after': { boxSizing: 'border-box' },
  'html, body, #root': { margin: 0, padding: 0, minWidth: 320 },
  html: {
    backgroundColor: theme.colors.surface.background.cloud.subtle,
    WebkitTextSizeAdjust: '100%',
    textSizeAdjust: '100%',
  },
  body: {
    // No pull-to-refresh or rubber-band on the page; screens scroll inside the app
    overscrollBehavior: 'none',
    WebkitFontSmoothing: 'antialiased',
    WebkitTapHighlightColor: 'transparent',
  },
}));
