import { useQuery } from "@tanstack/react-query";

import { getVulnerabilities } from "@app/api/rest";

export const VulnerabilitiesQueryKey = "vulnerabilities";

export const useFetchVulnerabilities = () => {
  const {
    data: vulnerabilities,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [VulnerabilitiesQueryKey],
    queryFn: () => getVulnerabilities(),
  });

  return {
    vulnerabilities: vulnerabilities || [],
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};
