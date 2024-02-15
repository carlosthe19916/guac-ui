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

//

export type RHSeverity = "low" | "moderate" | "important" | "critical";
export enum Severity {
  NONE = "none",
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface AdvisoryIndexed {
  id: string;
  title: string;
  severity: RHSeverity;
  date: number[];
  cves: string[];
  cve_severity_count: { [key in Severity]: number };
}

export interface Advisory {
  product_tree: ProductTree;
  vulnerabilities: Vulnerability[];
  document: AdvisoryDocument;
}

export interface ProductTree {
  branches: Branch[];
  relationships: Relationship[];
}

export interface Branch {
  category: string;
  name: string;
  branches?: Branch[];
}

export interface Relationship {
  category: string;
  product_reference: string;
  relates_to_product_reference: string;
  full_product_name: {
    name: string;
    product_id: string;
  };
}

export interface Vulnerability {
  title: string;
  cve: string;
  discovery_date: string;
  release_date: string;
  scores: Score[];
  cwe?: {
    id: string;
    name: string;
  };
  product_status: { [k: string]: string[] };
  remediations: {
    category: string;
    details: string;
    date?: string;
    url?: string;
    product_ids: string[];
  }[];
  notes: {
    category: string;
    text: string;
    title: string;
  }[];
  ids: {
    system_name: string;
    text: string;
  }[];
  references: {
    category: string;
    summary: string;
    url: string;
  }[];
}

export interface Score {
  cvss_v3: CVSS_v3;
}

export type BaseSeverity = "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface CVSS_v3 {
  attackComplexity: string;
  attackVector: string;
  availabilityImpact: string;
  baseScore: number;
  baseSeverity: BaseSeverity;
  confidentialityImpact: string;
  integrityImpact: string;
  privilegesRequired: string;
  scope: string;
  userInteraction: string;
  vectorString: string;
  version: string;
  products: string[];
}

export type CSAF_Category = "csaf_base" | "csaf_security_advisory" | "csaf_vex";

export interface AdvisoryDocument {
  category: CSAF_Category | string;
  aggregate_severity: {
    namespace?: string;
    text: RHSeverity;
  };
  publisher: {
    name: string;
    category: string;
    namespace: string;
    contact_details?: string;
    issuing_authority?: string;
  };
  tracking: {
    id: string;
    status: string;
    initial_release_date: string;
    current_release_date: string;
  };
  references: {
    category: string;
    summary: string;
    url: string;
  }[];
  notes: {
    category: string;
    text: string;
    title: string;
  }[];
}

//

export interface CveIndexed {
  score: number;
  document: {
    related_products: number;
    related_advisories: number;
    document: {
      id: string;
      title: string;
      descriptions: string[];
      cvss3x_score?: number;
      date_published: string;
    };
  };
}

export interface Cve {
  containers: {
    cna: {
      metrics?: {
        cvssV3_1: {
          baseScore: number;
          baseSeverity: string;
        };
      }[];
      title: string;
      descriptions: { value: string }[];
    };
  };
  cveMetadata: {
    dateReserved: string;
    datePublished: string;
    dateUpdated: string;
  };
}

export interface SbomIndexed {
  id: string;
  name: string;
  version?: string;
  supplier: string;
  created: number[];
  dependencies: number;
  advisories?: number;
}

export enum SbomType {
  SPDX = "spdx",
  CycloneDx = "CycloneDx",
  Unknown = "Unknown",
}

export type Sbom =
  | {
      type: SbomType.SPDX;
      sbom: SbomSPDX;
    }
  | {
      type: SbomType.CycloneDx;
      sbom: SbomCycloneDx;
    }
  | {
      type: SbomType.Unknown;
      sbom: SbomUnknown;
    };

export interface SbomUnknown {}

export interface SbomSPDX {
  name: string;
  documentNamespace: string;
  spdxVersion: string;
  dataLicense: string;
  creationInfo: {
    created: string;
    licenseListVersion: string;
    creators: string[];
  };
  packages: SPDXPackage[];
}

export interface SPDXPackage {
  name: string;
  versionInfo: string;
  externalRefs?: {
    referenceCategory: string;
    referenceLocator: string;
    referenceType: string;
  }[];
}

export interface SbomCycloneDx {
  serialNumber: string;
  specVersion: string;
  metadata: {
    timestamp: string;
    component: {
      name: string;
      version: string;
      externalReferences?: {
        type: string;
        url: string;
      }[];
      licenses?: {
        license: { id: string };
      }[];
    };
  };
  components: {
    purl: string;
    name: string;
    version: string;
    licenses?: {
      license: { id: string };
    }[];
  }[];
}

export interface SbomVulnerabilities {
  version: string;
  name: string;
  created: number[];
  details: {
    id: string;
    description: string;
    published?: number[];
    updated?: number[];
    affected_packages?: { [k: string]: string };
    sources?: {
      mitre?: {
        score: number;
      };
    };
  }[];
  summary: (string | { severity?: string; count: number }[])[][];
}

export interface PackageIndexed {
  purl: string;
}

export interface Package {
  purl: string;
  vulnerabilities?: {
    cve: string;
    severity: string;
  }[];
}

export interface PackageRelatedProducts {
  related_products: {
    sbom_uid: string;
  }[];
}

export enum ProductCveStatus {
  Fixed = "Fixed",
  FirstFixed = "FirstFixed",
  FirstAffected = "FirstAffected",
  KnownAffected = "KnownAffected",
  LastAffected = "LastAffected",
  KnownNotAffected = "KnownNotAffected",
  Recommended = "Recommended",
  UnderInvestigation = "UnderInvestigation",
}

export interface CveRelatedProducts {
  products: {
    [key in ProductCveStatus]: {
      // Key: SBOM UID
      [key: string]: {
        purl: string;
        type: string;
      }[];
    };
  };
}
