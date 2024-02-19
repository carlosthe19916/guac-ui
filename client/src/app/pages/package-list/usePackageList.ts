import React, { useMemo } from "react";

import {
  FilterType,
  useTablePropHelpers,
  useTableState,
} from "@mturley-latest/react-table-batteries";

import dayjs from "dayjs";
import { PackageURL } from "packageurl-js";

import { getHubRequestParams } from "@app/hooks/table-controls";

import { TablePersistenceKeyPrefixes } from "@app/Constants";
import { useFetchPackages } from "@app/queries/packages";

const DATE_FORMAT = "YYYY-MM-DD";

export const usePackageList = () => {
  const tableState = useTableState({
    persistTo: "sessionStorage",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.sboms,
    columnNames: {
      name: "Name",
      namespace: "Namespace",
      version: "Version",
      type: "Type",
      path: "Path",
      qualifiers: "Qualifiers",
      vulnerabilities: "Vulnerabilities",
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
        {
          key: "datePublished",
          title: "Revision",
          placeholderText: "Revision",
          type: FilterType.select,
          selectOptions: [
            {
              key: `${dayjs().subtract(7, "day").format(DATE_FORMAT)}..${dayjs().format(DATE_FORMAT)}`,
              value: "Last 7 days",
            },
            {
              key: `${dayjs().subtract(30, "day").format(DATE_FORMAT)}..${dayjs().format(DATE_FORMAT)}`,
              value: "Last 30 days",
            },
            {
              key: `${dayjs().startOf("year").format(DATE_FORMAT)}..${dayjs().format(DATE_FORMAT)}`,
              value: "This year",
            },
            ...[...Array(3)].map((_, index) => {
              let date = dayjs()
                .startOf("year")
                .subtract(index + 1, "year");
              return {
                key: `${date.format(DATE_FORMAT)}..${date.endOf("year").format(DATE_FORMAT)}`,
                value: date.year(),
              };
            }),
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

  const { isFetching, result, fetchError } = useFetchPackages(hubRequestParams);

  const pageItems = useMemo(() => {
    return result.data.map((e) => {
      let packageUrl;
      try {
        packageUrl = PackageURL.fromString(e.purl);
      } catch (e) {
        console.log(e);
      }
      return {
        ...e,
        package: packageUrl,
      };
    });
  }, [result]);

  const tableProps = useTablePropHelpers({
    ...tableState,
    idProperty: "purl",
    isLoading: isFetching,
    currentPageItems: pageItems,
    totalItemCount: result.total,
  });

  return {
    tableProps,
    isFetching,
    fetchError,
    total: result.total,
  };
};
