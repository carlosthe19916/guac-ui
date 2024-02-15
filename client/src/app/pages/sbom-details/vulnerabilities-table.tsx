import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  List,
  ListItem,
  ToolbarContent,
} from "@patternfly/react-core";
import {
  ExpandableRowContent,
  IExtraData,
  IRowData,
  Td as PFTd,
  Tr as PFTr,
} from "@patternfly/react-table";
import React from "react";
import { NavLink } from "react-router-dom";

import {
  ConditionalTableBody,
  FilterType,
  useClientTableBatteries,
} from "@mturley-latest/react-table-batteries";
import dayjs from "dayjs";

import { RENDER_DATE_FORMAT } from "@app/Constants";
import { SbomVulnerabilities } from "@app/api/models";
import { SeverityRenderer } from "@app/components/csaf/severity-renderer";
import { useFetchAdvisoryByCveId } from "@app/queries/advisories";
import { PackageURL } from "packageurl-js";

interface VulnerabilitiresTableProps {
  isFetching: boolean;
  fetchError: Error;
  sbomVulnerabilitires?: SbomVulnerabilities;
}

export const VulnerabilitiresTable: React.FC<VulnerabilitiresTableProps> = ({
  isFetching,
  fetchError,
  sbomVulnerabilitires,
}) => {
  const tableControls = useClientTableBatteries({
    persistTo: "sessionStorage",
    idProperty: "id",
    items: sbomVulnerabilitires?.details || [],
    isLoading: isFetching,
    columnNames: {
      id: "ID",
      description: "Description",
      cvss: "CVSS",
      affectedDependencies: "Affected dependencies",
      published: "Published",
      updated: "Updated",
    },
    hasActionsColumn: true,
    filter: {
      isEnabled: true,
      filterCategories: [
        {
          key: "filterText",
          title: "Filter text",
          type: FilterType.search,
          placeholderText: "Search...",
          getItemValue: (item) => `${item.id} ${item.description}`,
        },
      ],
    },
    sort: {
      isEnabled: true,
      sortableColumns: ["id", "affectedDependencies", "published", "updated"],
      getSortValues: (item) => ({
        id: item?.id || "",
        affectedDependencies: Object.keys(item.affected_packages || {}).length,
        published: item ? dayjs(item.published as any).millisecond() : 0,
        updated: item ? dayjs(item.updated as any).millisecond() : 0,
      }),
    },
    pagination: { isEnabled: true },
    expansion: {
      isEnabled: true,
      variant: "compound",
      persistTo: "state",
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
    expansion: { isCellExpanded, setCellExpanded },
  } = tableControls;

  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <FilterToolbar id="vulnerabilities-toolbar" />
          <PaginationToolbarItem>
            <Pagination
              variant="top"
              isCompact
              widgetId="vulnerabilities-pagination-top"
            />
          </PaginationToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table
        aria-label="Vulnerabilities table"
        className="vertical-aligned-table"
      >
        <Thead>
          <Tr isHeaderRow>
            <Th columnKey="id" />
            <Th columnKey="description" />
            <Th columnKey="cvss" />
            <Th columnKey="affectedDependencies" />
            <Th columnKey="published" />
            <Th columnKey="updated" />
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={sbomVulnerabilitires?.details.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item.id} isExpanded={isCellExpanded(item)}>
                <Tr item={item} rowIndex={rowIndex}>
                  <Td
                    width={15}
                    columnKey="id"
                    compoundExpand={{
                      isExpanded: isCellExpanded(item, "id"),
                      onToggle: (
                        event: React.MouseEvent,
                        rowIndex: number,
                        colIndex: number,
                        isOpen: boolean,
                        rowData: IRowData,
                        extraData: IExtraData
                      ) => {
                        setCellExpanded({
                          item,
                          isExpanding: !isOpen,
                          columnKey: "id",
                        });
                      },
                    }}
                  >
                    <NavLink to={`/cves/${item.id}`}>{item.id}</NavLink>
                  </Td>
                  <Td width={40} modifier="truncate" columnKey="description">
                    {item.description}
                  </Td>
                  <Td width={15} columnKey="cvss">
                    {item.sources?.mitre?.score && (
                      <SeverityRenderer
                        variant="progress"
                        score={item.sources.mitre.score}
                      />
                    )}
                  </Td>
                  <Td
                    width={10}
                    columnKey="affectedDependencies"
                    compoundExpand={{
                      isExpanded: isCellExpanded(item, "affectedDependencies"),
                      onToggle: (
                        event: React.MouseEvent,
                        rowIndex: number,
                        colIndex: number,
                        isOpen: boolean,
                        rowData: IRowData,
                        extraData: IExtraData
                      ) => {
                        setCellExpanded({
                          item,
                          isExpanding: !isOpen,
                          columnKey: "affectedDependencies",
                        });
                      },
                    }}
                  >
                    {Object.keys(item.affected_packages || {}).length}
                  </Td>
                  <Td width={10} columnKey="published">
                    {dayjs(item.published as any).format(RENDER_DATE_FORMAT)}
                  </Td>
                  <Td width={10} columnKey="updated">
                    {dayjs(item.updated as any).format(RENDER_DATE_FORMAT)}
                  </Td>
                </Tr>
                {isCellExpanded(item) ? (
                  <PFTr isExpanded>
                    <PFTd colSpan={7}>
                      <ExpandableRowContent>
                        {isCellExpanded(item, "id") && (
                          <CVEDetails
                            id={item.id}
                            description={item.description}
                          />
                        )}
                        {isCellExpanded(item, "affectedDependencies") && (
                          <AffectedDependenciesTable
                            data={Array.from(
                              Object.keys(item.affected_packages || {})
                            )}
                          />
                        )}
                      </ExpandableRowContent>
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
        widgetId="vulnerabilities-pagination-bottom"
      />
    </>
  );
};

const AffectedDependenciesTable = ({ data }: { data: string[] }) => {
  const pageItems = React.useMemo(() => {
    return data.map((e) => {
      let packageUrl;
      try {
        packageUrl = PackageURL.fromString(e);
      } catch (e) {
        console.log(e);
      }
      return {
        purl: e,
        package: packageUrl,
      };
    });
  }, [data]);

  const tableControls = useClientTableBatteries({
    variant: "compact",
    persistTo: "state",
    idProperty: "purl",
    items: pageItems || [],
    isLoading: false,
    columnNames: {
      type: "Type",
      namespace: "Namespace",
      name: "Name",
      version: "Version",
      path: "Path",
      qualifiers: "Qualifiers",
    },
    filter: {
      isEnabled: true,
      filterCategories: [],
    },
    sort: {
      isEnabled: true,
      sortableColumns: [],
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
    expansion: { isCellExpanded, setCellExpanded },
  } = tableControls;

  return (
    <>
      <Table aria-label="Packages details table">
        <Thead>
          <Tr isHeaderRow>
            <Th columnKey="type" />
            <Th columnKey="namespace" />
            <Th columnKey="name" />
            <Th columnKey="version" />
            <Th columnKey="path" />
            <Th columnKey="qualifiers" />
          </Tr>
        </Thead>
        <ConditionalTableBody
          isNoData={pageItems.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          <Tbody>
            {currentPageItems?.map((item, rowIndex) => {
              return (
                <Tr key={item.purl} item={item} rowIndex={rowIndex}>
                  <Td width={15} columnKey="type">
                    {item.package?.type}
                  </Td>
                  <Td width={15} modifier="truncate" columnKey="namespace">
                    {item.package?.namespace}
                  </Td>
                  <Td width={15} columnKey="name">
                    <NavLink to={`/packages/${encodeURIComponent(item.purl)}`}>
                      {item.package?.name}
                    </NavLink>
                  </Td>
                  <Td width={15} columnKey="version">
                    {item.package?.version}
                  </Td>
                  <Td width={10} modifier="truncate" columnKey="path">
                    {item.package?.subpath}
                  </Td>
                  <Td width={30} columnKey="qualifiers">
                    {Object.entries(item.package?.qualifiers || {}).map(
                      ([k, v], index) => (
                        <Label key={index} isCompact>{`${k}=${v}`}</Label>
                      )
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </ConditionalTableBody>
      </Table>
    </>
  );
};

const CVEDetails = ({
  id,
  description,
}: {
  id: string;
  description: string;
}) => {
  const { advisories } = useFetchAdvisoryByCveId(id);

  return (
    <DescriptionList isCompact>
      <DescriptionListGroup>
        <DescriptionListTerm>Description</DescriptionListTerm>
        <DescriptionListDescription>{description}</DescriptionListDescription>
      </DescriptionListGroup>
      {advisories && (
        <DescriptionListGroup>
          <DescriptionListTerm>Relevant advisories</DescriptionListTerm>
          <DescriptionListDescription>
            <List>
              {advisories.map((e, index) => (
                <ListItem key={index}>
                  <NavLink to={`/advisories/${e.id}`}>{e.id}</NavLink>
                </ListItem>
              ))}
            </List>
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}
    </DescriptionList>
  );
};
