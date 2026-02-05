import { Container, Img, Link, Section } from "@react-email/components";
import React from "react";
import { getBaseUrl } from "~/lib/url";

const baseUrl = getBaseUrl();

const Header: React.FC = () => {
  return (
    <Section style={header}>
      <Container style={headerContainer}>
        <Link href={baseUrl} style={logoLink}>
          <Img
            src={`${baseUrl}/icon-32.png`}
            width="32"
            height="32"
            alt="Spotter"
            style={logoImage}
          />
          <span style={logoText}>Spotter</span>
        </Link>
      </Container>
    </Section>
  );
};

export { Header };

const header = {
  backgroundColor: "#0a1628",
  borderBottom: "1px solid rgba(135, 191, 224, 0.1)",
  padding: "20px 0",
};

const headerContainer = {
  margin: "0 auto",
  maxWidth: "560px",
  padding: "0 20px",
};

const logoLink = {
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};

const logoImage = {
  display: "inline-block",
  marginRight: "10px",
  verticalAlign: "middle",
};

const logoText = {
  fontSize: "20px",
  fontWeight: "700" as const,
  color: "#ffffff",
  verticalAlign: "middle",
};
