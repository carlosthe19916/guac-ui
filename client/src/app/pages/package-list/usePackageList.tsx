import { Label } from "@patternfly/react-core";
import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";

import {
  ConditionalTableBody,
  FilterType,
  useTablePropHelpers,
  useTableState,
} from "@carlosthe19916-latest/react-table-batteries";

import { PackageURL } from "packageurl-js";

import { getHubRequestParams } from "@app/hooks/table-controls";

import {
  TablePersistenceKeyPrefixes
} from "@app/Constants";
import { useFetchPackages } from "@app/queries/packages";

export const usePackageList = () => {
  const tableState = useTableState({
    persistTo: "state",
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
          key: "type",
          title: "Type",
          placeholderText: "Type",
          type: FilterType.multiselect,
          selectOptions: [
            { key: "maven", value: "Maven" },
            { key: "rpm", value: "RPM" },
            { key: "npm", value: "NPM" },
            { key: "oci", value: "OCI" },
          ],
        },
        {
          key: "qualifier:arch",
          title: "Architecture",
          placeholderText: "Architecture",
          type: FilterType.multiselect,
          selectOptions: [
            { key: "x86_64", value: "AMD 64Bit" },
            { key: "aarch64", value: "ARM 64bit" },
            { key: "ppc64le", value: "PowerPC" },
            { key: "s390x", value: "S390" },
          ],
        },
        {
          key: "supplier",
          title: "Supplier",
          placeholderText: "Supplier",
          type: FilterType.multiselect,
          selectOptions: [{ key: "Organization: Red Hat", value: "Red Hat" }],
        },
      ],
    },
    sort: {
      isEnabled: true,
      sortableColumns: [],
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

  const {
    currentPageItems,
    numRenderedColumns,
    components: { Table, Thead, Tr, Th, Tbody, Td, Pagination },
    expansion: { isCellExpanded },
  } = tableProps;

  const table = (
    <>
      <Table aria-label="Packages details table">
        <Thead>
          <Tr isHeaderRow>
            <Th columnKey="name" />
            <Th columnKey="namespace" />
            <Th columnKey="version" />
            <Th columnKey="type" />
            <Th columnKey="path" />
            <Th columnKey="qualifiers" />
            <Th columnKey="vulnerabilities" />
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
                <Tr key={item.purl} item={item} rowIndex={rowIndex}>
                  <Td width={25} columnKey="name">
                    <NavLink to={`/packages/${encodeURIComponent(item.purl)}`}>
                      {item.package?.name}
                    </NavLink>
                  </Td>
                  <Td width={10} modifier="truncate" columnKey="namespace">
                    {item.package?.namespace}
                  </Td>
                  <Td width={15} columnKey="version">
                    {item.package?.version}
                  </Td>
                  <Td width={10} modifier="truncate" columnKey="type">
                    {item.package?.type}
                  </Td>
                  <Td width={10} modifier="truncate" columnKey="path">
                    {item.package?.subpath}
                  </Td>
                  <Td width={20} columnKey="qualifiers">
                    {Object.entries(item.package?.qualifiers || {}).map(
                      ([k, v], index) => (
                        <Label key={index} isCompact>{`${k}=${v}`}</Label>
                      )
                    )}
                  </Td>
                  <Td width={10} columnKey="vulnerabilities">
                    N/A
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
        widgetId="packages-pagination-bottom"
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
