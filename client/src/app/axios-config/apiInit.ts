import ENV from "@app/env";
import axios from "axios";
import { User } from "oidc-client-ts";

function getUser() {
  const oidcStorage = sessionStorage.getItem(
    `oidc.user:${ENV.OIDC_SERVER_URL}:${ENV.OIDC_CLIENT_ID}`
  );
  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}

export const initInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const user = getUser();
      const token = user?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // axios.interceptors.response.use(
  //   (response) => {
  //     return response;
  //   },
  //   async (error) => {
  //     if (error.response && error.response.status === 401) {
  //       try {
  //         const refreshed = await keycloak.updateToken(5);
  //         if (refreshed) {
  //           const retryConfig = {
  //             ...error.config,
  //             headers: {
  //               ...error.config.headers,
  //               Authorization: `Bearer ${keycloak.token}`,
  //             },
  //           };
  //           return axios(retryConfig);
  //         }
  //       } catch (refreshError) {
  //         keycloak.login();
  //       }
  //     }
  //     return Promise.reject(error);
  //   }
  // );
};
