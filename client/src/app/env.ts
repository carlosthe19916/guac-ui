import { decodeEnv, buildGuacEnv } from "@guac-ui/common";

export const ENV = buildGuacEnv(decodeEnv(window._env));

export default ENV;
