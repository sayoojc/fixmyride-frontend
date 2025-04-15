import axios from "axios";
import { request } from "http";


export const axiosPrivate = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {      
     window.location.href = '/'
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

