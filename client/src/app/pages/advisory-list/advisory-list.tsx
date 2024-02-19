import React from "react";
import { NavLink } from "react-router-dom";

import {
  Button,
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
import DownloadIcon from "@patternfly/react-icons/dist/esm/icons/download-icon";

import {
  ConditionalTableBody,
  useTablePropHelpers,
} from "@mturley-latest/react-table-batteries";
import { formatRustDate } from "@app/utils/utils";

import { RHSeverityShield } from "@app/components/csaf/rh-severity";
import { useDownload } from "@app/hooks/csaf/download-advisory";

import { AdvisoryDetails } from "./advisory-details";
import { useAdvisoryList } from "./useAdvisoryList";
import { VulnerabilitiesCount } from "./vulnerabilities";

export const AdvisoryList: React.FC = () => {
  const { tableProps, isFetching, fetchError, total } = useAdvisoryList();

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

  const { downloadAdvisory } = useDownload();

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Advisories</Text>
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
                id="advisory-toolbar"
                {...{ showFiltersSideBySide: true }}
              />
              <PaginationToolbarItem>
                <Pagination
                  variant="top"
                  isCompact
                  widgetId="advisories-pagination-top"
                />
              </PaginationToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Advisory details table">
            <Thead>
              <Tr isHeaderRow>
                <Th columnKey="id" />
                <Th columnKey="title" />
                <Th columnKey="severity" />
                <Th columnKey="revision" />
                <Th columnKey="vulnerabilities" />
                <Th columnKey="download" />
              </Tr>
            </Thead>
            <ConditionalTableBody
              isLoading={isFetching}
              isError={!!fetchError}
              isNoData={total === 0}
              numRenderedColumns={numRenderedColumns}
            >
              {currentPageItems?.map((item, rowIndex) => {
                return (
                  <Tbody key={item.id}>
                    <Tr item={item} rowIndex={rowIndex}>
                      <Td width={15} columnKey="id">
                        <NavLink to={`/advisories/${item.id}`}>
                          {item.id}
                        </NavLink>
                      </Td>
                      <Td width={45} modifier="truncate" columnKey="title">
                        {item.title}
                      </Td>
                      <Td width={10} columnKey="severity">
                        <RHSeverityShield value={item.severity} />
                      </Td>
                      <Td width={10} modifier="truncate" columnKey="revision">
                        {formatRustDate(item.date)}
                      </Td>
                      <Td width={10} columnKey="vulnerabilities">
                        {item.cves.length === 0 ? (
                          "N/A"
                        ) : (
                          <VulnerabilitiesCount
                            severities={item.cve_severity_count}
                          />
                        )}
                      </Td>
                      <Td width={10} columnKey="download">
                        <Button
                          variant="plain"
                          aria-label="Download"
                          onClick={() => {
                            downloadAdvisory(item.id);
                          }}
                        >
                          <DownloadIcon />
                        </Button>
                      </Td>
                    </Tr>
                    {isCellExpanded(item) ? (
                      <PFTr isExpanded>
                        <PFTd colSpan={7}>
                          <ExpandableRowContent>
                            <AdvisoryDetails id={item.id} />
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
            widgetId="advisories-pagination-bottom"
          />
        </div>
      </PageSection>
    </>
  );
};
