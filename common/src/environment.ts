/** Define process.env to contain `GuacEnvType` */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends Partial<Readonly<GuacEnvType>> {}
  }
}

/**
 * The set of environment variables used by `@guac-ui` packages.
 */
export type GuacEnvType = {
  NODE_ENV: "development" | "production" | "test";
  VERSION: string;

  /** Controls how mock data is injected on the client */
  MOCK: string;

  /** Enable RBAC authentication/authorization */
  AUTH_REQUIRED: "true" | "false";

  /** SSO / Oidc client id */
  OIDC_CLIENT_ID: string;

  /** UI upload file size limit in megabytes (MB), suffixed with "m" */
  UI_INGRESS_PROXY_BODY_SIZE: string;

  /** The listen port for the UI's server */
  PORT?: string;

  /** Target URL for the UI server's `/auth` proxy */
  OIDC_SERVER_URL?: string;

  /** Target URL for the UI server's `/hub` proxy */
  GUAC_HUB_URL?: string;

  /** Location of branding files (relative paths computed from the project source root) */
  BRANDING?: string;
};

/**
 * Keys in `GuacEnv` that are only used on the server and therefore do not
 * need to be sent to the client.
 */
export const SERVER_ENV_KEYS = ["PORT", "GUAC_HUB_URL", "BRANDING"];

/**
 * Create a `GuacEnv` from a partial `GuacEnv` with a set of default values.
 */
export const buildGuacEnv = ({
  NODE_ENV = "production",
  PORT,
  VERSION = "99.0.0",
  MOCK = "off",

  OIDC_SERVER_URL,
  AUTH_REQUIRED = "false",
  OIDC_CLIENT_ID = "frontend",

  UI_INGRESS_PROXY_BODY_SIZE = "500m",
  GUAC_HUB_URL,
  BRANDING,
}: Partial<GuacEnvType> = {}): GuacEnvType => ({
  NODE_ENV,
  PORT,
  VERSION,
  MOCK,

  OIDC_SERVER_URL,
  AUTH_REQUIRED,
  OIDC_CLIENT_ID,

  UI_INGRESS_PROXY_BODY_SIZE,
  GUAC_HUB_URL,
  BRANDING,
});

/**
 * Default values for `GuacEnvType`.
 */
export const GUAC_ENV_DEFAULTS = buildGuacEnv();

/**
 * Current `@guac-ui` environment configurations from `process.env`.
 */
export const GUAC_ENV = buildGuacEnv(process.env);
