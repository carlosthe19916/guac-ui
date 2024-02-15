import React, { useMemo } from "react";
import { Link } from "react-router-dom";

import { CodeEditor, Language } from "@patternfly/react-code-editor";
import {
  Breadcrumb,
  BreadcrumbItem,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
  PageSection,
  Stack,
  StackItem,
} from "@patternfly/react-core";

import DetailsPage from "@patternfly/react-component-groups/dist/dynamic/DetailsPage";
import DownloadIcon from "@patternfly/react-icons/dist/esm/icons/download-icon";

import { RENDER_DATE_FORMAT } from "@app/Constants";
import { PathParam, useRouteParams } from "@app/Routes";
import { SbomType } from "@app/api/models";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { useDownload } from "@app/hooks/csaf/download-advisory";
import {
  useFetchSbomById,
  useFetchSbomIndexedById,
  useFetchSbomVulnerabilitiesById,
} from "@app/queries/sboms";
import dayjs from "dayjs";
import { DAReport } from "./da-report";
import { Info } from "./info";
import { Packages } from "./packages";
import { VulnerabilitiresChart } from "./vulnerabilities-chart";
import { VulnerabilitiresTable } from "./vulnerabilities-table";

export const SbomDetails: React.FC = () => {
  const sbomId = useRouteParams(PathParam.SBOM_ID);

  const {
    sbom,
    isFetching: isFetchingSbom,
    fetchError: fetchErrorSbom,
  } = useFetchSbomById(sbomId);

  const {
    sbom: sbomIndexed,
    isFetching: isFetchingSbomIndexed,
    fetchError: fetchErrorSbomIndexed,
  } = useFetchSbomIndexedById(sbomId);

  const {
    vulnerabilities: sbomVulnerabilities,
    isFetching: isFetchingSbomVulnerabilities,
    fetchError: fetchErrorSbomVulnerabilities,
  } = useFetchSbomVulnerabilitiesById(sbomId);

  const sbomString = useMemo(() => {
    return JSON.stringify(sbom?.sbom, null, 2);
  }, [sbom]);

  const { downloadSbom } = useDownload();

  let vulnerabilities = useMemo(() => {
    return sbomVulnerabilities && sbomVulnerabilities.summary.length === 1
      ? (sbomVulnerabilities.summary[0].reduce((prev: any, current: any) => {
          return typeof current === "string" ? prev : current;
        }, []) as { severity?: string; count: number }[])
      : [];
  }, [sbomVulnerabilities]);

  return (
    <>
      <PageSection variant="light">
        <DetailsPage
          breadcrumbs={
            <Breadcrumb>
              <BreadcrumbItem key="advisories">
                <Link to="/sboms">SBOMs</Link>
              </BreadcrumbItem>
              <BreadcrumbItem to="#" isActive>
                SBOM details
              </BreadcrumbItem>
            </Breadcrumb>
          }
          pageHeading={{
            title: sbomIndexed?.name ?? sbomId ?? "",
            label: {
              children:
                sbom?.type === SbomType.SPDX
                  ? "SPDX"
                  : sbom?.type === SbomType.CycloneDx
                    ? "CycloneDX"
                    : "",
              isCompact: true,
              color: "blue",
            },
          }}
          actionButtons={[
            {
              children: (
                <>
                  <DownloadIcon /> Download
                </>
              ),
              onClick: () => {
                if (sbomId) {
                  downloadSbom(sbomId);
                }
              },
              variant: "secondary",
            },
          ]}
          tabs={[
            {
              eventKey: "overview",
              title: "Overview",
              children: (
                <div className="pf-v5-u-m-md">
                  <Stack hasGutter>
                    <StackItem>
                      <PageSection hasShadowBottom>
                        <Grid>
                          <GridItem md={6}>
                            <LoadingWrapper
                              isFetching={isFetchingSbomVulnerabilities}
                              fetchError={fetchErrorSbomVulnerabilities}
                            >
                              <VulnerabilitiresChart
                                data={vulnerabilities || []}
                              />
                            </LoadingWrapper>
                          </GridItem>
                          <GridItem md={6}>
                            <LoadingWrapper
                              isFetching={isFetchingSbomIndexed}
                              fetchError={fetchErrorSbomIndexed}
                            >
                              <DescriptionList>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>
                                    Name
                                  </DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {sbomIndexed?.name}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>
                                    Version
                                  </DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {sbomIndexed?.version}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>
                                    Created
                                  </DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {sbomIndexed &&
                                      dayjs(sbomIndexed.created as any).format(
                                        RENDER_DATE_FORMAT
                                      )}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                              </DescriptionList>
                            </LoadingWrapper>
                          </GridItem>
                        </Grid>
                      </PageSection>
                    </StackItem>
                    <StackItem>
                      <LoadingWrapper
                        isFetching={isFetchingSbomVulnerabilities}
                        fetchError={fetchErrorSbomVulnerabilities}
                      >
                        <VulnerabilitiresTable
                          isFetching={isFetchingSbomVulnerabilities}
                          fetchError={fetchErrorSbomVulnerabilities}
                          sbomVulnerabilitires={sbomVulnerabilities}
                        />
                      </LoadingWrapper>
                    </StackItem>
                  </Stack>
                </div>
              ),
            },
            {
              eventKey: "info",
              title: "Info",
              children: (
                <div className="pf-v5-u-m-md">
                  <LoadingWrapper
                    isFetching={isFetchingSbom}
                    fetchError={fetchErrorSbom}
                  >
                    {sbom && <Info data={sbom} />}
                  </LoadingWrapper>
                </div>
              ),
            },
            {
              eventKey: "packages",
              title: "Packages",
              children: (
                <div className="pf-v5-u-m-md">
                  <LoadingWrapper
                    isFetching={isFetchingSbom}
                    fetchError={fetchErrorSbom}
                  >
                    {sbom && <Packages data={sbom} />}
                  </LoadingWrapper>
                </div>
              ),
            },
            {
              eventKey: "source",
              title: "Source",
              children: (
                <div className="pf-v5-u-m-md">
                  <LoadingWrapper
                    isFetching={isFetchingSbom}
                    fetchError={fetchErrorSbom}
                  >
                    <CodeEditor
                      isDarkTheme
                      isLineNumbersVisible
                      isReadOnly
                      isMinimapVisible
                      // isLanguageLabelVisible
                      code={sbomString}
                      language={Language.json}
                      height="685px"
                    />
                  </LoadingWrapper>
                </div>
              ),
            },
            {
              eventKey: "crda",
              title: "CRDA",
              children: (
                <div className="pf-v5-u-m-md">
                  <LoadingWrapper
                    isFetching={isFetchingSbom}
                    fetchError={fetchErrorSbom}
                  >
                    {sbom && <DAReport sbom={sbomString} />}
                  </LoadingWrapper>
                </div>
              ),
            },
          ]}
        />
      </PageSection>
    </>
  );
};
