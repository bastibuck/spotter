import React from "react";

const SpotLayout = (props: {
  children: React.ReactNode;
  details: React.ReactNode;
}) => {
  return (
    <>
      {props.children}
      {props.details}
    </>
  );
};

export default SpotLayout;
