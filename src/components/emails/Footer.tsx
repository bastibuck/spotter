import { Link, Section, Row, Column } from "@react-email/components";
import React from "react";
import { getBaseUrl } from "~/lib/url";

const baseUrl = getBaseUrl();

const Footer: React.FC<{
  spotName: string;
  subscriptionId: string;
  kiterId: string;
}> = ({ spotName, subscriptionId, kiterId }) => {
  return (
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
            href={`${baseUrl}/subscription/${subscriptionId}/unsubscribe`}
            style={metaLink}
          >
            Unsubscribe {spotName}
          </Link>
        </Column>

        <Column>
          <Link
            href={`${baseUrl}/kiter/${kiterId}/unsubscribe-all`}
            style={metaLink}
          >
            Unsubscribe all spots
          </Link>
        </Column>
      </Row>
    </Section>
  );
};

export default Footer;

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
