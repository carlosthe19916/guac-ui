import React, { useMemo } from "react";
import { Link } from "react-router-dom";

import { CodeEditor, Language } from "@patternfly/react-code-editor";
import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection
} from "@patternfly/react-core";

import DetailsPage from "@patternfly/react-component-groups/dist/dynamic/DetailsPage";
import DownloadIcon from "@patternfly/react-icons/dist/esm/icons/download-icon";

import { PathParam, useRouteParams } from "@app/Routes";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { NotesMarkdown } from "@app/components/csaf/notes-markdown";
import { RHSeverityShield } from "@app/components/csaf/rh-severity";
import { useDownload } from "@app/hooks/csaf/download-advisory";
import { useFetchAdvisoryById } from "@app/queries/advisories";

import { Overview } from "./overview";
import { Vulnerabilities } from "./vulnerabilities";

export const AdvisoryDetails: React.FC = () => {
  const advisoryId = useRouteParams(PathParam.ADVISORY_ID);
  const { advisory, isFetching, fetchError } = useFetchAdvisoryById(advisoryId);

  const advisoryString = useMemo(() => {
    return JSON.stringify(advisory, null, 2);
  }, [advisory]);

  const { downloadAdvisory } = useDownload();

  return (
    <>
      <PageSection variant="light">
        <DetailsPage
          breadcrumbs={
            <Breadcrumb>
              <BreadcrumbItem key="advisories">
                <Link to="/advisories">Advisories</Link>
              </BreadcrumbItem>
              <BreadcrumbItem to="#" isActive>
                Advisory details
              </BreadcrumbItem>
            </Breadcrumb>
          }
          pageHeading={{
            title: advisoryId ?? "",
            label: {
              children: advisory ? (
                <RHSeverityShield
                  value={advisory.document.aggregate_severity.text}
                />
              ) : null,
              isCompact: true,
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
                if (advisoryId) {
                  downloadAdvisory(advisoryId);
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
                  <LoadingWrapper
                    isFetching={isFetching}
                    fetchError={fetchError}
                  >
                    {advisory && <Overview advisory={advisory} />}
                  </LoadingWrapper>
                </div>
              ),
            },
            {
              eventKey: "notes",
              title: "Notes",
              children: (
                <div className="pf-v5-u-m-md">
                  <LoadingWrapper
                    isFetching={isFetching}
                    fetchError={fetchError}
                  >
                    <NotesMarkdown notes={advisory?.document.notes || []} />
                  </LoadingWrapper>
                </div>
              ),
            },
            {
              eventKey: "vulnerabilities",
              title: "Vulnerabilities",
              children: (
                <div className="pf-v5-u-m-md">
                  <LoadingWrapper
                    isFetching={isFetching}
                    fetchError={fetchError}
                  >
                    <Vulnerabilities
                      isFetching={isFetching}
                      fetchError={fetchError}
                      vulnerabilities={advisory?.vulnerabilities || []}
                    />
                  </LoadingWrapper>
                </div>
              ),
            },
            {
              eventKey: "source",
              title: "Source",
              children: (
                <div className="pf-v5-u-m-md">
                  <CodeEditor
                    isDarkTheme
                    isLineNumbersVisible
                    isReadOnly
                    isMinimapVisible
                    // isLanguageLabelVisible
                    code={advisoryString}
                    language={Language.json}
                    height="685px"
                  />
                </div>
              ),
            },
          ]}
        />
      </PageSection>
    </>
  );
};
