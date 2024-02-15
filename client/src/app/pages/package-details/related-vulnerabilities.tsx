import { Skeleton } from "@patternfly/react-core";
import React from "react";
import { NavLink } from "react-router-dom";

import {
    Td as PFTd
} from "@patternfly/react-table";

import {
    ConditionalTableBody,
    useClientTableBatteries,
} from "@mturley-latest/react-table-batteries";

import { RENDER_DATE_FORMAT } from "@app/Constants";
import { CveIndexed } from "@app/api/models";
import { SeverityRenderer } from "@app/components/csaf/severity-renderer";
import { useFetchCveIndexedById } from "@app/queries/cves";
import { AxiosError } from "axios";
import dayjs from "dayjs";

interface RelatedVulnerabilitiesProps {
  vulnerabilities: { cve: string; severity: string }[];
}

export const RelatedVulnerabilities: React.FC<RelatedVulnerabilitiesProps> = ({
  vulnerabilities,
}) => {
  const tableControls = useClientTableBatteries({
    persistTo: "sessionStorage",
    idProperty: "cve",
    items: vulnerabilities,
    isLoading: false,
    columnNames: {
      id: "ID",
      description: "Description",
      cvss: "CVSS",
      datePublished: "Date published",
    },
    hasActionsColumn: true,
    filter: {
      isEnabled: true,
      filterCategories: [],
    },
    sort: {
      isEnabled: true,
      sortableColumns: [],
    },
    pagination: { isEnabled: true },
    expansion: {
      isEnabled: false,
      variant: "single",
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
      {/* <Toolbar>
        <ToolbarContent>
          <FilterToolbar id="related-products-toolbar" />
          <PaginationToolbarItem>
            <Pagination
              variant="top"
              isCompact
              widgetId="related-products-pagination-top"
            />
          </PaginationToolbarItem>
        </ToolbarContent>
      </Toolbar> */}

      <Table
        aria-label="Vulnerabilities table"
        className="vertical-aligned-table"
      >
        <Thead>
          <Tr isHeaderRow>
            <Th columnKey="id" />
            <Th columnKey="description" />
            <Th columnKey="cvss" />
            <Th columnKey="datePublished" />
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={false}
          // isError={!!fetchError}
          isNoData={vulnerabilities.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item.cve} isExpanded={isCellExpanded(item)}>
                <Tr item={item} rowIndex={rowIndex}>
                  <TdWrapper cveId={item.cve}>
                    {(cve, isFetching, fetchError) => (
                      <>
                        {isFetching ? (
                          <PFTd width={100} colSpan={4}>
                            <Skeleton />
                          </PFTd>
                        ) : (
                          <>
                            <Td width={15} columnKey="id">
                              <NavLink to={`/cves/${item.cve}`}>
                                {item.cve}
                              </NavLink>
                            </Td>
                            <Td
                              width={50}
                              modifier="truncate"
                              columnKey="description"
                            >
                              {cve?.document.document.descriptions.join(". ")}
                            </Td>
                            <Td width={15} modifier="truncate" columnKey="cvss">
                              {cve && (
                                <SeverityRenderer
                                  variant="progress"
                                  score={cve.score}
                                />
                              )}
                            </Td>
                            <Td
                              width={15}
                              modifier="truncate"
                              columnKey="datePublished"
                            >
                              {dayjs(
                                cve?.document.document.date_published
                              ).format(RENDER_DATE_FORMAT)}
                            </Td>
                          </>
                        )}
                      </>
                    )}
                  </TdWrapper>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <Pagination
        variant="bottom"
        isCompact
        widgetId="related-products-pagination-bottom"
      />
    </>
  );
};

const TdWrapper = ({
  cveId,
  children,
}: {
  cveId: string;
  children: (
    sbom: CveIndexed | undefined,
    isFetching: boolean,
    fetchError: AxiosError
  ) => React.ReactNode;
}) => {
  const { cve, isFetching, fetchError } = useFetchCveIndexedById(cveId);
  return children(cve, isFetching, fetchError);
};
