import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { Avatar, Box, Divider, Text } from '@razorpay/blade/components';
import razorpayxLogo from '../../assets/razorpayx-logo.png';
import { brand } from '../../brand';
import { merchant } from '../../data';
import { paths } from '../../routes';
import { KoshAvatar } from './KoshAvatar';

const Bar = styled.header(({ theme }) => ({
  position: 'relative',
  zIndex: 10,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: theme.spacing[11],
  padding: `0 ${theme.spacing[5]}px`,
  backgroundColor: theme.colors.surface.background.gray.intense,
  borderBottom: `${theme.border.width.thin}px solid ${theme.colors.surface.border.gray.subtle}`,
}));

const Brand = styled(RouterLink)({ display: 'flex', alignItems: 'center', textDecoration: 'none' });
const Logo = styled.img(({ theme }) => ({ height: theme.spacing[6], width: 'auto', display: 'block' }));

/** The app's own top bar, inside the phone column: RazorpayX logo, Kosh, and the owner */
export function AppHeader() {
  return (
    <Bar>
      <Brand to={paths.landing} aria-label={`${brand.fullName}, about`}>
        <Logo src={razorpayxLogo} alt="RazorpayX" />
        <Divider orientation="vertical" marginX="spacing.3" height="18px" />
        <Box display="flex" alignItems="center" gap="spacing.2">
          <KoshAvatar size="small" />
          <Text weight="semibold">{brand.name}</Text>
        </Box>
      </Brand>
      <Avatar name={merchant.ownerName} size="small" color="primary" />
    </Bar>
  );
}
