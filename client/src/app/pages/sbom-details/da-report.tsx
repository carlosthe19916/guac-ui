import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { useCreateDAReportMutation } from "@app/queries/reports";
import React from "react";

interface DAReportProps {
  sbom: string;
}

export const DAReport: React.FC<DAReportProps> = ({ sbom }) => {
  const { report, isFetching, fetchError } = useCreateDAReportMutation(sbom);

  return (
    <>
      <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
        {report && (
          <iframe
            srcDoc={report}
            style={{ height: "695px", width: "100%" }}
          ></iframe>
        )}
      </LoadingWrapper>
    </>
  );
};
