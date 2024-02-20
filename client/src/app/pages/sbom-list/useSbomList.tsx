import React from "react";
import { NavLink } from "react-router-dom";

import dayjs from "dayjs";

import { Button } from "@patternfly/react-core";
import DownloadIcon from "@patternfly/react-icons/dist/esm/icons/download-icon";
import {
  ConditionalTableBody,
  FilterType,
  useTablePropHelpers,
  useTableState,
} from "@carlosthe19916-latest/react-table-batteries";

import { getHubRequestParams } from "@app/hooks/table-controls";

import {
  FILTER_DATE_FORMAT,
  RENDER_DATE_FORMAT,
  TablePersistenceKeyPrefixes,
} from "@app/Constants";
import { useFetchSboms } from "@app/queries/sboms";
import { useDownload } from "@app/hooks/csaf/download-advisory";

export const useSbomList = () => {
  const tableState = useTableState({
    persistTo: "state",
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
        // {
        //   key: "pkg",
        //   title: "Product",
        //   type: FilterType.multiselect,
        //   placeholderText: "Product",
        //   selectOptions: [
        //     { key: "oci/ubi8", value: "UBI 8" },
        //     { key: "oci/ubi9", value: "UBI 9" },
        //   ],
        // },
        {
          key: "supplier",
          title: "Supplier",
          type: FilterType.multiselect,
          placeholderText: "Supplier",
          selectOptions: [{ key: "Organization: Red Hat", value: "Red Hat" }],
        },
        {
          key: "created",
          title: "Created on",
          type: FilterType.select,
          selectOptions: [
            {
              key: `${dayjs().subtract(7, "day").format(FILTER_DATE_FORMAT)}..${dayjs().format(FILTER_DATE_FORMAT)}`,
              value: "Last 7 days",
            },
            {
              key: `${dayjs().subtract(30, "day").format(FILTER_DATE_FORMAT)}..${dayjs().format(FILTER_DATE_FORMAT)}`,
              value: "Last 30 days",
            },
            {
              key: `${dayjs().startOf("year").format(FILTER_DATE_FORMAT)}..${dayjs().format(FILTER_DATE_FORMAT)}`,
              value: "This year",
            },
            ...[...Array(3)].map((_, index) => {
              const date = dayjs()
                .startOf("year")
                .subtract(index + 1, "year");
              return {
                key: `${date.format(FILTER_DATE_FORMAT)}..${date.endOf("year").format(FILTER_DATE_FORMAT)}`,
                value: date.year(),
              };
            }),
          ],
        },
      ],
    },
    sort: {
      isEnabled: true,
      sortableColumns: ["createdOn"],
    },
    pagination: { isEnabled: true },
  });

  const { filter, cacheKey } = tableState;
  const hubRequestParams = React.useMemo(() => {
    return getHubRequestParams({
      ...tableState,
      filterCategories: filter.filterCategories,
      hubSortFieldKeys: {
        createdOn: "created",
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

  const {
    currentPageItems,
    numRenderedColumns,
    components: { Table, Thead, Tr, Th, Tbody, Td, Pagination },
    expansion: { isCellExpanded },
  } = tableProps;

  const { downloadSbom } = useDownload();

  const table = (
    <>
      <Table aria-label="Sboms details table">
        <Thead>
          <Tr isHeaderRow>
            <Th columnKey="name" />
            <Th columnKey="version" />
            <Th columnKey="supplier" />
            <Th columnKey="createdOn" />
            <Th columnKey="dependencies" />
            <Th columnKey="productAdvisories" />
            <Th columnKey="download" />
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={result.total === 0}
          numRenderedColumns={numRenderedColumns}
        >
          <Tbody>
            {currentPageItems?.map((item, rowIndex) => {
              return (
                <Tr key={item.id} item={item} rowIndex={rowIndex}>
                  <Td width={20} columnKey="name">
                    <NavLink to={`/sboms/${item.id}`}>{item.name}</NavLink>
                  </Td>
                  <Td width={15} modifier="truncate" columnKey="version">
                    {item.version}
                  </Td>
                  <Td width={20} columnKey="supplier">
                    {item.supplier}
                  </Td>
                  <Td width={15} modifier="truncate" columnKey="createdOn">
                    {dayjs(item.created as any).format(RENDER_DATE_FORMAT)}
                  </Td>
                  <Td width={10} columnKey="dependencies">
                    {item.dependencies}
                  </Td>
                  <Td width={10} columnKey="productAdvisories">
                    {item.advisories}
                  </Td>
                  <Td width={10} columnKey="download">
                    <Button
                      variant="plain"
                      aria-label="Download"
                      onClick={() => {
                        downloadSbom(item.id);
                      }}
                    >
                      <DownloadIcon />
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </ConditionalTableBody>
      </Table>
      <Pagination
        variant="bottom"
        isCompact
        widgetId="sboms-pagination-bottom"
      />
    </>
  );

  return {
    tableProps,
    isFetching,
    fetchError,
    total: result.total,
    table,
  };
};
