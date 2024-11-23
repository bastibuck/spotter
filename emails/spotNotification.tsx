import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { DateTime } from "luxon";
import Footer from "~/components/emails/Footer";

interface VerifyEmailProps {
  subscriptionId: string;
  spotName: string;
  date: Date;
}

const SpotNotificationEmail = ({
  subscriptionId,
  spotName,
  date,
}: VerifyEmailProps) => {
  const day = DateTime.fromJSDate(date).toFormat("dd. LLL yyyy");

  return (
    <Html>
      <Head />
      <Preview>
        Wind conditions for {spotName} suitable on {day}
      </Preview>

      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            <Text style={{ ...heading, display: "inline" }}>
              Wind conditions for
            </Text>
            <Text style={{ ...heading, display: "inline", fontWeight: "bold" }}>
              {spotName}
            </Text>
            <Text style={{ ...heading, display: "inline" }}>
              suitable on {day}
            </Text>
          </Heading>

          <Text style={paragraph}>
            The requested wind conditions for {spotName} are suitable. Check
            your calendar and get ready to go kite surfing!
          </Text>

          <Footer spotName={spotName} subscriptionId={subscriptionId} />
        </Container>
      </Body>
    </Html>
  );
};

export default SpotNotificationEmail;

SpotNotificationEmail.PreviewProps = {
  subscriptionId: "65356434-ca00-4273-afff-af6354dcb731",
  spotName: "Aukrog",
  date: new Date(),
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
