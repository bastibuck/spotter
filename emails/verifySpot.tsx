import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";
import { getBaseUrl } from "~/lib/url";

interface VerifyEmailProps {
  subscriptionId: string;
  spotName: string;
}

const baseUrl = getBaseUrl();

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
          <Button
            style={button}
            href={`${baseUrl}/verify-spot/${subscriptionId}`}
          >
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

        <Section style={footer}>
          <Row style={{ height: "3em" }}>
            <Column>
              <Link href={`${baseUrl}`} style={spotterLink}>
                Spotter
              </Link>
            </Column>
          </Row>

          <Row>
            <Column>
              <Link
                href={`${baseUrl}/unsubscribe-spot/${subscriptionId}`}
                style={metaLink}
              >
                Unsubscribe {spotName}
              </Link>
            </Column>

            <Column>
              <Link
                href={`${baseUrl}/unsubscribe-all-spots/${subscriptionId}`}
                style={metaLink}
              >
                Unsubscribe all spots
              </Link>
            </Column>
          </Row>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default VerifySpotSubscriptionEmail;

VerifySpotSubscriptionEmail.PreviewProps = {
  subscriptionId: "65356434-ca00-4273-afff-af6354dcb731",
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

const footer = {
  marginTop: 26,
  padding: "20px 20px 40px",
  background: "#f9fafb",
};

const spotterLink = {
  fontSize: "14px",
  color: "#35b8e0",
};

const metaLink = {
  fontSize: "14px",
  color: "#cececf",
};
