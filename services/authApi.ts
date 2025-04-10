import { AxiosInstance } from "axios";


const createAuthApi = (axiosPrivate:AxiosInstance) => ({

  loginApi: async(email:string,password:string) => {
  const response = await axiosPrivate.post("/api/auth/login",{
    email,
    password,
  })
  return response.data
  },
  
  registerTempApi: async (name:string,email:string,phone:string,password:string) => {
    const response = await axiosPrivate.post("/api/auth/register-temp",{
        name,
        email,
        phone,
        password
    })
    return response.data
  },
  registerApi: async (otpValue:string,email:string,phone:string) => {
    const response = await axiosPrivate.post("/api/auth/signup",{
        otpValue,
        email,
        phone
    })
    return response.data
  },
  //forgot password

  forgotPasswordApi: async (email:string) => {
    const response = await axiosPrivate.post("/api/auth/forgotPassword",{
        email,
    })
    return response.data
  },
  resetPasswordApi: async(email:string,otp:string,newPassword:string) => {
    const response =  await axiosPrivate.post("/api/auth/resetPassword",{
      email,
      otp,
      newPassword
    })
  },
  adminLoginApi: async(email:string,password:string) => {
    const response = await axiosPrivate.post("/api/auth/adminlogin",{
      email,
      password,
    })
    return response.data
    },
    providerLoginApi: async(email:string,password:string) => {
      const response = await axiosPrivate.post("/api/auth/providerlogin",{
        email,
        password,
      })
      return response.data
      },
      logoutApi: async () => {
        try {
          const response = await axiosPrivate.post("/api/auth/logout");
          return response.data;
        } catch (error) {
          console.error("Logout API failed:", error);
          throw error;
        }
      },
    ProviderLogoutApi: async () => {
        try {
          const response = await axiosPrivate.post("/api/auth/logout");
          return response.data;
        } catch (error) {
          console.error("Logout API failed:", error);
          throw error;
        }
      },
      adminLogoutApi: async () => {
        try {
          const response = await axiosPrivate.post("/api/auth/logout");
          return response.data;
        } catch (error) {
          console.error("Logout API failed:", error);
          throw error;
        }
      },
      getUsersApi:async () => {
        try {
          const response = await axiosPrivate.get("/api/admin/getData");
          return response;
        } catch (error) {
           console.error('fetching data failed',error);
           throw error;
        }
      },
      toggleListing:async (email:string) => {
        try {
          const response = await axiosPrivate.patch("/api/admin/toggleListing",{email});
          return response;
        } catch (error) {
           console.error('Toggling the status failed');
        }
      }
});

export default createAuthApi;