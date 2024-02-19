import React from "react";
import { NavLink } from "react-router-dom";

import { ConditionalTableBody } from "@mturley-latest/react-table-batteries";
import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  ToolbarContent,
} from "@patternfly/react-core";

import dayjs from "dayjs";

import { RENDER_DATE_FORMAT } from "@app/Constants";
import { useSbomList } from "./useSbomList";

export const SbomList: React.FC = () => {
  const { tableProps, isFetching, fetchError, total } = useSbomList();

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
              isNoData={total === 0}
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
