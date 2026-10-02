import { useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '@razorpay/blade/components';

/**
 * Widest the app ever gets. Covers every current phone (largest is 440px),
 * so phones always get the full width. On laptops the same mobile layout
 * sits in a centred column of this width, full window height.
 */
export const APP_MAX_WIDTH = 480;

const Page = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: theme.colors.surface.background.cloud.subtle,
}));

const Column = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${APP_MAX_WIDTH}px;
  height: 100vh;
  height: 100dvh; /* follows mobile browser bars as they show and hide */
  overflow: hidden;
  padding-top: env(safe-area-inset-top);
  background-color: ${({ theme }) => theme.colors.surface.background.gray.moderate};
  /* Containing block for position: fixed children (BottomNav, Toast, BottomSheet),
     so they stay inside the column on wide screens. */
  transform: translateZ(0);

  @media (min-width: ${APP_MAX_WIDTH + 1}px) {
    border-left: ${({ theme }) => `${theme.border.width.thin}px solid ${theme.colors.surface.border.gray.subtle}`};
    border-right: ${({ theme }) => `${theme.border.width.thin}px solid ${theme.colors.surface.border.gray.subtle}`};
  }
`;

/** Colours the mobile browser's address bar to match the app */
function useThemeColorMeta(color: string) {
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = color;
  }, [color]);
}

export function MobileShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  useThemeColorMeta(theme.colors.surface.background.gray.moderate);

  return (
    <Page>
      <Column>{children}</Column>
    </Page>
  );
}
