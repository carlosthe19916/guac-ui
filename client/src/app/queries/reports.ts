import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { getDAReport } from "@app/api/rest";

export const ReportsQueryKey = "reports";

function stringToHash(value: string) {
  let hash = 0;

  if (value.length == 0) return hash;

  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return hash;
}

export const useCreateDAReportMutation = (sbom?: string) => {
  const { data, isLoading, error } = useQuery({
    // eslint-disable-next-line
    queryKey: [ReportsQueryKey, sbom ? stringToHash(sbom) : 0],
    queryFn: () =>
      sbom === undefined ? Promise.resolve(undefined) : getDAReport(sbom),
    enabled: sbom !== undefined,
  });

  return {
    report: data?.data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};
