import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Box, Button, Divider, Link, Text, useTheme } from '@razorpay/blade/components';
import razorpayxLogo from '../assets/razorpayx-logo.png';
import { paths } from '../routes';
import { useIsDesktop } from '../lib/useIsDesktop';

/** Nav bar height, from the spacing scale. Everything below the nav offsets by this. */
export const navHeight = (spacing: Record<number, number>) => spacing[11];

/** Widest the landing page content gets */
export const PAGE_MAX_WIDTH = 1200;

const Bar = styled.header(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  paddingTop: 'env(safe-area-inset-top)',
  backgroundColor: theme.colors.surface.background.gray.intense,
  borderBottom: `${theme.border.width.thin}px solid ${theme.colors.surface.border.gray.subtle}`,
}));

const BrandLink = styled(RouterLink)({ display: 'flex', alignItems: 'center', textDecoration: 'none' });

/** The RazorpayX wordmark, as on razorpay.com/x */
const Logo = styled.img(({ theme }) => ({ height: theme.spacing[7], width: 'auto', display: 'block' }));

const landingLinks = [
  { label: 'The problem', href: '#problem' },
  { label: 'Our edge', href: '#recommendation' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Returns', href: '#returns' },
];

/** Fixed on every path: RazorpayX logo and product name on the left */
export function GlobalNav() {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const isLanding = pathname === paths.landing;

  return (
    <Bar>
      <Box
        height={`${navHeight(theme.spacing)}px`}
        maxWidth={`${PAGE_MAX_WIDTH}px`}
        marginX="auto"
        paddingX={{ base: 'spacing.5', m: 'spacing.8' }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <BrandLink to={paths.landing} aria-label="RazorpayX Surplus, home">
          <Logo src={razorpayxLogo} alt="RazorpayX" />
          <Divider orientation="vertical" marginX="spacing.3" height="20px" />
          <Text size="large" color="surface.text.gray.muted">
            Surplus
          </Text>
        </BrandLink>

        {isLanding && isDesktop && (
          <Box display="flex" gap="spacing.8">
            {landingLinks.map((l) => (
              <Link key={l.href} href={l.href} color="neutral" size="medium">
                {l.label}
              </Link>
            ))}
          </Box>
        )}

        {!isLanding && (
          <Button variant="tertiary" size="small" onClick={() => navigate(paths.landing)}>
            About
          </Button>
        )}
      </Box>
    </Bar>
  );
}
