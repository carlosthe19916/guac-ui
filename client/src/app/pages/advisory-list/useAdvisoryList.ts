import React from "react";
import dayjs from "dayjs";
import { getHubRequestParams } from "@app/hooks/table-controls";
import { useFetchAdvisories } from "@app/queries/advisories";
import {
  FilterType,
  useTablePropHelpers,
  useTableState,
} from "@mturley-latest/react-table-batteries";
import { TablePersistenceKeyPrefixes } from "@app/Constants";

const DATE_FORMAT = "YYYY-MM-DD";

export const useAdvisoryList = () => {
  const tableState = useTableState({
    persistTo: "sessionStorage",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.advisories,
    columnNames: {
      id: "ID",
      title: "Title",
      severity: "Aggregated severity",
      revision: "Revision",
      vulnerabilities: "Vulnerabilities",
      download: "Download",
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
          key: "severity",
          title: "Severity",
          placeholderText: "Severity",
          type: FilterType.multiselect,
          selectOptions: [
            { key: "low", value: "Low" },
            { key: "moderate", value: "Moderate" },
            { key: "important", value: "Important" },
            { key: "critical", value: "Critical" },
          ],
        },
        {
          key: "package:in",
          title: "Product",
          placeholderText: "Product",
          type: FilterType.multiselect,
          selectOptions: [
            {
              key: "cpe:/o:redhat:rhel_eus:7",
              value: "Red Hat Enterprise Linux 7",
            },
            {
              key: "cpe:/o:redhat:rhel_eus:8",
              value: "Red Hat Enterprise Linux 8",
            },
            {
              key: "cpe:/a:redhat:enterprise_linux:9",
              value: "Red Hat Enterprise Linux 9",
            },
            {
              key: "cpe:/a:redhat:openshift:3",
              value: "Openshift Container Platform 3",
            },
            {
              key: "cpe:/a:redhat:openshift:4",
              value: "Openshift Container Platform 4",
            },
          ],
        },
        {
          key: "release",
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
      sortableColumns: ["severity"],
    },
    pagination: { isEnabled: true },
    expansion: {
      isEnabled: true,
      variant: "single",
      persistTo: "sessionStorage",
    },
  });

  const { filter, cacheKey } = tableState;
  const hubRequestParams = React.useMemo(() => {
    return getHubRequestParams({
      ...tableState,
      filterCategories: filter.filterCategories,
    });
  }, [cacheKey]);

  const { isFetching, fetchError, result } =
    useFetchAdvisories(hubRequestParams);

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
