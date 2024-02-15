import React from "react";

import { Flex, FlexItem } from "@patternfly/react-core";
import ShieldIcon from "@patternfly/react-icons/dist/esm/icons/shield-alt-icon";

import { Severity } from "@app/api/models";

import {
  global_Color_light_200 as noneColor,
  global_info_color_100 as lowColor,
  global_warning_color_100 as mediumColor,
  global_danger_color_100 as highColor,
  global_palette_purple_400 as criticalColor,
} from "@patternfly/react-tokens";

type ListType = {
  [key in Severity]: {
    color: { name: string; value: string; var: string };
  };
};
const severityList: ListType = {
  none: {
    color: noneColor,
  },
  low: {
    color: lowColor,
  },
  medium: {
    color: mediumColor,
  },
  high: {
    color: highColor,
  },
  critical: {
    color: criticalColor,
  },
};

interface SeverityShieldProps {
  value: Severity;
  showLabel?: boolean;
}

export const SeverityShield: React.FC<SeverityShieldProps> = ({
  value,
  showLabel,
}) => {
  let severityProps = severityList[value];

  return (
    <Flex
      spaceItems={{ default: "spaceItemsSm" }}
      alignItems={{ default: "alignItemsCenter" }}
      flexWrap={{ default: "nowrap" }}
      style={{ whiteSpace: "nowrap" }}
    >
      <FlexItem>
        <ShieldIcon color={severityProps.color.value} />
      </FlexItem>
      {showLabel && (
        <FlexItem>{value.charAt(0).toUpperCase() + value.slice(1)}</FlexItem>
      )}
    </Flex>
  );
};
