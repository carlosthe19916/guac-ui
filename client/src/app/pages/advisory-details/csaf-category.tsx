import React from "react";
import { CSAF_Category } from "@app/api/models";

type ListType = {
  [key in CSAF_Category]: {
    label: string;
  };
};
const list: ListType = {
  csaf_base: {
    label: "Base",
  },
  csaf_security_advisory: {
    label: "Security advisory",
  },
  csaf_vex: {
    label: "Vex",
  },
};

interface CSAFCategoryLabelProps {
  value: CSAF_Category | string;
}

export const CSAFCategoryLabel: React.FC<CSAFCategoryLabelProps> = ({
  value,
}) => {
  let objProps = list[value as CSAF_Category] ?? { label: value };

  return <>{objProps.label}</>;
};
