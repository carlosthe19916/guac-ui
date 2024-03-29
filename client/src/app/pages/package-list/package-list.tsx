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
  ToolbarContent,
} from "@patternfly/react-core";
import {
  ExpandableRowContent,
  Td as PFTd,
  Tr as PFTr,
} from "@patternfly/react-table";

import { PackageVersion } from "@app/api/models";
import { useFetchPackages } from "@app/queries/packages";
import {
  ConditionalTableBody,
  FilterType,
  useClientTableBatteries,
} from "@carlosthe19916-latest/react-table-batteries";

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

  const tableState = useClientTableBatteries({
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
    filter: {
      isEnabled: true,
      filterCategories: [
        {
          key: "filterText",
          title: "Filter text",
          placeholderText: "Search",
          type: FilterType.search,
          getItemValue: (item) => item.name || "",
        },
        {
          key: "type",
          title: "Type",
          placeholderText: "Type",
          type: FilterType.multiselect,
          selectOptions: packageTypes.map((e) => ({ key: e, value: e })),
        },
      ],
    },
    sort: {
      isEnabled: true,
      sortableColumns: ["id", "type", "name", "purl", "version"],
      getSortValues: (item) => ({
        id: item.id,
        type: item.type,
        name: item.name,
        purl: item.purl,
        version: item.version,
      }),
    },
    pagination: { isEnabled: true },
    expansion: {
      isEnabled: true,
      variant: "single",
    },
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
  } = tableState;

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

          <Table aria-label="Packages details table">
            <Thead>
              <Tr isHeaderRow>
                <Th columnKey="id" />
                <Th columnKey="type" />
                <Th columnKey="name" />
                <Th columnKey="purl" />
                <Th columnKey="version" />
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
                    <Tr item={item} rowIndex={rowIndex}>
                      <Td width={10} columnKey="id">
                        <NavLink to={`/packages/${item.id}`}>{item.id}</NavLink>
                      </Td>
                      <Td width={10} modifier="truncate" columnKey="type">
                        {item.type}
                      </Td>
                      <Td width={20} modifier="truncate" columnKey="name">
                        {item.name}
                      </Td>
                      <Td width={50} modifier="truncate" columnKey="purl">
                        {item.purl}
                      </Td>
                      <Td width={10} modifier="truncate" columnKey="version">
                        {item.version}
                      </Td>
                    </Tr>
                    {isCellExpanded(item) ? (
                      <PFTr isExpanded>
                        <PFTd colSpan={7}>
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
                        </PFTd>
                      </PFTr>
                    ) : null}
                  </Tbody>
                );
              })}
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
