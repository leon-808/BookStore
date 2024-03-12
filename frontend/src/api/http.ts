import axios, { AxiosRequestConfig } from "axios";
import httpCode from "http-status-codes";
import { getToken } from "../store/authStore";

const BASE_URL = "http://localhost:8888";
const DEFAULT_TIMEOUT = 30000;

export const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      "content-type": "application/json",
      Authorization: getToken() ? getToken() : "",
    },
    withCredentials: true,
    ...config,
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status < httpCode.BAD_GATEWAY)
        return error.response;
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const httpClient = createClient();
