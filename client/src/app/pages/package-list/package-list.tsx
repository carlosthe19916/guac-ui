import React from "react";
import { NavLink } from "react-router-dom";

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  List,
  ListItem,
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

import { PackageVersion } from "@app/api/models";
import { useFetchPackages } from "@app/queries/packages";
import { useLocalTableControls } from "@app/hooks/table-controls";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
} from "@app/components/TableControls";

interface TableData extends PackageVersion {
  type: string;
  name: string;
}

export const PackageList: React.FC = () => {
  const { isFetching, packages, fetchError } = useFetchPackages();

  const tableData = React.useMemo(() => {
    return packages.flatMap((p) => {
      const type = p.type;

      return p.namespaces
        .flatMap((ns) => ns.names)
        .flatMap((packageName) => {
          const name = packageName.name;

          return packageName.versions.map((packageVersion) => {
            const data: TableData = {
              ...packageVersion,
              type,
              name,
            };

            return data;
          });
        });
    });
  }, [packages]);

  const packageTypes = React.useMemo(() => {
    return packages.flatMap((p) => {
      return p.type;
    });
  }, [packages]);

  const tableControls = useLocalTableControls({
    tableName: "package-table",
    persistTo: "state",
    idProperty: "id",
    items: tableData,
    isLoading: isFetching,
    columnNames: {
      id: "Id",
      type: "Type",
      name: "Name",
      purl: "Purl",
      version: "Version",
    },
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "filterText",
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
        getItemValue: (item) => item.name || "",
      },
      {
        categoryKey: "type",
        title: "Type",
        placeholderText: "Type",
        type: FilterType.multiselect,
        selectOptions: packageTypes.map((e) => ({ key: e, value: e })),
      },
    ],
    isSortEnabled: true,
    sortableColumns: ["id", "type", "name", "purl", "version"],
    getSortValues: (item) => ({
      id: item.id,
      type: item.type,
      name: item.name,
      purl: item.purl,
      version: item.version,
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
                  <Th {...getThProps({ columnKey: "id" })} />
                  <Th {...getThProps({ columnKey: "type" })} />
                  <Th {...getThProps({ columnKey: "name" })} />
                  <Th {...getThProps({ columnKey: "purl" })} />
                  <Th {...getThProps({ columnKey: "version" })} />
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
                  <Tbody key={item.id}>
                    <Tr {...getTrProps({ item })}>
                      <TableRowContentWithControls
                        {...tableControls}
                        item={item}
                        rowIndex={rowIndex}
                      >
                        <Td width={10} {...getTdProps({ columnKey: "id" })}>
                          <NavLink to={`/packages/${item.id}`}>
                            {item.id}
                          </NavLink>
                        </Td>
                        <Td
                          width={10}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "type" })}
                        >
                          {item.type}
                        </Td>
                        <Td
                          width={20}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "name" })}
                        >
                          {item.name}
                        </Td>
                        <Td
                          width={50}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "purl" })}
                        >
                          {item.purl}
                        </Td>
                        <Td
                          width={10}
                          modifier="truncate"
                          {...getTdProps({ columnKey: "version" })}
                        >
                          {item.version}
                        </Td>
                      </TableRowContentWithControls>
                    </Tr>
                    {isCellExpanded(item) ? (
                      <Tr isExpanded>
                        <Td colSpan={7}>
                          <div className="pf-v5-u-m-md">
                            <ExpandableRowContent>
                              <DescriptionList>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>
                                    Subpath
                                  </DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {item.subpath}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>
                                    Qualifiers
                                  </DescriptionListTerm>
                                  <DescriptionListDescription>
                                    <List>
                                      {item.qualifiers.map((e, index) => (
                                        <ListItem key={index}>
                                          {e.key}= {e.value}
                                        </ListItem>
                                      ))}
                                    </List>
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                              </DescriptionList>
                            </ExpandableRowContent>
                          </div>
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
