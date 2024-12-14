import {
  Body,
  Column,
  Container,
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
import { FooterBase } from "~/components/emails/Footer";
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
      <Container style={container}>
        <Heading style={heading}>
          <Text style={{ ...heading, display: "inline" }}>
            Manage your spot subscriptions
          </Text>
        </Heading>

        <Section style={tableContainer}>
          {spots.map((spot) => (
            <Row
              cellSpacing={10}
              key={spot.subscriptionId}
              style={borderBottom}
            >
              <Column align="left" style={{ ...col, width: "70%" }}>
                <Text style={spotName}>{spot.name}</Text>

                <Text
                  style={conditions}
                >{`${spot.windSpeedMin} - ${spot.windSpeedMax} kn`}</Text>

                <Text style={conditions}>{spot.windDirections.join(", ")}</Text>
              </Column>

              <Column align="left" style={{ ...col, width: "30%" }}>
                {spot.verifiedAt === null && (
                  <Link
                    href={`${baseUrl}/subscription/${spot.subscriptionId}/verify`}
                    style={{
                      ...button,
                      marginBottom: 10,
                      backgroundColor: "#4caf50",
                    }}
                  >
                    Verify
                  </Link>
                )}

                <Link
                  href={`${baseUrl}/subscription/${spot.subscriptionId}/unsubscribe`}
                  style={{
                    ...button,
                    backgroundColor:
                      spot.verifiedAt === null
                        ? "#bbb"
                        : button.backgroundColor,
                  }}
                >
                  Unsubscribe
                </Link>
              </Column>
            </Row>
          ))}

          <Row cellSpacing={10} style={{ marginTop: 20 }}>
            <Column align="left" style={{ ...col, width: "70%" }}>
              <Text style={spotName}>All spots</Text>
              <Text style={conditions}>Unsubscribe all spots at once</Text>
            </Column>

            <Column align="left" style={{ ...col, width: "30%" }}>
              <Link
                href={`${baseUrl}/kiter/${kiter.id}/unsubscribe-all`}
                style={button}
              >
                Unsubscribe
              </Link>
            </Column>
          </Row>
        </Section>
      </Container>

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
      windDirections: [],
      subscriptionId: "6d55aea3-8990-4a0d-b70c-ebf77d2b14e2",
      verifiedAt: null,
    },
    {
      name: "Drejby",
      windSpeedMin: 10,
      windSpeedMax: 20,
      windDirections: [],
      subscriptionId: "303e7658-1b1a-4c8d-86c6-ac5b4e02a658",
      verifiedAt: new Date("2021-08-01T00:00:00.000Z"),
    },
  ],
  kiter: {
    id: "f6076292-7fb6-460e-9432-5919830f0ba8",
  },
} satisfies MySpotsEmailProps;

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

const spotName = {
  fontSize: "20px",
  letterSpacing: "-0.5px",
  fontWeight: "700",
  color: "#484848",
  margin: "0 0 5px",
};

const conditions = {
  margin: 0,
  color: "#858585",
  lineHeight: 1.2,
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

const tableContainer = { padding: "20px 0px" };
const borderBottom = { borderBottom: "1px solid #cececf" };

const col = {
  verticalAlign: "top",
};
