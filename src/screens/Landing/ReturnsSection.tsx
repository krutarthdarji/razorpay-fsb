import { motion } from 'framer-motion';
import { Amount, Badge, Box, Text, useTheme } from '@razorpay/blade/components';
import { investOptions } from '../../data';
import type { InvestOptionId } from '../../data';
import { earnings } from '../../lib/forecast';
import { msToS, toBezier } from '../../lib/motion';
import { recommendation } from '../../lib/recommendation';
import { formatINR } from '../../lib/format';
import { Section, SectionIntro } from './layout';

const order: InvestOptionId[] = ['liquid', 'overnight', 'sweepFd', 'idle'];

export function ReturnsSection() {
  const { theme } = useTheme();
  const { safe, days } = recommendation;
  const rows = order.map((id) => ({ option: investOptions[id], earned: earnings(safe, investOptions[id].annualRatePct, days) }));
  const max = Math.max(...rows.map((r) => r.earned));

  const barColor: Record<InvestOptionId, string> = {
    liquid: theme.colors.interactive.background.primary.default,
    overnight: theme.colors.data.background.categorical.blue.moderate,
    sweepFd: theme.colors.data.background.categorical.gray.intense,
    idle: theme.colors.data.background.categorical.gray.intense,
  };

  return (
    <Section id="returns">
      <SectionIntro
        eyebrow="The returns"
        before="Same money. "
        highlight="More earned."
        sub={`What ${formatINR(safe)} earns in ${days} days.`}
      />

      <Box maxWidth="840px" marginX="auto" marginTop={{ base: 'spacing.9', m: 'spacing.11' }}>
        <Box display="flex" flexDirection="column" gap="spacing.6">
          {rows.map(({ option, earned }, i) => (
            <Box key={option.id}>
              <Box display="flex" justifyContent="space-between" alignItems="baseline" marginBottom="spacing.3">
                <Box display="flex" alignItems="center" gap="spacing.3">
                  <Text size="large" weight={option.isRecommended ? 'semibold' : 'regular'}>
                    {option.name}
                  </Text>
                  {option.isRecommended && (
                    <Badge color="primary" size="small">
                      Recommended
                    </Badge>
                  )}
                </Box>
                <Amount
                  value={earned}
                  type="heading"
                  size="medium"
                  weight="semibold"
                  suffix="none"
                  color={option.isRecommended ? 'surface.text.primary.normal' : undefined}
                />
              </Box>
              <Box height="12px" borderRadius="max" backgroundColor="surface.background.gray.moderate" overflow="hidden">
                <motion.div
                  style={{ height: '100%', borderRadius: theme.border.radius.max, backgroundColor: barColor[option.id] }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(earned / max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * msToS(theme.motion.delay.xquick),
                    duration: msToS(theme.motion.duration.xgentle),
                    ease: toBezier(theme.motion.easing.emphasized),
                  }}
                />
              </Box>
              <Text size="small" color="surface.text.gray.muted" marginTop="spacing.2">
                {option.annualRatePct > 0 ? `About ${option.annualRatePct}% a year` : 'Earns nothing'}
              </Text>
            </Box>
          ))}
        </Box>

        <Box
          marginTop="spacing.8"
          padding="spacing.6"
          borderRadius="large"
          backgroundColor="feedback.background.positive.subtle"
          display="flex"
          flexDirection={{ base: 'column', m: 'row' }}
          alignItems="center"
          justifyContent="center"
          gap="spacing.3"
        >
          <Amount
            value={recommendation.comparison.moreThanSweepFd}
            type="heading"
            size="xlarge"
            weight="semibold"
            suffix="none"
            color="feedback.text.positive.intense"
          />
          <Text size="large" color="feedback.text.positive.intense">
            more than a sweep FD, on the same money, in {days} days.
          </Text>
        </Box>
        <Text size="small" color="surface.text.gray.muted" textAlign="center" marginTop="spacing.4">
          Returns are illustrative and before tax. They are not guaranteed.
        </Text>
      </Box>
    </Section>
  );
}
