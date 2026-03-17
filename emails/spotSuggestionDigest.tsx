import { Body, Head, Html, Preview, Text } from "@react-email/components";

import {
  ContentSection,
  Header,
  colors,
  heading,
  main,
  mutedText,
  paragraphCentered,
} from "~/components/emails";

interface SpotSuggestionDigestEmailProps {
  suggestionCount: number;
}

const SpotSuggestionDigestEmail = ({
  suggestionCount,
}: SpotSuggestionDigestEmailProps) => {
  const suggestionLabel = suggestionCount === 1 ? "suggestion" : "suggestions";

  return (
    <Html>
      <Head />
      <Preview>{`${suggestionCount} spot ${suggestionLabel} waiting for review`}</Preview>

      <Body style={main}>
        <Header />

        <ContentSection>
          <Text style={eyebrow}>Weekly Digest</Text>
          <Text style={heading}>Spot Suggestions Awaiting Review</Text>
          <Text style={countStyle}>{suggestionCount}</Text>
          <Text style={paragraphCentered}>
            There {suggestionCount === 1 ? "is" : "are"} currently{" "}
            <strong>{suggestionCount}</strong> spot {suggestionLabel} waiting
            for your review.
          </Text>
          <Text style={mutedText}>
            This digest only includes the current total. For more details,
            please visit the admin dashboard.
          </Text>
        </ContentSection>
      </Body>
    </Html>
  );
};

export default SpotSuggestionDigestEmail;

SpotSuggestionDigestEmail.PreviewProps = {
  suggestionCount: 7,
} satisfies SpotSuggestionDigestEmailProps;

const eyebrow = {
  fontSize: "12px",
  fontWeight: "600" as const,
  color: colors.textSubtle,
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 8px",
  textAlign: "center" as const,
};

const countStyle = {
  fontSize: "64px",
  lineHeight: "1",
  fontWeight: "700" as const,
  color: colors.accent,
  textAlign: "center" as const,
  margin: "0 0 24px",
};
