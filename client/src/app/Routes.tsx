import React, { Suspense, lazy } from "react";
import { useParams, useRoutes } from "react-router-dom";

import { Bullseye, Spinner } from "@patternfly/react-core";

const Home = lazy(() => import("./pages/home"));

const PackageList = lazy(() => import("./pages/package-list"));
const PackageDetails = lazy(() => import("./pages/package-details"));

const VulnerabilityList = lazy(() => import("./pages/vulnerability-list"));
const VulnerabilityDetails = lazy(
  () => import("./pages/vulnerability-details")
);

export enum PathParam {
  PACKAGE_ID = "packageId",
  VULNERABILITY_ID = "vulnerabilityId",
}

export const AppRoutes = () => {
  const allRoutes = useRoutes([
    { path: "/", element: <Home /> },

    { path: "/packages", element: <PackageList /> },
    { path: `/packages/:${PathParam.PACKAGE_ID}`, element: <PackageDetails /> },

    { path: "/vulnerabilities", element: <VulnerabilityList /> },
    {
      path: `/vulnerabilities/:${PathParam.VULNERABILITY_ID}`,
      element: <VulnerabilityDetails />,
    },
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
  const params = useParams();
  return params[pathParam];
};
