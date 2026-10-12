import styled from 'styled-components';

const Bezel = styled.div(({ theme }) => ({
  padding: theme.spacing[2],
  borderRadius: theme.border.radius['2xlarge'],
  backgroundColor: theme.colors.feedback.background.neutral.intense,
  boxShadow: theme.elevation.midRaised,
}));

const Shot = styled.img(({ theme }) => ({
  display: 'block',
  width: '100%',
  height: 'auto',
  borderRadius: theme.border.radius.xlarge,
}));

/** A screen captured from the prototype, in a phone outline */
export function PhoneShot({ src, alt }: { src: string; alt: string }) {
  return (
    <Bezel>
      <Shot src={src} alt={alt} loading="lazy" />
    </Bezel>
  );
}
