import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { HubRequestParams } from "@app/api/models";
import {
  getPackageById,
  getPackageRelatedProducts,
  getPackages,
} from "@app/api/rest";

export const PackagesQueryKey = "packages";
export const PackagesRelatedProductQueryKey = "packages-related-products";

export const useFetchPackages = (params: HubRequestParams = {}) => {
  const {
    data: packages,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [PackagesQueryKey, params],
    queryFn: () => getPackages(params),
  });

  return {
    result: {
      data: packages?.data || [],
      total: packages?.total ?? 0,
      params: packages?.params ?? params,
    },
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};

export const useFetchPackageById = (id?: number | string) => {
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

export const useFetchPackageRelatedProducts = (id?: number | string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [PackagesRelatedProductQueryKey, id],
    queryFn: () =>
      id === undefined
        ? Promise.resolve(undefined)
        : getPackageRelatedProducts(id),
    enabled: id !== undefined,
  });

  return {
    relatedProducts: data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
  };
};
