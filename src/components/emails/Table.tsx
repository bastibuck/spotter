import { Section, Row, Column } from "@react-email/components";
import React from "react";

const Table: React.FC<{ data: { label: string; value: string }[] }> = ({
  data,
}) => {
  return (
    <Section style={tableContainer}>
      {data.map((row, idx) => (
        <Row
          key={row.label}
          cellSpacing={10}
          style={idx !== data.length - 1 ? borderBottom : undefined}
        >
          {/* label */}
          <Column align="right">{row.label}</Column>

          {/* value */}
          <Column align="left" style={{ ...col, ...value }}>
            {row.value}
          </Column>
        </Row>
      ))}
    </Section>
  );
};

export default Table;

const tableContainer = { padding: "20px 40px" };

const borderBottom = { borderBottom: "1px solid #cececf" };

const col = {
  width: "50%",
  verticalAlign: "top",
};

const value = { fontWeight: "bold" };
