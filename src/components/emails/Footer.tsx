import {
  Link,
  Section,
  Row,
  Column,
  Container,
  Img,
} from "@react-email/components";
import React from "react";
import { getBaseUrl } from "~/lib/url";

const baseUrl = getBaseUrl();

const Footer: React.FC<{
  spotName: string;
  subscriptionId: string;
  kiterId: string;
}> = ({ spotName, subscriptionId, kiterId }) => {
  return (
    <FooterBase>
      <Row>
        <Column align="center" style={{ paddingBottom: "12px" }}>
          <Link
            href={`${baseUrl}/subscription/${subscriptionId}/unsubscribe`}
            style={footerLink}
          >
            Unsubscribe from {spotName}
          </Link>
        </Column>
      </Row>
      <Row>
        <Column align="center">
          <Link
            href={`${baseUrl}/kiter/${kiterId}/unsubscribe-all`}
            style={footerLinkMuted}
          >
            Unsubscribe from all spots
          </Link>
        </Column>
      </Row>
    </FooterBase>
  );
};

const FooterBase: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Section style={footer}>
      <Container style={footerContainer}>
        <Row style={{ paddingBottom: "20px" }}>
          <Column align="center">
            <Link href={baseUrl} style={logoLink}>
              <Img
                src={`${baseUrl}/icon-32.png`}
                width="32"
                height="32"
                alt="Spotter"
                style={{
                  display: "inline-block",
                  marginRight: "8px",
                  verticalAlign: "middle",
                }}
              />
              <span style={logoText}>Spotter</span>
            </Link>
          </Column>
        </Row>

        {children}

        <Row style={{ paddingTop: "20px" }}>
          <Column align="center">
            <span style={copyright}>Wind alerts for kitesurfers</span>
          </Column>
        </Row>
      </Container>
    </Section>
  );
};

export { FooterBase, Footer };

const footerContainer = {
  margin: "0 auto",
  padding: "24px 20px",
  maxWidth: "560px",
};

const footer = {
  marginTop: "32px",
  backgroundColor: "#0a1628",
  borderTop: "1px solid rgba(135, 191, 224, 0.1)",
};

const logoLink = {
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};

const logoText = {
  fontSize: "18px",
  fontWeight: "700" as const,
  color: "#ffffff",
  verticalAlign: "middle",
};

const footerLink = {
  fontSize: "13px",
  color: "#87bfe0",
  textDecoration: "none",
};

const footerLinkMuted = {
  fontSize: "12px",
  color: "#5a9bc4",
  textDecoration: "none",
};

const copyright = {
  fontSize: "12px",
  color: "#3a7ca5",
};
