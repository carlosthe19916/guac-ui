import React, { Suspense, lazy } from "react";
import { useParams, useRoutes } from "react-router-dom";

import { Bullseye, Spinner } from "@patternfly/react-core";

const Home = lazy(() => import("./pages/home"));
const Search = lazy(() => import("./pages/search"));
const AdvisoryList = lazy(() => import("./pages/advisory-list"));
const AdvisoryDetails = lazy(() => import("./pages/advisory-details"));
const CveList = lazy(() => import("./pages/cve-list"));
const CveDetails = lazy(() => import("./pages/cve-details"));
const SbomList = lazy(() => import("./pages/sbom-list"));
const SbomDetails = lazy(() => import("./pages/sbom-details"));
const PackageList = lazy(() => import("./pages/package-list"));
const PackageDetails = lazy(() => import("./pages/package-details"));

export enum PathParam {
  ADVISORY_ID = "advisoryId",
  CVE_ID = "cveId",
  SBOM_ID = "sbomId",
  PACKAGE_ID = "packageId",
}

export const AppRoutes = () => {
  const allRoutes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/search", element: <Search /> },

    { path: "/advisories", element: <AdvisoryList /> },
    {
      path: `/advisories/:${PathParam.ADVISORY_ID}`,
      element: <AdvisoryDetails />,
    },
    { path: "/cves", element: <CveList /> },
    { path: `/cves/:${PathParam.CVE_ID}`, element: <CveDetails /> },
    { path: "/sboms", element: <SbomList /> },
    { path: `/sboms/:${PathParam.SBOM_ID}`, element: <SbomDetails /> },
    { path: "/packages", element: <PackageList /> },
    { path: `/packages/:${PathParam.PACKAGE_ID}`, element: <PackageDetails /> },

    // { path: "*", element: <Navigate to="/organizations" /> },
  ]);

  return (
    <Suspense
      fallback={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
    >
      {allRoutes}
    </Suspense>
  );
};

export const useRouteParams = (pathParam: PathParam) => {
  let params = useParams();
  return params[pathParam];
};
