import React, { useEffect } from "react";

import {
  Badge,
  Card,
  CardBody,
  CardTitle,
  Checkbox,
  Grid,
  GridItem,
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
import { useDebounceValue } from "usehooks-ts";

import { FilterType } from "@mturley-latest/react-table-batteries";

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
  const [filterText, setFilterText] = useDebounceValue("", 500);
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(
    TabIndex.CVEs
  );

  // CVEs
  const {
    tableProps: tablePropsCves,
    total: totalCves,
    table: tableCves,
  } = useCveList();

  const {
    components: {
      Toolbar: ToolbarCves,
      PaginationToolbarItem: PaginationToolbarItemCves,
      Pagination: PaginationCves,
    },
    filter: filterCves,
  } = tablePropsCves;

  // Packages
  const {
    tableProps: tablePropsPackages,
    total: totalPackages,
    table: tablePackages,
  } = usePackageList();

  const {
    components: {
      Toolbar: ToolbarPackages,
      PaginationToolbarItem: PaginationToolbarItemPackages,
      Pagination: PaginationPackages,
    },
    filter: filterPackages,
  } = tablePropsPackages;

  // SBOMs
  const {
    tableProps: tablePropsSboms,
    total: totalSboms,
    table: tableSboms,
  } = useSbomList();

  const {
    components: {
      Toolbar: ToolbarSboms,
      PaginationToolbarItem: PaginationToolbarItemSboms,
      Pagination: PaginationSboms,
    },
    filter: filterSboms,
  } = tablePropsSboms;

  // Advisories
  const {
    tableProps: tablePropsAdvisories,
    total: totalAdvisories,
    table: tableAdvisories,
  } = useAdvisoryList();

  const {
    components: {
      Toolbar: ToolbarAdvisories,
      PaginationToolbarItem: PaginationToolbarItemAdvisories,
      Pagination: PaginationAdvisories,
    },
    filter: filterAdvisories,
  } = tablePropsAdvisories;

  // Filters
  let filter: any = null;
  switch (activeTabKey) {
    case TabIndex.CVEs:
      filter = filterCves;
      break;
    case TabIndex.Packages:
      filter = filterPackages;
      break;
    case TabIndex.SBOMs:
      filter = filterSboms;
      break;
    case TabIndex.Advisories:
      filter = filterAdvisories;
      break;
    default:
      break;
  }

  useEffect(() => {
    filterCves.setFilterValues({
      ...filter.filterValues,
      filterText,
    });
    filterPackages.setFilterValues({
      ...filter.filterValues,
      filterText,
    });
    filterSboms.setFilterValues({
      ...filter.filterValues,
      filterText,
    });
    filterAdvisories.setFilterValues({
      ...filter.filterValues,
      filterText,
    });
  }, [filterText]);

  useEffect(() => {
    console.log(filterCves);
  }, [filterCves]);
  
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
              onChange={(_, val) => {
                setFilterText(val);
              }}
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
                                    filter.setFilterValues({
                                      ...filter.filterValues,
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
                                !(filter as any).filterValues[e.key] ||
                                (filter as any).filterValues[e.key]?.length ===
                                  0
                              }
                              onChange={(_, checked) => {
                                if (checked) {
                                  filter.setFilterValues({
                                    ...filter.filterValues,
                                    [e.key]: undefined,
                                  });
                                }
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
                        <Card key={index}>
                          <CardTitle>{e.title}</CardTitle>
                          <CardBody>
                            {selectOptions.map((option, index) => (
                              <Checkbox
                                key={index}
                                id={`${e.key}-${option.value}`}
                                name={`${e.key}-${option.value}`}
                                label={option.value}
                                isChecked={(filter as any).filterValues[
                                  e.key
                                ]?.includes(option.key)}
                                onChange={(_, checked) => {
                                  const prev = new Set(
                                    (filter as any).filterValues[e.key] || []
                                  );

                                  if (checked) {
                                    prev.add(option.key);
                                  } else {
                                    prev.delete(option.key);
                                  }

                                  filter.setFilterValues({
                                    ...filter.filterValues,
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
              mountOnEnter
              unmountOnExit
              activeKey={activeTabKey}
              onSelect={(_, eventKey) => {
                setActiveTabKey(eventKey);
              }}
            >
              <Tab
                eventKey={TabIndex.CVEs}
                title={<TabTitleText>CVEs</TabTitleText>}
                actions={
                  <>
                    <TabAction style={{ padding: 0 }}>
                      <Badge
                        isRead
                        onClick={() => setActiveTabKey(TabIndex.CVEs)}
                      >
                        {totalCves}
                      </Badge>
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
                {tableCves}
              </Tab>
              <Tab
                eventKey={TabIndex.Packages}
                title={<TabTitleText>Packages</TabTitleText>}
                actions={
                  <>
                    <TabAction style={{ padding: 0 }}>
                      <Badge
                        isRead
                        onClick={() => setActiveTabKey(TabIndex.Packages)}
                      >
                        {totalPackages}
                      </Badge>
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
                {tablePackages}
              </Tab>
              <Tab
                eventKey={TabIndex.SBOMs}
                title={<TabTitleText>Products and containers</TabTitleText>}
                actions={
                  <>
                    <TabAction style={{ padding: 0 }}>
                      <Badge
                        isRead
                        onClick={() => setActiveTabKey(TabIndex.SBOMs)}
                      >
                        {totalSboms}
                      </Badge>
                    </TabAction>
                  </>
                }
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
                {tableSboms}
              </Tab>
              <Tab
                eventKey={TabIndex.Advisories}
                title={<TabTitleText>Advisories</TabTitleText>}
                actions={
                  <>
                    <TabAction style={{ padding: 0 }}>
                      <Badge
                        isRead
                        onClick={() => setActiveTabKey(TabIndex.Advisories)}
                      >
                        {totalAdvisories}
                      </Badge>
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
                {tableAdvisories}
              </Tab>
            </Tabs>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};
