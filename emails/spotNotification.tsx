import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { type InferSelectModel } from "drizzle-orm";
import { DateTime } from "luxon";
import { Footer } from "~/components/emails/Footer";
import Table from "~/components/emails/Table";
import { type kiters, type subscriptions } from "~/server/db/schema";

interface VerifyEmailProps {
  subscription: Pick<
    InferSelectModel<typeof subscriptions>,
    "id" | "windDirections" | "windSpeedMin" | "windSpeedMax"
  >;
  spotName: string;
  date: Date;
  kiter: Pick<InferSelectModel<typeof kiters>, "id">;
  suitableHours: {
    windSpeed: number;
    windDirection: string;
    from: number;
    to: number;
  }[];
}

const SpotNotificationEmail = ({
  subscription,
  spotName,
  date,
  kiter,
  suitableHours,
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
              Wind conditions for{" "}
            </Text>
            <Text style={{ ...heading, display: "inline", fontWeight: "bold" }}>
              {spotName}{" "}
            </Text>
            <Text style={{ ...heading, display: "inline" }}>suitable on </Text>
            <Text style={{ ...heading, display: "inline", fontWeight: "bold" }}>
              {day}
            </Text>
          </Heading>

          <Text style={paragraph}>
            You subscribed for wind conditions at {spotName} that match
          </Text>

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

          <Text style={paragraph}>
            The requested wind conditions for {spotName} are projected to be
            suitable on{" "}
            <span style={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
              {day}
            </span>
            .
          </Text>

          <Heading style={{ ...heading, ...subline }}>Conditions</Heading>

          <Table
            data={suitableHours.map((hour) => ({
              label: `${DateTime.fromFormat(hour.from.toString(), "H").toFormat("T")} - ${DateTime.fromFormat(hour.to.toString(), "H").toFormat("T")}`,
              value: `${Math.floor(hour.windSpeed)} kn, ${hour.windDirection}`,
            }))}
          />

          <Text style={paragraph}>
            Check your calendar and get ready to go kitesurfing!
          </Text>
        </Container>

        <Footer
          spotName={spotName}
          subscriptionId={subscription.id}
          kiterId={kiter.id}
        />
      </Body>
    </Html>
  );
};

export default SpotNotificationEmail;

SpotNotificationEmail.PreviewProps = {
  subscription: {
    id: "65356434-ca00-4273-afff-af6354dcb731",
    windDirections: ["N", "NE", "E"],
    windSpeedMin: 5,
    windSpeedMax: 10,
  },
  spotName: "Aukrog",
  date: new Date(),
  kiter: {
    id: "6830aeb4-c723-43ab-8761-a383c4e1c4a0",
  },
  suitableHours: [
    {
      windDirection: "N",
      windSpeed: 18,
      from: 8,
      to: 9,
    },
    {
      windDirection: "NE",
      windSpeed: 20,
      from: 9,
      to: 10,
    },
    {
      windDirection: "E",
      windSpeed: 22,
      from: 10,
      to: 11,
    },
    {
      windDirection: "E",
      windSpeed: 22,
      from: 11,
      to: 12,
    },
  ],
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

const subline = {
  fontSize: "18px",
};

const paragraph = {
  margin: "0 0 10px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};
