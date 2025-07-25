import axios from "axios";
import Swal from "sweetalert2";


export const axiosPrivate = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {  
         await Swal.fire({
        icon: "warning",
        title: "Unauthorized",
        text: "Your session is no longer valid or your account has been blocked. Please sign in again or contact support.",
        confirmButtonText: "OK",
      });    
     window.location.href = '/'
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

