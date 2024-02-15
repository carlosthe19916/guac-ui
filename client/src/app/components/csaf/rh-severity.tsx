import React from "react";

import { Flex, FlexItem } from "@patternfly/react-core";
import ShieldIcon from "@patternfly/react-icons/dist/esm/icons/shield-alt-icon";

import { RHSeverity } from "@app/api/models";
import { severityList } from "@app/api/model-utils";

interface RHSeverityShieldProps {
  value: RHSeverity;
}

export const RHSeverityShield: React.FC<RHSeverityShieldProps> = ({
  value,
}) => {
  let severityProps = severityList[value];

  return (
    <Flex
      spaceItems={{ default: "spaceItemsXs" }}
      alignItems={{ default: "alignItemsCenter" }}
      flexWrap={{ default: "nowrap" }}
      style={{ whiteSpace: "nowrap" }}
    >
      <FlexItem>
        <ShieldIcon color={severityProps.color.value} />
      </FlexItem>
      <FlexItem>{value.charAt(0).toUpperCase() + value.slice(1)}</FlexItem>
    </Flex>
  );
};
