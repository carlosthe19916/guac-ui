import React from "react";

import { Divider, Flex, FlexItem } from "@patternfly/react-core";
import ShieldIcon from "@patternfly/react-icons/dist/esm/icons/shield-alt-icon";

import { RHSeverity, Severity } from "@app/api/models";
import { SeverityShield } from "./severity";

interface VulnerabilitiesCountProps {
  severities: { [key in Severity]: number };
}

export const VulnerabilitiesCount: React.FC<VulnerabilitiesCountProps> = ({
  severities,
}) => {
  let total = Object.entries(severities).reduce((prev, [_severity, count]) => {
    return prev + count;
  }, 0);

  return (
    <Flex
      spaceItems={{ default: "spaceItemsSm" }}
      alignItems={{ default: "alignItemsCenter" }}
      flexWrap={{ default: "nowrap" }}
      style={{ whiteSpace: "nowrap" }}
    >
      <FlexItem>{total}</FlexItem>
      <Divider orientation={{ default: "vertical" }} />
      <FlexItem>
        {Object.entries(severities).map(([severity, count], index) => (
          <Flex
            key={index}
            spaceItems={{ default: "spaceItemsXs" }}
            alignItems={{ default: "alignItemsCenter" }}
            flexWrap={{ default: "nowrap" }}
            style={{ whiteSpace: "nowrap" }}
          >
            <FlexItem>
              <SeverityShield value={severity as Severity} />
            </FlexItem>
            <FlexItem>{count}</FlexItem>
          </Flex>
        ))}
      </FlexItem>
    </Flex>
  );
};
