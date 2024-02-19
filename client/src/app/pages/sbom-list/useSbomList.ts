import React from "react";

import {
  FilterType,
  useTablePropHelpers,
  useTableState,
} from "@mturley-latest/react-table-batteries";

import { getHubRequestParams } from "@app/hooks/table-controls";

import { TablePersistenceKeyPrefixes } from "@app/Constants";
import { useFetchSboms } from "@app/queries/sboms";

export const useSbomList = () => {
  const tableState = useTableState({
    persistTo: "sessionStorage",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.packages,
    columnNames: {
      name: "Name",
      version: "Version",
      supplier: "Supplier",
      createdOn: "Created on",
      dependencies: "Dependencies",
      productAdvisories: "Product advisories",
      download: "Download",
      Report: "Report",
    },
    filter: {
      isEnabled: true,
      filterCategories: [
        {
          key: "filterText",
          title: "Filter text",
          placeholderText: "Search",
          type: FilterType.search,
        },
        {
          key: "pkg",
          title: "Products",
          placeholderText: "Products",
          type: FilterType.multiselect,
          selectOptions: [
            { key: "oci/ubi7", value: "UBI 7" },
            { key: "oci/ubi8", value: "UBI 8" },
            { key: "oci/ubi9", value: "UBI 9" },
            {
              key: "/o:redhat:enterprise_linux:7",
              value: "Red Hat Enterprise Linux 7",
            },
            { key: "rejected", value: "Red Hat Enterprise Linux 8" },
            { key: "rejected", value: "Red Hat Enterprise Linux 9" },
          ],
        },
        {
          key: "severity",
          title: "CVSS",
          placeholderText: "CVSS",
          type: FilterType.multiselect,
          selectOptions: [
            { key: "low", value: "Low" },
            { key: "moderate", value: "Moderate" },
            { key: "important", value: "Important" },
            { key: "critical", value: "Critical" },
          ],
        },
      ],
    },
    sort: {
      isEnabled: true,
      sortableColumns: [],
      persistTo: "state",
    },
    pagination: { isEnabled: true },
  });

  const { filter, cacheKey } = tableState;
  const hubRequestParams = React.useMemo(() => {
    return getHubRequestParams({
      ...tableState,
      filterCategories: filter.filterCategories,
      hubSortFieldKeys: {
        created: "created",
      },
    });
  }, [cacheKey]);

  const { isFetching, result, fetchError } = useFetchSboms(hubRequestParams);

  const tableProps = useTablePropHelpers({
    ...tableState,
    idProperty: "id",
    isLoading: isFetching,
    currentPageItems: result.data,
    totalItemCount: result.total,
  });

  return {
    tableProps,
    isFetching,
    fetchError,
    total: result.total,
  };
};
