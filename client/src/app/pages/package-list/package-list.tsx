import React from "react";
import { NavLink } from "react-router-dom";

import { ConditionalTableBody } from "@mturley-latest/react-table-batteries";
import {
  Label,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  ToolbarContent,
} from "@patternfly/react-core";

import { usePackageList } from "./usePackageList";

export const PackageList: React.FC = () => {
  const { tableProps, isFetching, fetchError, total } = usePackageList();

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

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Packages</Text>
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
                id="sbom-toolbar"
                {...{ showFiltersSideBySide: true }}
              />
              <PaginationToolbarItem>
                <Pagination
                  variant="top"
                  isCompact
                  widgetId="sbom-pagination-top"
                />
              </PaginationToolbarItem>
            </ToolbarContent>
          </Toolbar>

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
              isNoData={total === 0}
              numRenderedColumns={numRenderedColumns}
            >
              <Tbody>
                {currentPageItems?.map((item, rowIndex) => {
                  return (
                    <Tr key={item.purl} item={item} rowIndex={rowIndex}>
                      <Td width={25} columnKey="name">
                        <NavLink
                          to={`/packages/${encodeURIComponent(item.purl)}`}
                        >
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
            widgetId="advisories-pagination-bottom"
          />
        </div>
      </PageSection>
    </>
  );
};
