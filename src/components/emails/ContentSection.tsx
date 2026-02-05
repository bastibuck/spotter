import { Container, Section } from "@react-email/components";
import React from "react";
import { container, contentSection } from "./styles";

interface ContentSectionProps {
  children: React.ReactNode;
}

/**
 * Content section wrapper with consistent padding and max-width container.
 */
const ContentSection: React.FC<ContentSectionProps> = ({ children }) => {
  return (
    <Section style={contentSection}>
      <Container style={container}>{children}</Container>
    </Section>
  );
};

export { ContentSection };
