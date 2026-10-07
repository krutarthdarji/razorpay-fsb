import styled from 'styled-components';

/** Sticks to the bottom of the screen's scroll area: the main action is always in reach */
export const ActionBar = styled.div(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  zIndex: 5,
  padding: theme.spacing[5],
  backgroundColor: theme.colors.surface.background.gray.intense,
  borderTop: `${theme.border.width.thin}px solid ${theme.colors.surface.border.gray.subtle}`,
  boxShadow: theme.elevation.highRaised,
}));
