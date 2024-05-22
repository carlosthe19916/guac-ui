import React from "react";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";

import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useFetchPackageVersions } from "@app/queries/packages";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

interface PackageVersionsProps {
  name: string;
  namespace: string;
  type: string;
}

export const PackageVersions: React.FC<PackageVersionsProps> = ({
  name,
  namespace,
  type,
}) => {
  const { versions, isFetching, fetchError } = useFetchPackageVersions(
    name,
    namespace,
    type
  );

  const tableControls = useLocalTableControls({
    variant: "compact",
    tableName: "version-table",
    idProperty: "id",
    items: versions,
    columnNames: {
      purl: "Purl",
      version: "Version",
      qualifiers: "Qualifiers",
      subpath: "Subpath",
    },
    hasActionsColumn: true,
    isSortEnabled: true,
    sortableColumns: ["version", "purl", "subpath"],
    getSortValues: (item) => ({
      purl: item.purl,
      version: item.version,
      subpath: item.subpath,
    }),
    isPaginationEnabled: true,
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "version",
        title: "Version",
        type: FilterType.search,
        placeholderText: "Search by version...",
        getItemValue: (item) => item.version || "",
      },
    ],
  });

  const {
    currentPageItems,
    numRenderedColumns,
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      paginationToolbarItemProps,
      paginationProps,
      tableProps,
      getThProps,
      getTrProps,
      getTdProps,
    },
    expansionDerivedState: { isCellExpanded },
  } = tableControls;

  return (
    <>
      <Toolbar {...toolbarProps}>
        <ToolbarContent>
          <FilterToolbar showFiltersSideBySide {...filterToolbarProps} />
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination
              idPrefix="package-table"
              isTop
              isCompact
              paginationProps={paginationProps}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table {...tableProps} aria-label="Vulnerability table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: "version" })} />
              <Th {...getThProps({ columnKey: "purl" })} />
              <Th {...getThProps({ columnKey: "qualifiers" })} />
              <Th {...getThProps({ columnKey: "subpath" })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={versions.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item.id}>
                <Tr {...getTrProps({ item })}>
                  <TableRowContentWithControls
                    {...tableControls}
                    item={item}
                    rowIndex={rowIndex}
                  >
                    <Td width={20} {...getTdProps({ columnKey: "version" })}>
                      {item.version}
                    </Td>
                    <Td
                      width={40}
                      modifier="truncate"
                      {...getTdProps({ columnKey: "purl" })}
                    >
                      {item.purl}
                    </Td>
                    <Td
                      width={20}
                      {...getTdProps({ columnKey: "qualifiers" })}
                    ></Td>
                    <Td width={20} {...getTdProps({ columnKey: "subpath" })}>
                      {item.subpath}
                    </Td>
                  </TableRowContentWithControls>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <SimplePagination
        idPrefix="package-table"
        isTop={false}
        isCompact
        paginationProps={paginationProps}
      />
    </>
  );
};
