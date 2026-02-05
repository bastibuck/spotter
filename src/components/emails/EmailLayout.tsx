import { Body, Head, Html } from "@react-email/components";
import React from "react";
import { main } from "./styles";

interface EmailLayoutProps {
  children: React.ReactNode;
}

/**
 * Base layout wrapper for all email templates.
 * Provides consistent Html, Head, and Body structure with ocean theme styling.
 */
const EmailLayout: React.FC<EmailLayoutProps> = ({ children }) => {
  return (
    <Html>
      <Head />
      <Body style={main}>{children}</Body>
    </Html>
  );
};

export { EmailLayout };
