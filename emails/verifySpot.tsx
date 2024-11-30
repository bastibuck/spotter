import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { type InferSelectModel } from "drizzle-orm";
import Footer from "~/components/emails/Footer";
import Table from "~/components/emails/Table";
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
    <Preview>
      Verify your subscription to
      {spotName}
    </Preview>

    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>
          <Text style={{ ...heading, display: "inline" }}>
            Verify your subscription to{" "}
          </Text>
          <Text style={{ ...heading, display: "inline", fontWeight: "bold" }}>
            {spotName}
          </Text>
        </Heading>

        <Text style={paragraph}>
          You are subscribing to wind conditions at {spotName} that match
        </Text>

        <Table
          data={[
            {
              label: "Wind speed",
              value: `${subscription.windSpeedMin} - ${subscription.windSpeedMax} m/s`,
            },
            {
              label: "Wind directions",
              value: subscription.windDirections.join(", "),
            },
          ]}
        />

        <Text style={paragraph}>
          Once you verify your subscription to {spotName}, you will be notified
          about suitable wind conditions for your spot.
        </Text>

        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${baseUrl}/subscription/${subscription.id}/verify`}
          >
            Verify subscription
          </Button>
        </Section>

        <Text style={paragraph}>
          You can unsubscribe at any time by clicking the link at the bottom of
          a notification email.
        </Text>

        <Footer
          spotName={spotName}
          subscriptionId={subscription.id}
          kiterId={kiter.id}
        />
      </Container>
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

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "0 0 10px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const buttonContainer = {
  padding: "10px 0 20px",
};

const button = {
  backgroundColor: "#35b8e0",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
};
