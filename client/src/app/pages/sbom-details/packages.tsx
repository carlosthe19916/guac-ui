import React from "react";
import { Sbom, SbomCycloneDx, SbomSPDX, SbomType } from "@app/api/models";
import {
  ConditionalTableBody,
  FilterType,
  useClientTableBatteries,
} from "@mturley-latest/react-table-batteries";
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
  Td as PFTd,
  Tr as PFTr,
} from "@patternfly/react-table";

import { PackageURL } from "packageurl-js";
import { NavLink } from "react-router-dom";

interface PackagesProps {
  data: Sbom;
}

export const Packages: React.FC<PackagesProps> = ({ data }) => {
  switch (data.type) {
    case SbomType.SPDX:
      return <SpxdPackages sbom={data.sbom} />;
    case SbomType.CycloneDx:
      return <CycloneDxPackages sbom={data.sbom} />;
    default:
      return <>Not supported SBOM format</>;
  }
};

interface SpxdPackagesProps {
  sbom: SbomSPDX;
}

export const SpxdPackages: React.FC<SpxdPackagesProps> = ({ sbom }) => {
  const pageItems = React.useMemo(() => {
    return sbom.packages.map((e) => {
      let packageUrl;
      try {
        packageUrl = PackageURL.fromString(
          (e.externalRefs || [])[0].referenceLocator
        );
      } catch (e) {}
      return {
        ...e,
        id: `${e.name}_${e.versionInfo}`,
        package: packageUrl,
      };
    });
  }, [sbom]);

  const tableControls = useClientTableBatteries({
    persistTo: "state",
    idProperty: "id",
    items: pageItems || [],
    isLoading: false,
    columnNames: {
      name: "Name",
      version: "Version",
      qualifiers: "Qualifiers",
    },
    filter: {
      isEnabled: true,
      filterCategories: [
        {
          key: "cve",
          title: "ID",
          type: FilterType.search,
          placeholderText: "Search...",
          getItemValue: (item) =>
            item.package
              ? `${item.package.name} ${item.package.namespace}`
              : item.name,
        },
      ],
    },
    sort: {
      isEnabled: true,
      sortableColumns: [],
    },
    expansion: {
      isEnabled: true,
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
    expansion: { isCellExpanded },
  } = tableControls;

  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <FilterToolbar id="packages-toolbar" />
          <PaginationToolbarItem>
            <Pagination
              variant="top"
              isCompact
              widgetId="packages-pagination-top"
            />
          </PaginationToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="Packages table" className="vertical-aligned-table">
        <Thead>
          <Tr isHeaderRow>
            <Th columnKey="name" />
            <Th columnKey="version" />
            <Th columnKey="qualifiers" />
          </Tr>
        </Thead>
        <ConditionalTableBody
          isNoData={pageItems?.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            let packageUrl = item.externalRefs
              ?.filter((e) => e.referenceLocator)
              .map((e) => {
                let packageUrl;
                try {
                  packageUrl = PackageURL.fromString(e.referenceLocator);
                } catch (e) {}
                return packageUrl;
              })
              .find((e) => e);

            return (
              <Tbody key={item.id}>
                <Tr item={item} rowIndex={rowIndex}>
                  <Td width={50} modifier="truncate" columnKey="name">
                    {item.package ? (
                      <>
                        {`${item.package.name}/${item.package.namespace}`}{" "}
                        <Label color="blue">{item.package.type}</Label>
                      </>
                    ) : (
                      item.name
                    )}
                  </Td>
                  <Td width={20} modifier="truncate" columnKey="version">
                    {item.versionInfo}
                  </Td>
                  <Td width={30} columnKey="qualifiers">
                    {item.package &&
                      Object.entries(item.package?.qualifiers || {}).map(
                        ([k, v], index) => (
                          <Label key={index} isCompact>{`${k}=${v}`}</Label>
                        )
                      )}
                  </Td>
                </Tr>
                {isCellExpanded(item) ? (
                  <PFTr isExpanded>
                    <PFTd colSpan={7}>
                      <div className="pf-v5-u-m-md">
                        <ExpandableRowContent>
                          <DescriptionList isCompact isAutoFit>
                            <DescriptionListGroup>
                              <DescriptionListTerm>
                                Packages
                              </DescriptionListTerm>
                              <DescriptionListDescription>
                                <List>
                                  {item.externalRefs
                                    ?.map((e) => e.referenceLocator)
                                    .map((e, index) => (
                                      <ListItem key={index}>
                                        <NavLink to={`/packages/${encodeURIComponent(e)}`}>
                                          {e}
                                        </NavLink>
                                      </ListItem>
                                    ))}
                                </List>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>
                                Qualifiers
                              </DescriptionListTerm>
                              <DescriptionListDescription>
                                {packageUrl &&
                                  Object.entries(
                                    packageUrl?.qualifiers || {}
                                  ).map(([k, v], index) => (
                                    <Label
                                      key={index}
                                      isCompact
                                    >{`${k}=${v}`}</Label>
                                  ))}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>
                                Versions
                              </DescriptionListTerm>
                              <DescriptionListDescription>
                                {packageUrl && packageUrl.version}
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
        widgetId="vulnerabilities-pagination-bottom"
      />
    </>
  );
};

interface CycloneDxPackagesProps {
  sbom: SbomCycloneDx;
}

export const CycloneDxPackages: React.FC<CycloneDxPackagesProps> = ({
  sbom,
}) => {
  const pageItems = React.useMemo(() => {
    return sbom.components.map((e) => {
      let packageUrl;
      try {
        if (e.purl) {
          packageUrl = PackageURL.fromString(e.purl);
        }
      } catch (e) {}
      return {
        ...e,
        package: packageUrl,
      };
    });
  }, [sbom]);

  const tableControls = useClientTableBatteries({
    persistTo: "state",
    idProperty: "purl",
    items: pageItems || [],
    isLoading: false,
    columnNames: {
      name: "Name",
      version: "Version",
      qualifiers: "Qualifiers",
    },
    filter: {
      isEnabled: true,
      filterCategories: [
        {
          key: "cve",
          title: "ID",
          type: FilterType.search,
          placeholderText: "Search...",
          getItemValue: (item) =>
            item.package
              ? `${item.package.name} ${item.package.namespace}`
              : item.name,
        },
      ],
    },
    sort: {
      isEnabled: true,
      sortableColumns: [],
    },
    expansion: {
      isEnabled: true,
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
      <Toolbar>
        <ToolbarContent>
          <FilterToolbar id="packages-toolbar" />
          <PaginationToolbarItem>
            <Pagination
              variant="top"
              isCompact
              widgetId="packages-pagination-top"
            />
          </PaginationToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="Packages table" className="vertical-aligned-table">
        <Thead>
          <Tr isHeaderRow>
            <Th columnKey="name" />
            <Th columnKey="version" />
            <Th columnKey="qualifiers" />
          </Tr>
        </Thead>
        <ConditionalTableBody
          isNoData={pageItems?.length === 0}
          numRenderedColumns={numRenderedColumns}
        >
          {currentPageItems?.map((item, rowIndex) => {
            return (
              <Tbody key={item.purl}>
                <Tr item={item} rowIndex={rowIndex}>
                  <Td width={50} modifier="truncate" columnKey="name">
                    {item.package ? (
                      <>
                        {`${item.package.name}/${item.package.namespace}`}{" "}
                        <Label color="blue">{item.package.type}</Label>
                      </>
                    ) : (
                      item.name
                    )}
                  </Td>
                  <Td width={20} modifier="truncate" columnKey="version">
                    {item.version}
                  </Td>
                  <Td width={30} columnKey="qualifiers">
                    {item.package &&
                      Object.entries(item.package?.qualifiers || {}).map(
                        ([k, v], index) => (
                          <Label key={index} isCompact>{`${k}=${v}`}</Label>
                        )
                      )}
                  </Td>
                </Tr>
                {isCellExpanded(item) ? (
                  <PFTr isExpanded>
                    <PFTd colSpan={7}>
                      <div className="pf-v5-u-m-md">
                        <ExpandableRowContent>
                          <DescriptionList isCompact isAutoFit>
                            <DescriptionListGroup>
                              <DescriptionListTerm>
                                Licenses
                              </DescriptionListTerm>
                              <DescriptionListDescription>
                                <List>
                                  {item.licenses
                                    ?.map((e) => e.license.id)
                                    .map((e, index) => (
                                      <ListItem key={index}>{e}</ListItem>
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
        widgetId="vulnerabilities-pagination-bottom"
      />
    </>
  );
};
