import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { getPackageById, getPackages } from "@app/api/rest";

export const PackagesQueryKey = "packages";

export const useFetchPackages = () => {
  const {
    data: packages,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [PackagesQueryKey],
    queryFn: () => getPackages(),
  });

  return {
    packages: packages || [],
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};

export const useFetchPackageById = (id?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [PackagesQueryKey, id],
    queryFn: () =>
      id === undefined ? Promise.resolve(undefined) : getPackageById(id),
    enabled: id !== undefined,
  });

  return {
    pkg: data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};
