import React from "react";

import { Label, Progress } from "@patternfly/react-core";

import { baseSeverityList, severityFromNumber } from "@app/api/model-utils";
import { BaseSeverity } from "@app/api/models";

interface SeverityRendererProps {
  variant: "label" | "progress";
  score: number;
  severity?: BaseSeverity;
}

export const SeverityRenderer: React.FC<SeverityRendererProps> = ({
  variant,
  score,
  severity,
}) => {
  let severityType = severity || severityFromNumber(score);
  let severityProps = baseSeverityList[severityType];
  if (variant == "label") {
    return (
      <Label
        isCompact
        {...severityProps.labelProps}
      >{`${score} ${severityProps.name}`}</Label>
    );
  } else {
    return (
      <Progress
        aria-labelledby="severity-renderer"
        size="sm"
        max={10}
        value={score}
        label={`${score}/10`}
        {...severityProps.progressProps}
      />
    );
  }
};
