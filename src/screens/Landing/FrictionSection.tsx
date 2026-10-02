import {
  ArrowDownIcon,
  ArrowRightIcon,
  Box,
  CheckCircleIcon,
  Heading,
  Text,
  XCircleIcon,
} from '@razorpay/blade/components';
import { investOptions, merchant } from '../../data';
import { recommendation } from '../../lib/recommendation';
import { formatINR } from '../../lib/format';
import { useIsDesktop } from '../../lib/useIsDesktop';
import { Section, SectionIntro } from './layout';

type Row = { friction: string; frictionDetail: string; fix: string; fixDetail: string };

const r = recommendation;
const rows: Row[] = [
  {
    friction: "Can't tell what's spare",
    frictionDetail: 'Salaries on the 1st, rent on the 5th, GST on the 20th, plus spends that never make it to a calendar.',
    fix: 'One recommended amount',
    fixDetail: `RazorpayX reads your payouts and predicts the rest. You get one number: ${formatINR(r.safe)}.`,
  },
  {
    friction: 'Scared of a failed payout',
    frictionDetail: 'A late salary or GST payment hurts more than any return. So all of it stays in the account, just in case.',
    fix: 'Every payment covered first',
    fixDetail: 'Scheduled payments and the spends we predict are set aside before we recommend a single rupee.',
  },
  {
    friction: 'Investing feels like a project',
    frictionDetail: 'Another app, fund research, words like NAV and XIRR. Not something to do between classes.',
    fix: '3 taps, inside RazorpayX',
    fixDetail: 'One suggested fund, shown in rupees. Confirm with the MPIN you already use for payouts.',
  },
  {
    friction: 'Worried the money gets stuck',
    frictionDetail: 'Fixed deposits lock money in. A surprise bill means breaking it early.',
    fix: 'Instant Redeem',
    fixDetail: 'Need it for a payout? It is back in your account in seconds.',
  },
  {
    friction: 'Idle cash earns nothing',
    frictionDetail: `A current account pays ₹0. A sweep FD pays only about ${investOptions.sweepFd.annualRatePct}% a year.`,
    fix: 'Nearly double a sweep FD',
    fixDetail: `${formatINR(r.comparison.option)} vs ${formatINR(r.comparison.sweepFd)} on ${formatINR(r.safe)} in ${r.days} days.`,
  },
];

function Side({ tone, title, detail }: { tone: 'friction' | 'fix'; title: string; detail: string }) {
  const Icon = tone === 'fix' ? CheckCircleIcon : XCircleIcon;
  return (
    <Box display="flex" gap="spacing.4" alignItems="flex-start" flex={1}>
      <Box flexShrink={0} display="flex">
        <Icon
          size="large"
          color={tone === 'fix' ? 'feedback.icon.positive.intense' : 'feedback.icon.negative.intense'}
        />
      </Box>
      <Box>
        <Heading size="small">{title}</Heading>
        <Text color="surface.text.gray.muted" marginTop="spacing.2">
          {detail}
        </Text>
      </Box>
    </Box>
  );
}

/** Who the merchant is, what gets in the way today, and how RazorpayX fixes each one */
export function FrictionSection() {
  const isDesktop = useIsDesktop();

  return (
    <Section id="problem">
      <SectionIntro
        eyebrow="The problem"
        before="Cash sits idle because nobody knows "
        highlight="what's spare."
        sub={`Meet Ravi. He runs ${merchant.businessName}. After admissions, ${formatINR(merchant.balance)} sits in his RazorpayX current account. He knows some of it is spare. He doesn't know how much, so all of it sits idle.`}
      />

      <Box marginTop={{ base: 'spacing.9', m: 'spacing.11' }} maxWidth="1040px" marginX="auto">
        {isDesktop && (
          <Box display="grid" gridTemplateColumns="1fr 48px 1fr" paddingX="spacing.7" marginBottom="spacing.4">
            <Text size="small" weight="semibold" color="feedback.text.negative.intense">
              TODAY
            </Text>
            <span />
            <Text size="small" weight="semibold" color="feedback.text.positive.intense">
              WITH RAZORPAYX
            </Text>
          </Box>
        )}
        <Box display="flex" flexDirection="column" gap="spacing.4">
          {rows.map((row) => (
            <Box
              key={row.friction}
              display="grid"
              gridTemplateColumns={{ base: '1fr', m: '1fr 48px 1fr' }}
              alignItems="center"
              gap={{ base: 'spacing.5', m: 'spacing.0' }}
              padding="spacing.7"
              borderRadius="large"
              borderWidth="thin"
              borderColor="surface.border.gray.subtle"
              backgroundColor="surface.background.gray.intense"
            >
              <Side tone="friction" title={row.friction} detail={row.frictionDetail} />
              <Box display="flex" justifyContent="center">
                {isDesktop ? (
                  <ArrowRightIcon size="large" color="surface.icon.gray.muted" />
                ) : (
                  <ArrowDownIcon size="large" color="surface.icon.gray.muted" />
                )}
              </Box>
              <Box
                height="100%"
                display="flex"
                alignItems="center"
                padding="spacing.5"
                borderRadius="medium"
                backgroundColor="feedback.background.positive.subtle"
              >
                <Side tone="fix" title={row.fix} detail={row.fixDetail} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Section>
  );
}
