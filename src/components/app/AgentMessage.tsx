import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { Box, Text, useTheme } from '@razorpay/blade/components';
import { brand } from '../../brand';
import { msToS, toBezier } from '../../lib/motion';
import { KoshAvatar } from './KoshAvatar';

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-3px); opacity: 1; }
`;

// Template literal: styled-components only injects keyframes used inside css``
const Dot = styled.span<{ $delay: number }>`
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: ${({ theme }) => theme.border.radius.round};
  background-color: ${({ theme }) => theme.colors.surface.icon.gray.muted};
  animation: ${bounce} ${({ theme }) => theme.motion.duration['2xgentle']}ms
    ${({ theme }) => theme.motion.easing.standard} ${({ $delay }) => $delay}ms infinite;
`;

/** Three bouncing dots: Kosh is thinking */
function Typing() {
  const { theme } = useTheme();
  return (
    <Box display="flex" gap="spacing.2" paddingY="spacing.3" aria-label={`${brand.name} is typing`}>
      {[0, 1, 2].map((i) => (
        <Dot key={i} $delay={i * theme.motion.delay.xquick} />
      ))}
    </Box>
  );
}

type Props = {
  /** Shown after a short "typing" beat, once per session */
  children: React.ReactNode;
  caption?: string;
  /** Skip the typing beat (e.g. on repeat visits) */
  instant?: boolean;
};

const SEEN_KEY = 'kosh-typed';

/** Kosh speaking: avatar, name, then the message after a short typing beat */
export function AgentMessage({ children, caption = 'just now', instant }: Props) {
  const { theme } = useTheme();
  const alreadySeen = (() => {
    try {
      return sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      return false;
    }
  })();
  const [typing, setTyping] = useState(!instant && !alreadySeen);

  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => {
      setTyping(false);
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {
        /* fine */
      }
    }, theme.motion.duration['2xgentle']);
    return () => clearTimeout(t);
  }, [typing, theme]);

  return (
    <Box>
      <Box display="flex" alignItems="center" gap="spacing.3">
        <KoshAvatar size="medium" />
        <Box>
          <Text size="small" weight="semibold">
            {brand.name}
          </Text>
          <Text size="xsmall" color="surface.text.gray.muted">
            {brand.descriptor} · {caption}
          </Text>
        </Box>
      </Box>
      <Box marginTop="spacing.4" minHeight="28px">
        <AnimatePresence mode="wait" initial={false}>
          {typing ? (
            <motion.div key="typing" exit={{ opacity: 0 }} transition={{ duration: msToS(theme.motion.duration.quick) }}>
              <Typing />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: theme.spacing[3] }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: msToS(theme.motion.duration.gentle), ease: toBezier(theme.motion.easing.entrance) }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
