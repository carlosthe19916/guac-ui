export type WithUiId<T> = T & { _ui_unique_id: string };

export enum MimeType {
  TAR = "tar",
  YAML = "yaml",
}

/** Mark an object as "New" therefore does not have an `id` field. */
export type New<T extends { id: number }> = Omit<T, "id">;

export interface HubFilter {
  field: string;
  operator?: "=" | "!=" | "~" | ">" | ">=" | "<" | "<=";
  value:
    | string
    | number
    | {
        list: (string | number)[];
        operator?: "AND" | "OR";
      };
}

export interface HubRequestParams {
  filters?: HubFilter[];
  sort?: {
    field: string;
    direction: "asc" | "desc";
  };
  page?: {
    pageNumber: number; // 1-indexed
    itemsPerPage: number;
  };
}

export interface HubPaginatedResult<T> {
  data: T[];
  total: number;
  params: HubRequestParams;
}

// Packages

export interface Package {
  id: string;
  type: string;
  namespaces: PackageNamespace[];
}

export interface PackageNamespace {
  id: string;
  names: PackageName[];
}

export interface PackageName {
  id: string;
  name: string;
  versions: PackageVersion[];
}

export interface PackageVersion {
  id: string;
  purl: string;
  version: string;
  qualifiers: { key: string; value: string }[];
  subpath: string;
}

// Vulnerabilities

export interface Vulnerability {
  id: string;
  type: string;
  vulnerabilityIDs: VulnerabilityID[];
}

export interface VulnerabilityID {
  id: string;
  vulnerabilityID: string;
}
