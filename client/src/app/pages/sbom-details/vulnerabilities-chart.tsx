import React from "react";

import { ChartDonut } from "@patternfly/react-charts";
import { global_BackgroundColor_200 as lowColor } from "@patternfly/react-tokens";

import {
  baseSeverityList,
  getSeverityPriority,
  severityFromString,
} from "@app/api/model-utils";

interface ChartData {
  legend: string;
  count: number;
  color: string;
  order: number;
}

interface VulnerabilitiresChartProps {
  data: { severity?: string; count: number }[];
}

export const VulnerabilitiresChart: React.FC<VulnerabilitiresChartProps> = ({
  data,
}) => {
  const enrichedData = data
    .map((e) => {
      const severity = severityFromString(e.severity || "");

      let severityProps;
      let severityPriority = 0;
      if (severity) {
        severityProps = baseSeverityList[severity];
        severityPriority = getSeverityPriority(severity);
      }

      const result: ChartData = severityProps
        ? {
            legend: severityProps.name,
            count: e.count,
            color: severityProps.color,
            order: severityPriority,
          }
        : {
            legend: e.severity || "Unknown",
            count: e.count,
            color: lowColor.value,
            order: severityPriority,
          };

      return result;
    })
    .sort((a, b) => a.order - b.order);

  const chartData = enrichedData.map((e) => {
    return {
      x: e.legend,
      y: e.count,
    };
  });

  const chartLegendData = enrichedData.map((e) => ({
    name: `${e.count} ${e.legend}`,
  }));

  const chartColorData = enrichedData.map((e) => e.color);

  return (
    <>
      <div style={{ height: "230px", width: "350px" }}>
        <ChartDonut
          ariaDesc="Vulnerabilities"
          ariaTitle="Vulnerabilities"
          constrainToVisibleArea
          data={chartData}
          labels={({ datum }) => `${datum.x}: ${datum.y}`}
          legendData={chartLegendData}
          colorScale={chartColorData}
          legendOrientation="vertical"
          legendPosition="right"
          name="Vulnerabilities"
          padding={{
            bottom: 20,
            left: 20,
            right: 140, // Adjusted to accommodate legend
            top: 20,
          }}
          subTitle="Vulnerabilities"
          title={enrichedData
            .map((e) => e.count)
            .reduce((prev, current) => prev + current, 0)
            .toString()}
          width={350}
        />
      </div>
    </>
  );
};
