import { serializeRequestParamsForHub } from "@app/hooks/table-controls";
import axios from "axios";
import {
  Advisory,
  AdvisoryIndexed,
  Cve,
  CveIndexed,
  CveRelatedProducts,
  HubPaginatedResult,
  HubRequestParams,
  Package,
  PackageIndexed,
  PackageRelatedProducts,
  SbomIndexed,
  SbomVulnerabilities,
} from "./models";

const HUB = "/hub";

export const ADVISORIES = HUB + "/api/v1/advisory";
export const CVEs = HUB + "/api/v1/cve";
export const SBOMs = HUB + "/api/v1/sbom";
export const PACKAGES = HUB + "/api/v1/package";

export const DA_REPORT = HUB + "/api/v1/analyze/report";

interface ApiSearchResult<T> {
  total: number;
  result: T[];
}

export const getHubPaginatedResult = <T>(
  url: string,
  params: HubRequestParams = {}
): Promise<HubPaginatedResult<T>> =>
  axios
    .get<ApiSearchResult<T>>(url, {
      params: serializeRequestParamsForHub(params),
    })
    .then(({ data }) => ({
      data: data.result,
      total: data.total,
      params,
    }));

export const getAdvisories = (params: HubRequestParams = {}) => {
  return getHubPaginatedResult<AdvisoryIndexed>(`${ADVISORIES}/search`, params);
};

export const getAdvisoryById = (id: number | string) => {
  return axios
    .get<Advisory>(`${ADVISORIES}?id=${id}`)
    .then((response) => response.data);
};

export const downloadAdvisoryById = (id: number | string) => {
  return axios.get(`${ADVISORIES}?id=${id}`, {
    responseType: "arraybuffer",
    headers: { Accept: "text/plain", responseType: "blob" },
  });
};

export const getAdvisoryByCveId = (cveId: number | string) => {
  return getHubPaginatedResult<AdvisoryIndexed>(`${ADVISORIES}/search`, {
    filters: [
      {
        field: "cve",
        value: cveId,
        operator: "=",
      },
    ],
  }).then((response) => response.data);
};

//

export const getCves = (params: HubRequestParams = {}) => {
  return getHubPaginatedResult<CveIndexed>(`${CVEs}`, params);
};

export const getCveById = (id: number | string) => {
  return axios.get<Cve>(`${CVEs}/${id}`).then((response) => response.data);
};

export const getCveIndexedById = (id: number | string) => {
  return getHubPaginatedResult<CveIndexed>(`${CVEs}`, {
    filters: [
      {
        field: "id",
        value: id,
        operator: "=",
      },
    ],
  }).then((response) =>
    response.data.length === 1 ? response.data[0] : undefined
  );
};

export const downloadCveById = (id: number | string) => {
  return axios.get(`${CVEs}/${id}`, {
    responseType: "arraybuffer",
    headers: { Accept: "text/plain", responseType: "blob" },
  });
};

export const getCveRelatedProducts = (id: number | string) => {
  return axios
    .get<CveRelatedProducts>(`${CVEs}/${id}/related-products`)
    .then((response) => response.data);
};

//

export const getSboms = (params: HubRequestParams = {}) => {
  return getHubPaginatedResult<SbomIndexed>(`${SBOMs}/search`, params);
};

export const getSbomById = (id: number | string) => {
  return axios.get<{}>(`${SBOMs}?id=${id}`).then((response) => response.data);
};

export const downloadSbomById = (id: number | string) => {
  return axios.get(`${SBOMs}?id=${id}`, {
    responseType: "arraybuffer",
    headers: { Accept: "text/plain", responseType: "blob" },
  });
};

export const getSbomIndexedById = (id: number | string) => {
  return getHubPaginatedResult<SbomIndexed>(`${SBOMs}/search`, {
    filters: [
      {
        field: "id",
        value: id,
        operator: "=",
      },
    ],
  }).then((response) =>
    response.data.length === 1 ? response.data[0] : undefined
  );
};

export const getSbomIndexedByUId = (id: number | string) => {
  return getHubPaginatedResult<SbomIndexed>(`${SBOMs}/search`, {
    filters: [
      {
        field: "uid",
        value: id,
        operator: "=",
      },
    ],
  }).then((response) =>
    response.data.length === 1 ? response.data[0] : undefined
  );
};

export const getSbomVulnerabilitiesById = (id: number | string) => {
  return axios
    .get<SbomVulnerabilities>(`${SBOMs}/vulnerabilities?id=${id}`)
    .then((response) => response.data);
};

//

export const getPackages = (params: HubRequestParams = {}) => {
  return getHubPaginatedResult<PackageIndexed>(`${PACKAGES}/search`, params);
};

export const getPackageById = (id: number | string) => {
  return axios
    .get<Package>(`${PACKAGES}/${encodeURIComponent(id.toString())}`)
    .then((response) => response.data);
};

export const getPackageRelatedProducts = (id: number | string) => {
  return axios
    .get<PackageRelatedProducts>(
      `${PACKAGES}/${encodeURIComponent(id.toString())}/related-products`
    )
    .then((response) => response.data);
};

//

export const getDAReport = (obj: string) =>
  axios.post<string>(`${DA_REPORT}`, obj);
