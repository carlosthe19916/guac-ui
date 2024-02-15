import { LabelProps, ProgressProps } from "@patternfly/react-core";
import {
  global_info_color_100 as lowColor,
  global_warning_color_100 as moderateColor,
  global_danger_color_100 as importantColor,
  global_palette_purple_400 as criticalColor,
} from "@patternfly/react-tokens";

import { BaseSeverity, RHSeverity } from "./models";

// Base severity

type BaseSeverityListType = {
  [key in BaseSeverity]: {
    name: string;
    color: string;
    progressProps: Pick<ProgressProps, "variant">;
    labelProps: LabelProps;
  };
};

export const baseSeverityList: BaseSeverityListType = {
  NONE: {
    name: "None",
    color: lowColor.value,
    progressProps: { variant: undefined },
    labelProps: { color: "grey" },
  },
  LOW: {
    name: "Low",
    color: lowColor.value,
    progressProps: { variant: undefined },
    labelProps: { color: "orange" },
  },
  MEDIUM: {
    name: "Medium",
    color: moderateColor.value,
    progressProps: { variant: "warning" },
    labelProps: { color: "orange" },
  },
  HIGH: {
    name: "High",
    color: importantColor.value,
    progressProps: { variant: "danger" },
    labelProps: { color: "red" },
  },
  CRITICAL: {
    name: "Critical",
    color: criticalColor.value,
    progressProps: { variant: "danger" },
    labelProps: { color: "purple" },
  },
};

export const severityFromNumber = (score: number): BaseSeverity => {
  if (score >= 9.0) {
    return "CRITICAL";
  } else if (score >= 7.0) {
    return "HIGH";
  } else if (score >= 4.0) {
    return "MEDIUM";
  } else if (score >= 0.1) {
    return "LOW";
  } else {
    return "NONE";
  }
};

export const severityFromString = (val: string): BaseSeverity | undefined => {
  switch (val.toUpperCase()) {
    case "CRITICAL":
      return "CRITICAL";
    case "HIGH":
      return "HIGH";
    case "MEDIUM":
      return "MEDIUM";
    case "LOW":
      return "LOW";
    case "NONE":
      return "NONE";
    default:
      return undefined;
  }
};

export const getSeverityPriority = (category: BaseSeverity) => {
  switch (category) {
    case "NONE":
      return 0;
    case "LOW":
      return 1;
    case "MEDIUM":
      return 2;
    case "HIGH":
      return 3;
    case "CRITICAL":
      return 4;
    default:
      return 0;
  }
};

export function compareBySeverityFn<T>(
  categoryExtractor: (elem: T) => BaseSeverity
) {
  return (a: T, b: T) => {
    return (
      getSeverityPriority(categoryExtractor(a)) -
      getSeverityPriority(categoryExtractor(b))
    );
  };
}

// RH Severity

type ListType = {
  [key in RHSeverity]: {
    color: { name: string; value: string; var: string };
  };
};

export const severityList: ListType = {
  low: {
    color: lowColor,
  },
  moderate: {
    color: moderateColor,
  },
  important: {
    color: importantColor,
  },
  critical: {
    color: criticalColor,
  },
};
