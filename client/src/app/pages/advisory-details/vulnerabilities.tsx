import {
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Label,
  List,
  ListItem,
  ToolbarContent
} from "@patternfly/react-core";
import {
  ExpandableRowContent,
  Td as PFTd,
  Tr as PFTr,
} from "@patternfly/react-table";
import React from "react";
import { NavLink } from "react-router-dom";

import dayjs from "dayjs";

import { Vulnerability } from "@app/api/models";
import { RENDER_DATE_FORMAT } from "@app/Constants";

import { NotesMarkdown } from "@app/components/csaf/notes-markdown";
import { ProductStatusTree } from "@app/components/csaf/product-status-tree";
import { SeverityRenderer } from "@app/components/csaf/severity-renderer";
import {
  ConditionalTableBody,
  FilterType,
  useClientTableBatteries,
} from "@mturley-latest/react-table-batteries";
import { Remediations } from "./remediations";

interface VulnerabilitiesProps {
  isFetching: boolean;
  fetchError: Error;
  vulnerabilities: Vulnerability[];
}

export const Vulnerabilities: React.FC<VulnerabilitiesProps> = ({
  isFetching,
  fetchError,
  vulnerabilities,
}) => {
  const tableControls = useClientTableBatteries({
    persistTo: "sessionStorage",
    idProperty: "cve",
    items: vulnerabilities,
    isLoading: isFetching,
    columnNames: {
      cve: "CVE ID",
      title: "Title",
      discovery: "Discovery",
      release: "Release",
      score: "Score",
      cwe: "CWE",
    },
    hasActionsColumn: true,
    filter: {
      isEnabled: true,
      filterCategories: [
        {
          key: "cve",
          title: "ID",
          type: FilterType.search,
          placeholderText: "Search by ID...",
          getItemValue: (item) => item.cve || "",
        },
      ],
    },
    sort: {
      isEnabled: true,
      sortableColumns: ["cve", "discovery", "release"],
      getSortValues: (vuln) => ({
        cve: vuln?.cve || "",
        discovery: vuln ? dayjs(vuln.discovery_date).millisecond() : 0,
        release: vuln ? dayjs(vuln.release_date).millisecond() : 0,
      }),
    },
    pagination: { isEnabled: true },
    expansion: {
      isEnabled: true,
      variant: "single",
      persistTo: "sessionStorage",
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
  } = tableControls;

  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <FilterToolbar id="project-toolbar" />
          <PaginationToolbarItem>
            <Pagination
              variant="top"
              isCompact
              widgetId="projects-pagination-top"
            />
          </PaginationToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="Projects table" className="vertical-aligned-table">
        <Thead>
          <Tr isHeaderRow>
            <Th columnKey="cve" />
            <Th columnKey="title" />
            <Th columnKey="discovery" />
            <Th columnKey="release" />
            <Th columnKey="score" />
            <Th columnKey="cwe" />
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isFetching}
          isError={!!fetchError}
          isNoData={vulnerabilities.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item.cve}>
                <Tr item={item} rowIndex={rowIndex}>
                  <Td width={15} columnKey="cve">
                    <NavLink to={`/cves/${item.cve}`}>{item.cve}</NavLink>
                  </Td>
                  <Td width={40} modifier="truncate" columnKey="title">
                    {item.title}
                  </Td>
                  <Td width={10} columnKey="discovery">
                    {dayjs(item.discovery_date).format(RENDER_DATE_FORMAT)}
                  </Td>
                  <Td width={10} columnKey="release">
                    {dayjs(item.release_date).format(RENDER_DATE_FORMAT)}
                  </Td>
                  <Td width={15} columnKey="score">
                    {item.scores.map((e, index) => (
                      <SeverityRenderer
                        key={index}
                        variant="progress"
                        score={e.cvss_v3.baseScore}
                        severity={e.cvss_v3.baseSeverity}
                      />
                    ))}
                  </Td>
                  <Td width={10} columnKey="cwe">
                    {item.cwe?.id || "N/A"}
                  </Td>
                </Tr>
                {isCellExpanded(item) ? (
                  <PFTr isExpanded>
                    <PFTd colSpan={7}>
                      <ExpandableRowContent>
                        <Grid hasGutter>
                          <GridItem md={6}>
                            <Card isFullHeight isCompact isPlain>
                              <CardTitle>Product status</CardTitle>
                              <CardBody>
                                <ProductStatusTree
                                  variant="tree"
                                  branches={item.product_status}
                                />
                              </CardBody>
                            </Card>
                          </GridItem>
                          <GridItem md={6}>
                            <Card isFullHeight isCompact isPlain>
                              <CardTitle>Remediations</CardTitle>
                              <CardBody>
                                <Remediations vulnerabily={item} />
                              </CardBody>
                            </Card>
                          </GridItem>
                          <GridItem md={6}>
                            <Card isFullHeight isCompact isPlain>
                              <CardTitle>IDs</CardTitle>
                              <CardBody>
                                <List>
                                  {item.ids.map((e, index) => (
                                    <ListItem key={index}>
                                      {e.text}({e.system_name})
                                    </ListItem>
                                  ))}
                                </List>
                              </CardBody>
                            </Card>
                          </GridItem>
                          <GridItem md={6}>
                            <Card isFullHeight isCompact isPlain>
                              <CardTitle>References</CardTitle>
                              <CardBody>
                                <List>
                                  {item.references.map((e, index) => (
                                    <ListItem key={index}>
                                      <a href={e.url} target="_blank">
                                        {e.summary} <Label>{e.category}</Label>
                                      </a>
                                    </ListItem>
                                  ))}
                                </List>
                              </CardBody>
                            </Card>
                          </GridItem>
                          <GridItem md={12}>
                            <Card isFullHeight isCompact isPlain>
                              <CardTitle>Notes</CardTitle>
                              <CardBody>
                                <NotesMarkdown
                                  notes={item.notes || []}
                                  isCompact
                                />
                              </CardBody>
                            </Card>
                          </GridItem>
                        </Grid>
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
        widgetId="projects-pagination-bottom"
      />
    </>
  );
};
