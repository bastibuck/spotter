import { Section, Row, Column } from "@react-email/components";
import React from "react";

const Table: React.FC<{
  data: { label: string; value: React.ReactNode }[];
}> = ({ data }) => {
  return (
    <Section style={tableContainer}>
      {data.map((row, idx) => (
        <Row
          key={row.label}
          cellSpacing={10}
          style={idx !== data.length - 1 ? borderBottom : undefined}
        >
          {/* label */}
          <Column align="left" style={labelStyle}>
            {row.label}
          </Column>

          {/* value */}
          <Column align="right" style={valueStyle}>
            {row.value}
          </Column>
        </Row>
      ))}
    </Section>
  );
};

export default Table;

const tableContainer = {
  padding: "16px 20px",
  backgroundColor: "rgba(15, 38, 64, 0.6)",
  borderRadius: "12px",
  margin: "16px 0",
};

const borderBottom = {
  borderBottom: "1px solid rgba(135, 191, 224, 0.15)",
};

const labelStyle = {
  color: "#87bfe0",
  fontSize: "14px",
  padding: "8px 0",
};

const valueStyle = {
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  padding: "8px 0",
};
