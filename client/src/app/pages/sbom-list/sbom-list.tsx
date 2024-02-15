import React from "react";
import { NavLink } from "react-router-dom";

import {
  ConditionalTableBody,
  FilterType,
  useTablePropHelpers,
  useTableState,
} from "@mturley-latest/react-table-batteries";
import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  ToolbarContent,
} from "@patternfly/react-core";

import dayjs from "dayjs";

import { NotificationsContext } from "@app/components/NotificationsContext";
import { getHubRequestParams } from "@app/hooks/table-controls";

import {
  RENDER_DATE_FORMAT,
  TablePersistenceKeyPrefixes,
} from "@app/Constants";
import { useDownload } from "@app/hooks/csaf/download-advisory";
import { useFetchSboms } from "@app/queries/sboms";
import { useFetchPackages } from "@app/queries/packages";

const DATE_FORMAT = "YYYY-MM-DD";

export const SbomList: React.FC = () => {
  const { pushNotification } = React.useContext(NotificationsContext);

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

  const {
    currentPageItems,
    numRenderedColumns,
    components: {
      Table,
      Thead,
      Tr,
      Th,
      Tbody,
      Td,
      Toolbar,
      FilterToolbar,
      PaginationToolbarItem,
      Pagination,
    },
    expansion: { isCellExpanded },
  } = tableProps;

  const downloadAdvisory = useDownload();

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">SBOMs</Text>
          {/* <Text component="p">Search for SBOMs</Text> */}
        </TextContent>
      </PageSection>
      <PageSection>
        <div
          style={{
            backgroundColor: "var(--pf-v5-global--BackgroundColor--100)",
          }}
        >
          <Toolbar>
            <ToolbarContent>
              <FilterToolbar
                id="package-toolbar"
                {...{ showFiltersSideBySide: true }}
              />
              <PaginationToolbarItem>
                <Pagination
                  variant="top"
                  isCompact
                  widgetId="package-pagination-top"
                />
              </PaginationToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Package details table">
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
                      <Td width={10} columnKey="download"></Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </ConditionalTableBody>
          </Table>
          <Pagination
            variant="bottom"
            isCompact
            widgetId="packages-pagination-bottom"
          />
        </div>
      </PageSection>
    </>
  );
};
