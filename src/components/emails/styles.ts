// Shared email styles for consistent theming across all email templates

export const colors = {
  // Backgrounds
  bgPrimary: "#0f2640",
  bgDark: "#0a1628",
  bgHero: "#132d4a",

  // Text
  textWhite: "#ffffff",
  textLight: "#b8ddf0",
  textMuted: "#87bfe0",
  textSubtle: "#5a9bc4",
  textDark: "#3a7ca5",

  // Accent
  accent: "#22d3ee",
  accentDark: "#06b6d4",
  accentBlue: "#3a7ca5",

  // Status
  warning: "#fbbf24",
  warningBg: "rgba(251, 191, 36, 0.2)",
  danger: "#f87171",
  dangerBg: "rgba(239, 68, 68, 0.1)",
  dangerBorder: "rgba(239, 68, 68, 0.2)",

  // Borders
  border: "rgba(135, 191, 224, 0.1)",
  borderAccent: "rgba(6, 182, 212, 0.2)",
} as const;

export const fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

// Layout styles
export const main = {
  backgroundColor: colors.bgPrimary,
  fontFamily,
};

export const container = {
  margin: "0 auto",
  maxWidth: "560px",
};

export const contentSection = {
  padding: "40px 20px",
};

// Typography styles
export const heading = {
  fontSize: "28px",
  fontWeight: "700" as const,
  color: colors.textWhite,
  margin: "0 0 8px",
  textAlign: "center" as const,
};

export const subheading = {
  fontSize: "16px",
  color: colors.textMuted,
  textAlign: "center" as const,
  margin: "0 0 32px",
};

export const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: colors.textLight,
  margin: "0 0 24px",
};

export const paragraphCentered = {
  ...paragraph,
  textAlign: "center" as const,
};

export const mutedText = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: colors.textSubtle,
  textAlign: "center" as const,
  margin: "24px 0 0",
};

export const sectionLabel = {
  fontSize: "12px",
  fontWeight: "600" as const,
  color: colors.textSubtle,
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "24px 0 8px",
};

// Button styles
export const primaryButton = {
  background: `linear-gradient(135deg, ${colors.accentDark} 0%, ${colors.accentBlue} 100%)`,
  backgroundColor: colors.accentDark,
  borderRadius: "8px",
  fontWeight: "600" as const,
  color: colors.textWhite,
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
};

export const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};
