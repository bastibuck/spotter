import {
  Body,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { type InferSelectModel } from "drizzle-orm";
import {
  ContentSection,
  Footer,
  Header,
  PrimaryButton,
  Table,
  colors,
  main,
  heading,
  mutedText,
  paragraphCentered,
  sectionLabel,
} from "~/components/emails";
import { getBaseUrl } from "~/lib/url";
import { type kiters, type subscriptions } from "~/server/db/schema";

interface VerifyEmailProps {
  subscription: Pick<
    InferSelectModel<typeof subscriptions>,
    "id" | "windDirections" | "windSpeedMin" | "windSpeedMax"
  >;
  spotName: string;
  kiter: Pick<InferSelectModel<typeof kiters>, "id">;
}

const baseUrl = getBaseUrl();

const VerifySpotSubscriptionEmail = ({
  subscription,
  spotName,
  kiter,
}: VerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your subscription to {spotName}</Preview>

    <Body style={main}>
      <Header />

      <ContentSection>
        <Heading style={heading}>Verify your subscription</Heading>

        <Text style={spotNameHighlight}>{spotName}</Text>

        <Text style={paragraphCentered}>
          You&apos;re almost ready to receive wind alerts! Confirm your
          subscription to start getting notified when conditions are perfect for
          kitesurfing.
        </Text>

        <Text style={sectionLabel}>Your alert preferences</Text>

        <Table
          data={[
            {
              label: "Wind speed",
              value: `${subscription.windSpeedMin} - ${subscription.windSpeedMax} kn`,
            },
            {
              label: "Wind directions",
              value: subscription.windDirections.join(", "),
            },
          ]}
        />

        <PrimaryButton
          href={`${baseUrl}/subscription/${subscription.id}/verify`}
        >
          Verify Subscription
        </PrimaryButton>

        <Text style={mutedText}>
          Once verified, you&apos;ll receive notifications when wind conditions
          match your preferences. You can unsubscribe at any time.
        </Text>
      </ContentSection>

      <Footer
        spotName={spotName}
        subscriptionId={subscription.id}
        kiterId={kiter.id}
      />
    </Body>
  </Html>
);

export default VerifySpotSubscriptionEmail;

VerifySpotSubscriptionEmail.PreviewProps = {
  subscription: {
    id: "65356434-ca00-4273-afff-af6354dcb731",
    windDirections: ["N", "NE"],
    windSpeedMin: 5,
    windSpeedMax: 10,
  },
  spotName: "Aukrog",
  kiter: {
    id: "f6076292-7fb6-460e-9432-5919830f0ba8",
  },
} satisfies VerifyEmailProps;

// Component-specific styles
const spotNameHighlight = {
  fontSize: "20px",
  fontWeight: "600" as const,
  color: colors.accent,
  textAlign: "center" as const,
  margin: "0 0 24px",
};
