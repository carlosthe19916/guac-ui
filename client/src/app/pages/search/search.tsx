import React from "react";
import { NavLink } from "react-router-dom";

import { RHSeverityShield } from "@app/components/csaf/rh-severity";
import { formatRustDate } from "@app/utils/utils";
import {
  ConditionalTableBody,
  FilterType,
} from "@mturley-latest/react-table-batteries";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Checkbox,
  Grid,
  GridItem,
  Label,
  PageSection,
  Radio,
  SearchInput,
  Split,
  SplitItem,
  Tab,
  TabAction,
  TabTitleText,
  Tabs,
  Text,
  TextContent,
  ToolbarContent,
} from "@patternfly/react-core";
import DownloadIcon from "@patternfly/react-icons/dist/esm/icons/download-icon";
import {
  ExpandableRowContent,
  Td as PFTd,
  Tr as PFTr,
} from "@patternfly/react-table";

import dayjs from "dayjs";

import { useDownload } from "@app/hooks/csaf/download-advisory";

import { RENDER_DATE_FORMAT } from "@app/Constants";
import { SeverityRenderer } from "@app/components/csaf/severity-renderer";

import { AdvisoryDetails } from "../advisory-list/advisory-details";
import { VulnerabilitiesCount } from "../advisory-list/vulnerabilities";

import { useAdvisoryList } from "../advisory-list/useAdvisoryList";
import { useCveList } from "../cve-list/useCveList";
import { usePackageList } from "../package-list/usePackageList";
import { useSbomList } from "../sbom-list/useSbomList";

enum TabIndex {
  CVEs,
  Packages,
  SBOMs,
  Advisories,
}

export const Search: React.FC = () => {
  const [filterText, setFilterText] = React.useState("");
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(
    TabIndex.CVEs
  );

  // CVEs
  const {
    tableProps: tablePropsCves,
    isFetching: isFetchingCves,
    fetchError: fetchErrorCves,
    total: totalCves,
  } = useCveList();

  const {
    currentPageItems: currentPageItemsCves,
    numRenderedColumns: numRenderedColumnsCves,
    components: {
      Table: TableCves,
      Thead: TheadCves,
      Tr: TrCves,
      Th: ThCves,
      Tbody: TbodyCves,
      Td: TdCves,
      Toolbar: ToolbarCves,
      PaginationToolbarItem: PaginationToolbarItemCves,
      Pagination: PaginationCves,
    },
    expansion: { isCellExpanded: isCellExpandedCves },
    filter: filterCves,
  } = tablePropsCves;

  // Packages
  const {
    tableProps: tablePropsPackages,
    isFetching: isFetchingPackages,
    fetchError: fetchErrorPackages,
    total: totalPackages,
  } = usePackageList();

  const {
    currentPageItems: currentPageItemsPackages,
    numRenderedColumns: numRenderedColumnsPackages,
    components: {
      Table: TablePackages,
      Thead: TheadPackages,
      Tr: TrPackages,
      Th: ThPackages,
      Tbody: TbodyPackages,
      Td: TdPackages,
      Toolbar: ToolbarPackages,
      PaginationToolbarItem: PaginationToolbarItemPackages,
      Pagination: PaginationPackages,
    },
    expansion: { isCellExpanded: isCellExpandedPackages },
    filter: filterPackages,
  } = tablePropsPackages;

  // SBOMs
  const {
    tableProps: tablePropsSboms,
    isFetching: isFetchingSboms,
    fetchError: fetchErrorSboms,
    total: totalSboms,
  } = useSbomList();

  const {
    currentPageItems: currentPageItemsSboms,
    numRenderedColumns: numRenderedColumnsSboms,
    components: {
      Table: TableSboms,
      Thead: TheadSboms,
      Tr: TrSboms,
      Th: ThSboms,
      Tbody: TbodySboms,
      Td: TdSboms,
      Toolbar: ToolbarSboms,
      PaginationToolbarItem: PaginationToolbarItemSboms,
      Pagination: PaginationSboms,
    },
    expansion: { isCellExpanded: isCellExpandedSboms },
    filter: filterSboms,
  } = tablePropsSboms;

  // Advisories
  const {
    tableProps: tablePropsAdvisories,
    isFetching: isFetchingAdvisories,
    fetchError: fetchErrorAdvisories,
    total: totalAdvisories,
  } = useAdvisoryList();

  const {
    currentPageItems: currentPageItemsAdvisories,
    numRenderedColumns: numRenderedColumnsAdvisories,
    components: {
      Table: TableAdvisories,
      Thead: TheadAdvisories,
      Tr: TrAdvisories,
      Th: ThAdvisories,
      Tbody: TbodyAdvisories,
      Td: TdAdvisories,
      Toolbar: ToolbarAdvisories,
      PaginationToolbarItem: PaginationToolbarItemAdvisories,
      Pagination: PaginationAdvisories,
    },
    expansion: { isCellExpanded: isCellExpandedAdvisories },
    filter: filterAdvisories,
  } = tablePropsAdvisories;

  // Download
  const { downloadAdvisory } = useDownload();

  // Filters
  let filter: any = null;
  // switch (activeTabKey) {
  //   case TabIndex.CVEs:
  //     filter = filterCves;
  //     break;
  //   case TabIndex.Packages:
  //     filter = filterPackages;
  //   case TabIndex.SBOMs:
  //     filter = filterSboms;
  //   case TabIndex.Advisories:
  //     filter = filterAdvisories;
  //   default:
  //     break;
  // }

  return (
    <>
      <PageSection variant="light">
        <Split>
          <SplitItem isFilled>
            <TextContent>
              <Text component="h1">Search results</Text>
            </TextContent>
          </SplitItem>
          <SplitItem>
            <SearchInput
              value={filterText}
              onChange={(_, val) => setFilterText(val)}
              style={{ width: 600 }}
            />
          </SplitItem>
        </Split>
      </PageSection>
      <PageSection>
        <Grid hasGutter>
          <GridItem md={3}>
            <Card>
              <CardBody style={{ padding: 0 }}>
                {filter &&
                  filter.filterCategories.map((e: any, index: number) => {
                    if (e.type === FilterType.select) {
                      const selectOptions = (e as any).selectOptions as {
                        key: string;
                        value: string;
                      }[];

                      return (
                        <Card key={index}>
                          <CardTitle>{e.title}</CardTitle>
                          <CardBody isFilled>
                            {selectOptions.map((option, index) => {
                              return (
                                <Radio
                                  key={index}
                                  id={`${e.key}-${option.value}`}
                                  name={e.key}
                                  label={option.value}
                                  isChecked={filter.filterValues[
                                    e.key
                                  ]?.includes(option.key)}
                                  onChange={(_, checked) => {
                                    filterAdvisories.setFilterValues({
                                      ...filterAdvisories.filterValues,
                                      [e.key]: [option.key],
                                    });
                                  }}
                                />
                              );
                            })}
                            <Radio
                              id={`${e.key}-any`}
                              name={e.key}
                              label="Any"
                              isChecked={
                                !(filterAdvisories as any).filterValues[
                                  e.key
                                ] ||
                                (filterAdvisories as any).filterValues[e.key]
                                  ?.length === 0
                              }
                              onChange={(_, checked) => {
                                filterAdvisories.setFilterValues({
                                  ...filterAdvisories.filterValues,
                                  [e.key]: [],
                                });
                              }}
                            />
                          </CardBody>
                        </Card>
                      );
                    }
                    if (e.type === FilterType.multiselect) {
                      const selectOptions = (e as any).selectOptions as {
                        key: string;
                        value: string;
                      }[];

                      return (
                        <Card>
                          <CardTitle>{e.title}</CardTitle>
                          <CardBody>
                            {selectOptions.map((option, index) => (
                              <Checkbox
                                key={index}
                                id={`${e.key}-${option.value}`}
                                name={`${e.key}-${option.value}`}
                                label={option.value}
                                isChecked={(
                                  filterAdvisories as any
                                ).filterValues[e.key]?.includes(option.key)}
                                onChange={(_, checked) => {
                                  const prev = new Set(
                                    (filterAdvisories as any).filterValues[
                                      e.key
                                    ] || []
                                  );

                                  if (checked) {
                                    prev.add(option.key);
                                  } else {
                                    prev.delete(option.key);
                                  }

                                  filterAdvisories.setFilterValues({
                                    ...filterAdvisories.filterValues,
                                    [e.key]: Array.from(prev),
                                  });
                                }}
                              />
                            ))}
                          </CardBody>
                        </Card>
                      );
                    }
                    return null;
                  })}
              </CardBody>
            </Card>
          </GridItem>
          <GridItem
            md={9}
            style={{
              backgroundColor: "var(--pf-v5-global--BackgroundColor--100)",
            }}
          >
            <Tabs
              unmountOnExit
              activeKey={activeTabKey}
              onSelect={(_, eventKey) => setActiveTabKey(eventKey)}
            >
              <Tab
                eventKey={0}
                title={<TabTitleText>CVEs</TabTitleText>}
                actions={
                  <>
                    <TabAction>
                      <Badge isRead>{totalCves}</Badge>
                    </TabAction>
                  </>
                }
              >
                <ToolbarCves>
                  <ToolbarContent>
                    <PaginationToolbarItemCves>
                      <PaginationCves
                        variant="top"
                        isCompact
                        widgetId="cve-pagination-top"
                      />
                    </PaginationToolbarItemCves>
                  </ToolbarContent>
                </ToolbarCves>

                <TableCves aria-label="CVE details table">
                  <TheadCves>
                    <TrCves isHeaderRow>
                      <ThCves columnKey="id" />
                      <ThCves columnKey="description" />
                      <ThCves columnKey="cvss" />
                      <ThCves columnKey="datePublished" />
                      <ThCves columnKey="relatedDocuments" />
                    </TrCves>
                  </TheadCves>
                  <ConditionalTableBody
                    isLoading={isFetchingCves}
                    isError={!!fetchErrorCves}
                    isNoData={totalCves === 0}
                    numRenderedColumns={numRenderedColumnsCves}
                  >
                    <TbodyCves>
                      {currentPageItemsCves?.map((item, rowIndex) => {
                        return (
                          <TrCves
                            key={item.document.document.id}
                            item={item}
                            rowIndex={rowIndex}
                          >
                            <TdCves width={15} columnKey="id">
                              <NavLink
                                to={`/cves/${item.document.document.id}`}
                              >
                                {item.document.document.id}
                              </NavLink>
                            </TdCves>
                            <TdCves
                              width={50}
                              modifier="truncate"
                              columnKey="description"
                            >
                              {item.document.document.title ||
                                item.document.document.descriptions}
                            </TdCves>
                            <TdCves width={15} columnKey="cvss">
                              {item.document.document.cvss3x_score !== null &&
                                item.document.document.cvss3x_score !==
                                  undefined && (
                                  <SeverityRenderer
                                    variant="progress"
                                    score={item.document.document.cvss3x_score}
                                  />
                                )}
                            </TdCves>
                            <TdCves
                              width={10}
                              modifier="truncate"
                              columnKey="datePublished"
                            >
                              {dayjs(
                                item.document.document.date_published
                              ).format(RENDER_DATE_FORMAT)}
                            </TdCves>
                            <TdCves width={10} columnKey="relatedDocuments">
                              {item.document.related_products}
                            </TdCves>
                          </TrCves>
                        );
                      })}
                    </TbodyCves>
                  </ConditionalTableBody>
                </TableCves>
                <PaginationCves
                  variant="bottom"
                  isCompact
                  widgetId="cve-pagination-bottom"
                />
              </Tab>
              <Tab
                eventKey={1}
                title={<TabTitleText>Packages</TabTitleText>}
                actions={
                  <>
                    <TabAction>
                      <Badge isRead>{totalPackages}</Badge>
                    </TabAction>
                  </>
                }
              >
                <ToolbarPackages>
                  <ToolbarContent>
                    <PaginationToolbarItemPackages>
                      <PaginationPackages
                        variant="top"
                        isCompact
                        widgetId="packages-pagination-top"
                      />
                    </PaginationToolbarItemPackages>
                  </ToolbarContent>
                </ToolbarPackages>

                <TablePackages aria-label="Packages details table">
                  <TheadPackages>
                    <TrPackages isHeaderRow>
                      <ThPackages columnKey="name" />
                      <ThPackages columnKey="namespace" />
                      <ThPackages columnKey="version" />
                      <ThPackages columnKey="type" />
                      <ThPackages columnKey="path" />
                      <ThPackages columnKey="qualifiers" />
                      <ThPackages columnKey="vulnerabilities" />
                    </TrPackages>
                  </TheadPackages>
                  <ConditionalTableBody
                    isLoading={isFetchingPackages}
                    isError={!!fetchErrorPackages}
                    isNoData={totalPackages === 0}
                    numRenderedColumns={numRenderedColumnsPackages}
                  >
                    <TbodyPackages>
                      {currentPageItemsPackages?.map((item, rowIndex) => {
                        return (
                          <TrPackages
                            key={item.purl}
                            item={item}
                            rowIndex={rowIndex}
                          >
                            <TdPackages width={25} columnKey="name">
                              <NavLink
                                to={`/packages/${encodeURIComponent(item.purl)}`}
                              >
                                {item.package?.name}
                              </NavLink>
                            </TdPackages>
                            <TdPackages
                              width={10}
                              modifier="truncate"
                              columnKey="namespace"
                            >
                              {item.package?.namespace}
                            </TdPackages>
                            <TdPackages width={15} columnKey="version">
                              {item.package?.version}
                            </TdPackages>
                            <TdPackages
                              width={10}
                              modifier="truncate"
                              columnKey="type"
                            >
                              {item.package?.type}
                            </TdPackages>
                            <TdPackages
                              width={10}
                              modifier="truncate"
                              columnKey="path"
                            >
                              {item.package?.subpath}
                            </TdPackages>
                            <TdPackages width={20} columnKey="qualifiers">
                              {Object.entries(
                                item.package?.qualifiers || {}
                              ).map(([k, v], index) => (
                                <Label
                                  key={index}
                                  isCompact
                                >{`${k}=${v}`}</Label>
                              ))}
                            </TdPackages>
                            <TdPackages width={10} columnKey="vulnerabilities">
                              N/A
                            </TdPackages>
                          </TrPackages>
                        );
                      })}
                    </TbodyPackages>
                  </ConditionalTableBody>
                </TablePackages>
                <PaginationPackages
                  variant="bottom"
                  isCompact
                  widgetId="packages-pagination-bottom"
                />
              </Tab>
              <Tab
                eventKey={2}
                title={<TabTitleText>Products and containers</TabTitleText>}
              >
                <ToolbarSboms>
                  <ToolbarContent>
                    <PaginationToolbarItemSboms>
                      <PaginationSboms
                        variant="top"
                        isCompact
                        widgetId="sboms-pagination-top"
                      />
                    </PaginationToolbarItemSboms>
                  </ToolbarContent>
                </ToolbarSboms>

                <TableSboms aria-label="Sboms details table">
                  <TheadSboms>
                    <TrSboms isHeaderRow>
                      <ThSboms columnKey="name" />
                      <ThSboms columnKey="version" />
                      <ThSboms columnKey="supplier" />
                      <ThSboms columnKey="createdOn" />
                      <ThSboms columnKey="dependencies" />
                      <ThSboms columnKey="productAdvisories" />
                      <ThSboms columnKey="download" />
                    </TrSboms>
                  </TheadSboms>
                  <ConditionalTableBody
                    isLoading={isFetchingSboms}
                    isError={!!fetchErrorSboms}
                    isNoData={totalSboms === 0}
                    numRenderedColumns={numRenderedColumnsSboms}
                  >
                    <TbodySboms>
                      {currentPageItemsSboms?.map((item, rowIndex) => {
                        return (
                          <TrSboms
                            key={item.id}
                            item={item}
                            rowIndex={rowIndex}
                          >
                            <TdSboms width={20} columnKey="name">
                              <NavLink to={`/sboms/${item.id}`}>
                                {item.name}
                              </NavLink>
                            </TdSboms>
                            <TdSboms
                              width={15}
                              modifier="truncate"
                              columnKey="version"
                            >
                              {item.version}
                            </TdSboms>
                            <TdSboms width={20} columnKey="supplier">
                              {item.supplier}
                            </TdSboms>
                            <TdSboms
                              width={15}
                              modifier="truncate"
                              columnKey="createdOn"
                            >
                              {dayjs(item.created as any).format(
                                RENDER_DATE_FORMAT
                              )}
                            </TdSboms>
                            <TdSboms width={10} columnKey="dependencies">
                              {item.dependencies}
                            </TdSboms>
                            <TdSboms width={10} columnKey="productAdvisories">
                              {item.advisories}
                            </TdSboms>
                            <TdSboms width={10} columnKey="download"></TdSboms>
                          </TrSboms>
                        );
                      })}
                    </TbodySboms>
                  </ConditionalTableBody>
                </TableSboms>
                <PaginationSboms
                  variant="bottom"
                  isCompact
                  widgetId="sboms-pagination-bottom"
                />
              </Tab>
              <Tab
                eventKey={3}
                title={<TabTitleText>Advisories</TabTitleText>}
                actions={
                  <>
                    <TabAction>
                      <Badge isRead>{totalAdvisories}</Badge>
                    </TabAction>
                  </>
                }
              >
                <ToolbarAdvisories>
                  <ToolbarContent>
                    <PaginationToolbarItemAdvisories>
                      <PaginationAdvisories
                        variant="top"
                        isCompact
                        widgetId="advisories-pagination-top"
                      />
                    </PaginationToolbarItemAdvisories>
                  </ToolbarContent>
                </ToolbarAdvisories>
                <TableAdvisories aria-label="Advisory details table">
                  <TheadAdvisories>
                    <TrAdvisories isHeaderRow>
                      <ThAdvisories columnKey="id" />
                      <ThAdvisories columnKey="title" />
                      <ThAdvisories columnKey="severity" />
                      <ThAdvisories columnKey="revision" />
                      <ThAdvisories columnKey="vulnerabilities" />
                      <ThAdvisories columnKey="download" />
                    </TrAdvisories>
                  </TheadAdvisories>
                  <ConditionalTableBody
                    isLoading={isFetchingAdvisories}
                    isError={!!fetchErrorAdvisories}
                    isNoData={totalAdvisories === 0}
                    numRenderedColumns={numRenderedColumnsAdvisories}
                  >
                    {currentPageItemsAdvisories?.map((item, rowIndex) => {
                      return (
                        <TbodyAdvisories key={item.id}>
                          <TrAdvisories item={item} rowIndex={rowIndex}>
                            <TdAdvisories width={15} columnKey="id">
                              <NavLink to={`/advisories/${item.id}`}>
                                {item.id}
                              </NavLink>
                            </TdAdvisories>
                            <TdAdvisories
                              width={45}
                              modifier="truncate"
                              columnKey="title"
                            >
                              {item.title}
                            </TdAdvisories>
                            <TdAdvisories width={10} columnKey="severity">
                              <RHSeverityShield value={item.severity} />
                            </TdAdvisories>
                            <TdAdvisories
                              width={10}
                              modifier="truncate"
                              columnKey="revision"
                            >
                              {formatRustDate(item.date)}
                            </TdAdvisories>
                            <TdAdvisories
                              width={10}
                              columnKey="vulnerabilities"
                            >
                              {item.cves.length === 0 ? (
                                "N/A"
                              ) : (
                                <VulnerabilitiesCount
                                  severities={item.cve_severity_count}
                                />
                              )}
                            </TdAdvisories>
                            <TdAdvisories width={10} columnKey="download">
                              <Button
                                variant="plain"
                                aria-label="Download"
                                onClick={() => {
                                  downloadAdvisory(item.id);
                                }}
                              >
                                <DownloadIcon />
                              </Button>
                            </TdAdvisories>
                          </TrAdvisories>
                          {isCellExpandedAdvisories(item) ? (
                            <PFTr isExpanded>
                              <PFTd colSpan={7}>
                                <ExpandableRowContent>
                                  <AdvisoryDetails id={item.id} />
                                </ExpandableRowContent>
                              </PFTd>
                            </PFTr>
                          ) : null}
                        </TbodyAdvisories>
                      );
                    })}
                  </ConditionalTableBody>
                </TableAdvisories>
                <PaginationAdvisories
                  variant="bottom"
                  isCompact
                  widgetId="advisories-pagination-bottom"
                />
              </Tab>
            </Tabs>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};
