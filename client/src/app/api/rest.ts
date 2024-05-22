import { gql, request, Variables } from "graphql-request";

import { Package, PackageVersion, Vulnerability } from "./models";

const HUB = "/hub/query";

interface ApiSearchResult<T> {
  total: number;
  data: T[];
}

export const getPackages = () => {
  const document = gql`
    query getPackages {
      packages(pkgSpec: {}) {
        id
        type
        namespaces {
          id
          namespace
          names {
            id
            name
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

export const getPackageVersions = (variables: Variables) => {
  const document = gql`
    query getPackages($name: String, $namespace: String, $type: String) {
      packages(pkgSpec: { name: $name, namespace: $namespace, type: $type }) {
        namespaces {
          names {
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
  return request<{ packages: Package[] }>(HUB, document, variables).then(
    ({ packages }) =>
      packages
        .flatMap((pkg) => pkg.namespaces)
        .flatMap((namespace) => namespace.names)
        .flatMap((packageName) => packageName.versions || [])
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
