import { Button, Section } from "@react-email/components";
import React from "react";
import { buttonContainer, primaryButton } from "./styles";

interface PrimaryButtonProps {
  href: string;
  children: React.ReactNode;
}

/**
 * Primary CTA button with ocean gradient styling.
 */
const PrimaryButton: React.FC<PrimaryButtonProps> = ({ href, children }) => {
  return (
    <Section style={buttonContainer}>
      <Button style={primaryButton} href={href}>
        {children}
      </Button>
    </Section>
  );
};

export { PrimaryButton };
