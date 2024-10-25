import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerifyEmailProps {
  subscriptionId: string;
  spotName: string;
}

// TODO? can we get this from ~env?
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

const VerifySpotSubscriptionEmail = ({
  subscriptionId,
  spotName,
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

        <Section style={buttonContainer}>
          <Button style={button} href={`${baseUrl}/verify/${subscriptionId}`}>
            Verify subscription
          </Button>
        </Section>

        <Text style={paragraph}>
          Once you verify your subscription to {spotName}, you will be notified
          about suitable wind conditions for your spot.
        </Text>

        <Text style={paragraph}>
          You can unsubscribe at any time by clicking the link at the bottom of
          a notification email.
        </Text>

        <Hr style={hr} />

        <Link href={`${baseUrl}`} style={spotterLink}>
          Spotter
        </Link>
      </Container>
    </Body>
  </Html>
);

export default VerifySpotSubscriptionEmail;

VerifySpotSubscriptionEmail.PreviewProps = {
  securityToken: "tt226-5398x",
  spotName: "Aukrog",
};

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

const spotterLink = {
  fontSize: "14px",
  color: "#35b8e0",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "26px 0 26px",
};
