import { AxiosInstance } from "axios";
interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
  };
}

const createAuthApi = (axiosPrivate:AxiosInstance) => ({

  loginApi: async(email:string,password:string) => {
  const response = await axiosPrivate.post("/api/user/login",{
    email,
    password,
  })
  return response.data
  },
  // googleAuthApi: async() => {
  //   const response = await axiosPrivate.get("/api/user/google");
  //   return response.data;
  // },
  registerTempApi: async (name:string,email:string,phone:string,password:string) => {
    const response = await axiosPrivate.post("/api/user/register-temp",{
        name,
        email,
        phone,
        password
    })
    return response.data
  },
  registerApi: async (otpValue:string,email:string,phone:string) => {
    const response = await axiosPrivate.post("/api/user/signup",{
        otpValue,
        email,
        phone
    })
    return response.data
  },
  //forgot password

  forgotPasswordApi: async (email:string) => {
    const response = await axiosPrivate.post("/api/user/forgotPassword",{
        email,
    })
    return response.data
  },
  resetPasswordApi: async(email:string,otp:string,newPassword:string) => {
    const response =  await axiosPrivate.post("/api/user/resetPassword",{
      email,
      otp,
      newPassword
    })
  },
  adminLoginApi: async(email:string,password:string) => {
    const response = await axiosPrivate.post("/api/admin/adminlogin",{
      email,
      password,
    })
    return response.data
    },
    providerLoginApi: async(email:string,password:string) => {
      try {
        const response = await axiosPrivate.post("/api/provider/provider-login",{
          email,
          password,
        })
        return response.data
      } catch (error) {
        throw error
      }
    
      },
      logoutApi: async () => {
        try {
          const response = await axiosPrivate.post("/api/user/logout");
          return response.data;
        } catch (error) {
          console.error("Logout API failed:", error);
          throw error;
        }
      },
    ProviderLogoutApi: async () => {
        try {
          const response = await axiosPrivate.post("/api/provider/providerlogout");
          return response.data;
        } catch (error) {
          console.error("Logout API failed:", error);
          throw error;
        }
      },
      adminLogoutApi: async () => {
        try {
          const response = await axiosPrivate.post("/api/admin/logout");
          return response.data;
        } catch (error) {
          console.error("Logout API failed:", error);
          throw error;
        }
      },
      //provider register
      providerRegisterTempApi: async (data:SignupFormData) => {
        try {
          console.log('provider register temp api')
          const response = await axiosPrivate.post("/api/provider/provider-register-temp",data)
          return response.data
        } catch (error) {
          console.error('Provider registration failed');

        }

      },
      providerRegisterApi: async (otp:string,email:string,phone:string) => {
        const response = await axiosPrivate.post("/api/provider/provider-register",{
            otp,
            email,
            phone
        })
        return response.data
      },
});

export default createAuthApi;