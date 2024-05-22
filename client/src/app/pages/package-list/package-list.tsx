import React from "react";

import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { useFetchPackages } from "@app/queries/packages";
import { PackageVersions } from "./components/package-versions";

interface TableData {
  packageId: string;
  packageName: string;
  namespace: {
    id: string;
    name: string;
  };
  type: {
    id: string;
    name: string;
  };
}

export const PackageList: React.FC = () => {
  const { isFetching, packages, fetchError } = useFetchPackages();

  const tableData = React.useMemo(() => {
    return packages.flatMap((pkg) => {
      return pkg.namespaces.flatMap((namespace) => {
        return namespace.names.map((packageName) => {
          const data: TableData = {
            packageId: packageName.id,
            packageName: packageName.name,
            namespace: {
              id: namespace.id,
              name: namespace.namespace,
            },
            type: {
              id: pkg.id,
              name: pkg.type,
            },
          };

          return data;
        });
      });
    });
  }, [packages]);

  const tableControls = useLocalTableControls({
    tableName: "package-table",
    persistTo: "state",
    idProperty: "packageId",
    items: tableData,
    isLoading: isFetching,
    columnNames: {
      name: "Name",
      namespace: "Namespace",
      type: "Type",
    },
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "filterText",
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
        getItemValue: (item) => item.packageName || "",
      },
    ],
    isSortEnabled: true,
    sortableColumns: ["name", "namespace", "type"],
    getSortValues: (item) => ({
      name: item.packageName,
      namespace: item.namespace.name,
      type: item.type.name,
    }),
    isPaginationEnabled: true,
    isExpansionEnabled: true,
    expandableVariant: "single",
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
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Packages</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <div
          style={{
            backgroundColor: "var(--pf-v5-global--BackgroundColor--100)",
          }}
        >
          <Toolbar {...toolbarProps}>
            <ToolbarContent>
              <FilterToolbar showFiltersSideBySide {...filterToolbarProps} />
              <ToolbarItem {...paginationToolbarItemProps}>
                <SimplePagination
                  idPrefix="package-table"
                  isTop
                  paginationProps={paginationProps}
                />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table {...tableProps} aria-label="Package table">
            <Thead>
              <Tr>
                <TableHeaderContentWithControls {...tableControls}>
                  <Th {...getThProps({ columnKey: "name" })} />
                  <Th {...getThProps({ columnKey: "namespace" })} />
                  <Th {...getThProps({ columnKey: "type" })} />
                </TableHeaderContentWithControls>
              </Tr>
            </Thead>
            <ConditionalTableBody
              isLoading={isFetching}
              isError={!!fetchError}
              isNoData={tableData.length === 0}
              numRenderedColumns={numRenderedColumns}
            >
              {currentPageItems?.map((item, rowIndex) => {
                return (
                  <Tbody key={item.packageId}>
                    <Tr {...getTrProps({ item })}>
                      <TableRowContentWithControls
                        {...tableControls}
                        item={item}
                        rowIndex={rowIndex}
                      >
                        <Td
                          width={50}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "name" })}
                        >
                          {item.packageName}
                        </Td>
                        <Td
                          width={30}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "namespace" })}
                        >
                          {item.namespace.name}
                        </Td>
                        <Td
                          width={20}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "type" })}
                        >
                          {item.type.name}
                        </Td>
                      </TableRowContentWithControls>
                    </Tr>
                    {isCellExpanded(item) ? (
                      <Tr isExpanded>
                        <Td colSpan={7}>
                          <ExpandableRowContent>
                            <PackageVersions
                              name={item.packageName}
                              namespace={item.namespace.name}
                              type={item.type.name}
                            />
                          </ExpandableRowContent>
                        </Td>
                      </Tr>
                    ) : null}
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
        </div>
      </PageSection>
    </>
  );
};
