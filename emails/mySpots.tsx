import {
  Body,
  Column,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { type InferSelectModel } from "drizzle-orm";
import {
  ContentSection,
  FooterBase,
  Header,
  colors,
  heading,
  main,
  subheading,
} from "~/components/emails";
import { getBaseUrl } from "~/lib/url";
import {
  type spots,
  type kiters,
  type subscriptions,
} from "~/server/db/schema";

interface MySpotsEmailProps {
  spots: {
    name: InferSelectModel<typeof spots>["name"];

    windSpeedMin: InferSelectModel<typeof subscriptions>["windSpeedMin"];
    windSpeedMax: InferSelectModel<typeof subscriptions>["windSpeedMax"];
    windDirections: InferSelectModel<typeof subscriptions>["windDirections"];

    subscriptionId: InferSelectModel<typeof subscriptions>["id"];
    verifiedAt: InferSelectModel<typeof subscriptions>["verifiedAt"];
  }[];
  kiter: Pick<InferSelectModel<typeof kiters>, "id">;
}

const baseUrl = getBaseUrl();

const MySpotsEmail = ({ spots, kiter }: MySpotsEmailProps) => (
  <Html>
    <Head />
    <Preview>Manage your spot subscriptions</Preview>

    <Body style={main}>
      <Header />

      <ContentSection>
        <Heading style={heading}>Your Spot Subscriptions</Heading>
        <Text style={subheading}>Manage your wind alert preferences</Text>

        {/* Spots List */}
        <Section style={spotsContainer}>
          {spots.map((spot) => (
            <Section key={spot.subscriptionId} style={spotCard}>
              <Row>
                <Column style={spotInfoColumn}>
                  <Text style={spotName}>
                    {spot.name}
                    {spot.verifiedAt === null && (
                      <span style={unverifiedBadge}>Unverified</span>
                    )}
                  </Text>
                  <Text style={spotConditions}>
                    {spot.windSpeedMin} - {spot.windSpeedMax} kn
                  </Text>
                  {spot.windDirections.length > 0 && (
                    <Text style={spotDirections}>
                      {spot.windDirections.join(", ")}
                    </Text>
                  )}
                </Column>
                <Column style={spotActionsColumn}>
                  {spot.verifiedAt === null && (
                    <Link
                      href={`${baseUrl}/subscription/${spot.subscriptionId}/verify`}
                      style={verifyButton}
                    >
                      Verify
                    </Link>
                  )}
                  <Link
                    href={`${baseUrl}/subscription/${spot.subscriptionId}/unsubscribe`}
                    style={
                      spot.verifiedAt === null
                        ? unsubscribeLinkMuted
                        : unsubscribeLink
                    }
                  >
                    Unsubscribe
                  </Link>
                </Column>
              </Row>
            </Section>
          ))}
        </Section>

        {/* Unsubscribe All */}
        <Section style={unsubscribeAllSection}>
          <Row>
            <Column>
              <Text style={unsubscribeAllText}>
                Want to stop all notifications?
              </Text>
            </Column>
            <Column align="right">
              <Link
                href={`${baseUrl}/kiter/${kiter.id}/unsubscribe-all`}
                style={unsubscribeAllButton}
              >
                Unsubscribe All
              </Link>
            </Column>
          </Row>
        </Section>
      </ContentSection>

      <FooterBase />
    </Body>
  </Html>
);

export default MySpotsEmail;

MySpotsEmail.PreviewProps = {
  spots: [
    {
      name: "Aukrog",
      windSpeedMin: 10,
      windSpeedMax: 20,
      windDirections: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
      subscriptionId: "e2aa517b-3e0b-419d-a7f6-ecce1c1446a5",
      verifiedAt: null,
    },
    {
      name: "Laboe",
      windSpeedMin: 10,
      windSpeedMax: 30,
      windDirections: ["NW", "W", "SW"],
      subscriptionId: "6d55aea3-8990-4a0d-b70c-ebf77d2b14e2",
      verifiedAt: null,
    },
    {
      name: "Drejby",
      windSpeedMin: 10,
      windSpeedMax: 20,
      windDirections: ["E", "SE"],
      subscriptionId: "303e7658-1b1a-4c8d-86c6-ac5b4e02a658",
      verifiedAt: new Date("2021-08-01T00:00:00.000Z"),
    },
  ],
  kiter: {
    id: "f6076292-7fb6-460e-9432-5919830f0ba8",
  },
} satisfies MySpotsEmailProps;

// Component-specific styles
const spotsContainer = {
  marginBottom: "24px",
};

const spotCard = {
  backgroundColor: "rgba(15, 38, 64, 0.6)",
  borderRadius: "12px",
  padding: "16px 20px",
  marginBottom: "12px",
  border: `1px solid ${colors.border}`,
};

const spotInfoColumn = {
  verticalAlign: "top" as const,
};

const spotActionsColumn = {
  verticalAlign: "top" as const,
  textAlign: "right" as const,
  width: "120px",
};

const spotName = {
  fontSize: "18px",
  fontWeight: "600" as const,
  color: colors.textWhite,
  margin: "0 0 4px",
};

const unverifiedBadge = {
  display: "inline-block",
  marginLeft: "8px",
  padding: "2px 8px",
  backgroundColor: colors.warningBg,
  color: colors.warning,
  fontSize: "11px",
  fontWeight: "600" as const,
  borderRadius: "4px",
  verticalAlign: "middle",
};

const spotConditions = {
  fontSize: "14px",
  color: colors.textLight,
  margin: "0 0 2px",
};

const spotDirections = {
  fontSize: "13px",
  color: colors.textSubtle,
  margin: "0",
};

const verifyButton = {
  display: "inline-block",
  padding: "8px 16px",
  backgroundColor: colors.accent,
  color: colors.bgDark,
  fontSize: "13px",
  fontWeight: "600" as const,
  borderRadius: "6px",
  textDecoration: "none",
  marginBottom: "8px",
};

const unsubscribeLink = {
  display: "block",
  fontSize: "12px",
  color: colors.textMuted,
  textDecoration: "none",
};

const unsubscribeLinkMuted = {
  display: "block",
  fontSize: "12px",
  color: colors.textSubtle,
  textDecoration: "none",
};

const unsubscribeAllSection = {
  backgroundColor: colors.dangerBg,
  borderRadius: "12px",
  padding: "16px 20px",
  border: `1px solid ${colors.dangerBorder}`,
};

const unsubscribeAllText = {
  fontSize: "14px",
  color: colors.danger,
  margin: "0",
};

const unsubscribeAllButton = {
  display: "inline-block",
  padding: "8px 16px",
  backgroundColor: "transparent",
  color: colors.danger,
  fontSize: "13px",
  fontWeight: "600" as const,
  borderRadius: "6px",
  textDecoration: "none",
  border: "1px solid rgba(239, 68, 68, 0.4)",
};
