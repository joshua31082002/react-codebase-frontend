import { env } from '@/config/env';
import { getAccessToken } from '@/shared/utils/local-storage-utils';
import axios, { AxiosError } from 'axios';

let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

const apiClient = axios.create({
  baseURL: env?.APP_API_SERVICE_BASEURL,
  timeout: 20000,
});

apiClient.interceptors.request.use((requestConfig) => {
  const token = getAccessToken();
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof AxiosError) {
      if (logoutCallback) {
        logoutCallback();
      }
      return Promise.reject(error);
    }
  }
);

export default apiClient;
