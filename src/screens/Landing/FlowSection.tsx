import styled from 'styled-components';
import { ArrowRightIcon, Box, Button, Heading, Text } from '@razorpay/blade/components';
import { brand } from '../../brand';
import { merchant, plan } from '../../data';
import { formatMonths } from '../../lib/dates';
import { formatINR } from '../../lib/format';
import { cycle } from '../../lib/recommendation';
import recommendation from '../../assets/flow/1-recommendation.webp';
import planShot from '../../assets/flow/2-plan.webp';
import order from '../../assets/flow/3-order.webp';
import growth from '../../assets/flow/4-growth.webp';
import withdraw from '../../assets/flow/5-withdraw.webp';
import { Label, Section, SectionBody, SectionIntro } from './layout';
import { PhoneShot } from './PhoneShot';

/** Side by side on phones (screen, then what happens); five columns on wide screens */
const Steps = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing[8],
  [`@media (min-width: ${theme.breakpoints.l}px)`]: { gridTemplateColumns: 'repeat(5, 1fr)', gap: theme.spacing[5] },
}));

const Step = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '42% 1fr',
  gap: theme.spacing[5],
  alignItems: 'center',
  // Keep each step's text right under its screen, whatever the neighbours' heights
  alignContent: 'start',
  [`@media (min-width: ${theme.breakpoints.l}px)`]: { gridTemplateColumns: '1fr', alignItems: 'start', gap: theme.spacing[6] },
}));

export function FlowSection({ onDemo }: { onDemo: () => void }) {
  const r = cycle;
  const owner = merchant.ownerFirstName;
  const steps = [
    {
      shot: recommendation,
      title: `${brand.name} spots the surplus`,
      kosh: `After fees land, ${brand.name} projects the balance and puts its recommendation on Home: ${formatINR(r.amount)} for ${formatMonths(r.months)}.`,
      owner: `${owner} opens the app and taps "Put my ${formatINR(r.amount)} to work".`,
    },
    {
      shot: planShot,
      title: 'The plan is ready',
      kosh: `${brand.name} fills in the amount, the duration and a 50/50 split across two top-rated funds.`,
      owner: `${owner} can change any of it with the sliders, or leave it as it is.`,
    },
    {
      shot: order,
      title: 'One tap invests it',
      kosh: `${brand.name} places one order across both funds and shows when the units will be allotted.`,
      owner: `${owner} confirms with the MPIN he already uses for payouts.`,
    },
    {
      shot: growth,
      title: 'The money grows',
      kosh: `${brand.name} shows what the money has earned so far, what it earns a day, and where it is heading.`,
      owner: `${owner} does nothing. Salaries, rent and taxes go out as usual.`,
    },
    {
      shot: withdraw,
      title: 'Need it back? Instantly',
      kosh: `Razorpay credits the account at once, free for ${plan.freeCreditDays} day, and settles with the fund the next working day.`,
      owner: `${owner} picks an amount and a fund, and taps Withdraw.`,
    },
  ];

  return (
    <Section id="flow" tone="gray">
      <SectionIntro
        step="06"
        label="How it works"
        title="The owner's flow, "
        highlight="start to finish."
        sub={`Five screens from the working prototype, in order. Each one shows what ${brand.name} does and what the owner does. From the first screen to an invested surplus takes under 2 minutes.`}
      />

      <SectionBody>
        <Steps>
          {steps.map((s, i) => (
            <Step key={s.title}>
              <PhoneShot src={s.shot} alt={`Prototype screen: ${s.title}`} />
              <Box>
                <Label>Step {i + 1}</Label>
                <Heading size="large" marginTop="spacing.1">
                  {s.title}
                </Heading>
                <Box marginTop="spacing.4">
                  <Label tone="muted">What {brand.name} does</Label>
                  <Text marginTop="spacing.1">{s.kosh}</Text>
                </Box>
                <Box marginTop="spacing.4">
                  <Label tone="muted">What the owner does</Label>
                  <Text marginTop="spacing.1">{s.owner}</Text>
                </Box>
              </Box>
            </Step>
          ))}
        </Steps>

        <Box display="flex" flexDirection={{ base: 'column', s: 'row' }} alignItems={{ base: 'flex-start', s: 'center' }} gap="spacing.4" marginTop={{ base: 'spacing.8', m: 'spacing.10' }}>
          <Button size="large" icon={ArrowRightIcon} iconPosition="right" onClick={onDemo}>
            Try the flow yourself
          </Button>
          <Text size="large" color="surface.text.gray.subtle">
            The prototype is live. Every number in it is worked out, not typed in.
          </Text>
        </Box>
      </SectionBody>
    </Section>
  );
}
