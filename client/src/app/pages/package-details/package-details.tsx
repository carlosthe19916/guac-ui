import React from "react";
import { Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
} from "@patternfly/react-core";

import DetailsPage from "@patternfly/react-component-groups/dist/dynamic/DetailsPage";

import { PathParam, useRouteParams } from "@app/Routes";
import { useFetchPackages } from "@app/queries/packages";

export const PackageDetails: React.FC = () => {
  const packageId = useRouteParams(PathParam.PACKAGE_ID);

  const { isFetching, packages, fetchError } = useFetchPackages();

  // const packageVersion = React.useMemo(() => {
  //   return packages
  //     .flatMap((p) => {
  //       return p.namespaces
  //         .flatMap((ns) => ns.names)
  //         .flatMap((packageName) => packageName.versions);
  //     })
  //     .find((e) => e.id === packageId);
  // }, [packages]);

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
            // title: packageVersion?.purl ?? packageId ?? "",
            title: "title",
          }}
          actionButtons={[]}
          tabs={[
            {
              eventKey: "sboms",
              title: "SBOMs",
              children: (
                <div className="pf-v5-u-m-md">SBOMs using current Package</div>
              ),
            },
            {
              eventKey: "vulnerabilities",
              title: "Vulnerabilities",
              children: (
                <div className="pf-v5-u-m-md">
                  Vulnerabilities affecting current package
                </div>
              ),
            },
          ]}
        />
      </PageSection>
    </>
  );
};
