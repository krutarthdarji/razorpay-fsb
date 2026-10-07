import { motion } from 'framer-motion';
import { useTheme } from '@razorpay/blade/components';
import { msToS, toBezier } from '../../lib/motion';

/** Fades and lifts children in, staggered by `index`, using Blade motion tokens */
export function Reveal({ index = 0, children }: { index?: number; children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: theme.spacing[5] }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * msToS(theme.motion.delay.xquick) * 0.6,
        duration: msToS(theme.motion.duration.gentle),
        ease: toBezier(theme.motion.easing.entrance),
      }}
    >
      {children}
    </motion.div>
  );
}
