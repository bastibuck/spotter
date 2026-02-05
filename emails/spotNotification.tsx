import {
  Body,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { type InferSelectModel } from "drizzle-orm";
import { DateTime } from "luxon";
import {
  ContentSection,
  Footer,
  Header,
  HeroSection,
  Table,
  colors,
  main,
  paragraph,
  sectionLabel,
} from "~/components/emails";
import { type kiters, type subscriptions } from "~/server/db/schema";

interface SpotNotificationProps {
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
}: SpotNotificationProps) => {
  const day = DateTime.fromJSDate(date).toFormat("EEEE, dd LLL");

  return (
    <Html>
      <Head />
      <Preview>
        Wind alert for {spotName} on {day}
      </Preview>

      <Body style={main}>
        <Header />

        <HeroSection label="Wind Alert" title={spotName} subtitle={day} />

        <ContentSection>
          <Text style={paragraph}>
            Great news! The wind conditions at <strong>{spotName}</strong> are
            projected to match your preferences. Time to gear up!
          </Text>

          <Text style={sectionLabel}>Forecast</Text>

          <Table
            data={suitableHours.map((hour) => ({
              label: `${DateTime.fromFormat(hour.from.toString(), "H").toFormat("HH:mm")} - ${DateTime.fromFormat(hour.to.toString(), "H").toFormat("HH:mm")}`,
              value: `${Math.floor(hour.windSpeed)} kn ${hour.windDirection}`,
            }))}
          />

          <Text style={sectionLabel}>Your Preferences</Text>

          <Table
            data={[
              {
                label: "Wind speed",
                value: `${subscription.windSpeedMin} - ${subscription.windSpeedMax} kn`,
              },
              {
                label: "Directions",
                value: subscription.windDirections.join(", "),
              },
            ]}
          />

          <Section style={ctaSection}>
            <Text style={ctaText}>
              Check your calendar and get ready to hit the water!
            </Text>
          </Section>
        </ContentSection>

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
} satisfies SpotNotificationProps;

// Component-specific styles
const ctaSection = {
  backgroundColor: "rgba(6, 182, 212, 0.1)",
  borderRadius: "12px",
  padding: "20px",
  marginTop: "24px",
  textAlign: "center" as const,
  border: `1px solid ${colors.borderAccent}`,
};

const ctaText = {
  fontSize: "16px",
  fontWeight: "600" as const,
  color: colors.accent,
  margin: "0",
};
