import React, { useMemo } from "react";
import { Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
  Text,
  TextContent,
} from "@patternfly/react-core";

import DetailsPage from "@patternfly/react-component-groups/dist/dynamic/DetailsPage";

import { PathParam, useRouteParams } from "@app/Routes";
import { useFetchPackageById } from "@app/queries/packages";
import { PackageURL } from "packageurl-js";

import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { RelatedProducts } from "./related-products";
import { RelatedVulnerabilities } from "./related-vulnerabilities";

export const PackageDetails: React.FC = () => {
  const packageId = useRouteParams(PathParam.PACKAGE_ID);

  const {
    pkg,
    isFetching: isFetchingSbom,
    fetchError: fetchErrorSbom,
  } = useFetchPackageById(packageId);

  const pkgUrl = useMemo(() => {
    if (pkg) {
      try {
        return PackageURL.fromString(pkg.purl);
      } catch (e) {}
    }
  }, [pkg]);

  let pkgName;
  if (pkgUrl) {
    pkgName =
      pkgUrl.type === "maven"
        ? `${pkgUrl.namespace}:${pkgUrl.name}`
        : `${pkgUrl.namespace}/${pkgUrl.name}`;
  }

  return (
    <>
      <PageSection variant="light">
        <DetailsPage
          breadcrumbs={
            <Breadcrumb>
              <BreadcrumbItem key="packages">
                <Link to="/packages">Packages</Link>
              </BreadcrumbItem>
              <BreadcrumbItem to="#" isActive>
                Package details
              </BreadcrumbItem>
            </Breadcrumb>
          }
          pageHeading={{
            title: pkgName ?? packageId ?? "",
            iconAfterTitle: (
              <TextContent>
                <Text component="pre">{`version: ${pkgUrl?.version}`}</Text>
              </TextContent>
            ),
            label: {
              children: pkgUrl ? `type=${pkgUrl.type}` : "",
              isCompact: true,
            },
          }}
          actionButtons={[]}
          tabs={[
            {
              eventKey: "vulnerabilities",
              title: "Vulnerabilities",
              children: (
                <div className="pf-v5-u-m-md">
                  {pkg && (
                    <RelatedVulnerabilities
                      vulnerabilities={pkg?.vulnerabilities || []}
                    />
                  )}
                </div>
              ),
            },
            {
              eventKey: "products-using-package",
              title: "Products using package",
              children: (
                <div className="pf-v5-u-m-md">
                  <LoadingWrapper
                    isFetching={isFetchingSbom}
                    fetchError={fetchErrorSbom}
                  >
                    {packageId && <RelatedProducts packageId={packageId} />}
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
