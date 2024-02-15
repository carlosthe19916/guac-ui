import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { getDAReport } from "@app/api/rest";

export const ReportsQueryKey = "reports";

export const useCreateDAReportMutation = (id: string, sbom: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [ReportsQueryKey, id],
    queryFn: () =>
      id === undefined ? Promise.resolve(undefined) : getDAReport(sbom),
    enabled: id !== undefined,
  });

  return {
    report: data?.data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};
