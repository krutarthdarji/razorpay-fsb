import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { Box, Divider, Link, Text, useTheme } from '@razorpay/blade/components';
import razorpayxLogo from '../assets/razorpayx-logo.png';
import { brand } from '../brand';
import { paths } from '../routes';
import { useIsDesktop } from '../lib/useIsDesktop';
import { KoshAvatar } from './app/KoshAvatar';

/** Nav bar height, from the spacing scale. The landing page offsets by this. */
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
const Logo = styled.img(({ theme }) => ({ height: theme.spacing[7], width: 'auto', display: 'block' }));

const links = [
  { label: 'Problem', href: '#problem' },
  { label: "Who it's for", href: '#merchant' },
  { label: 'Today', href: '#today' },
  { label: 'Solution', href: '#solution' },
  { label: 'How it works', href: '#flow' },
  { label: 'Decisions', href: '#decisions' },
  { label: 'Metrics', href: '#metrics' },
];

/** The landing page's nav: responsive, unlike the app's own header */
export function LandingNav() {
  const { theme } = useTheme();
  const isDesktop = useIsDesktop();

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
        <BrandLink to={paths.landing} aria-label={brand.fullName}>
          <Logo src={razorpayxLogo} alt="RazorpayX" />
          <Divider orientation="vertical" marginX="spacing.3" height="20px" />
          <Box display="flex" alignItems="center" gap="spacing.2">
            <KoshAvatar size="small" />
            <Text size="large" weight="semibold">
              {brand.name}
            </Text>
          </Box>
        </BrandLink>

        {isDesktop && (
          <Box display="flex" gap="spacing.7">
            {links.map((l) => (
              <Link key={l.href} href={l.href} color="neutral" size="medium">
                {l.label}
              </Link>
            ))}
          </Box>
        )}
      </Box>
    </Bar>
  );
}
