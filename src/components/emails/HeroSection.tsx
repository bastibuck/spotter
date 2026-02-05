import { Container, Heading, Section, Text } from "@react-email/components";
import React from "react";
import { colors, container } from "./styles";

interface HeroSectionProps {
  label: string;
  title: string;
  subtitle?: string;
}

/**
 * Hero section with label, title, and optional subtitle.
 * Used for prominent email headers like wind alerts.
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  label,
  title,
  subtitle,
}) => {
  return (
    <Section style={heroSection}>
      <Container style={container}>
        <Text style={heroLabel}>{label}</Text>
        <Heading style={heroHeading}>{title}</Heading>
        {subtitle && <Text style={heroSubtitle}>{subtitle}</Text>}
      </Container>
    </Section>
  );
};

export { HeroSection };

const heroSection = {
  backgroundColor: colors.bgHero,
  padding: "40px 20px",
  marginTop: "24px",
  textAlign: "center" as const,
};

const heroLabel = {
  fontSize: "12px",
  fontWeight: "600" as const,
  color: colors.accent,
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
  margin: "0 0 8px",
};

const heroHeading = {
  fontSize: "36px",
  fontWeight: "700" as const,
  color: colors.textWhite,
  margin: "0 0 8px",
};

const heroSubtitle = {
  fontSize: "18px",
  color: colors.textMuted,
  margin: "0",
};
