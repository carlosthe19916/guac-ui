import { gql, request } from "graphql-request";

import { Package, PackageVersion, Vulnerability } from "./models";

const HUB = "/hub/query";

interface ApiSearchResult<T> {
  total: number;
  data: T[];
}

export const getPackages = () => {
  const document = gql`
    {
      packages(pkgSpec: {}) {
        id
        type
        namespaces {
          id
          names {
            id
            name
            versions {
              id
              purl
              version
              qualifiers {
                key
                value
              }
              subpath
            }
          }
        }
      }
    }
  `;
  return request<{ packages: Package[] }>(HUB, document).then(
    ({ packages }) => packages
  );
};

export const getPackageById = (id: string) => {
  const document = gql`
    {
      packages(pkgSpec: {}) {
        id
        type
      }
    }
  `;
  return request<{ data: { packages: PackageVersion[] } }>(HUB, document).then(
    ({ data }) => data.packages[0]
  );
};

// Vulnerabilities

export const getVulnerabilities = () => {
  const document = gql`
    {
      vulnerabilities(vulnSpec: {}) {
        id
        type
        vulnerabilityIDs {
          id
          vulnerabilityID
        }
      }
    }
  `;
  return request<{ vulnerabilities: Vulnerability[] }>(HUB, document).then(
    ({ vulnerabilities }) => vulnerabilities
  );
};
