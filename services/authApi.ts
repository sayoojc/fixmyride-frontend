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

const createAuthApi = (axiosPrivate: AxiosInstance) => ({
  //// User Auth ////
  loginApi: async (email: string, password: string) => {
    try {
        const response = await axiosPrivate.post(
      `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/login`,
      {
        email,
        password,
      }
    );
    return response.data;  
    } catch (error) {
      throw error
    }
  },
  registerTempApi: async (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => {
    try {
        const response = await axiosPrivate.post(
      `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/register-temp`,
      {
        name,
        email,
        phone,
        password,
      }
    );
    return response;
    } catch (error) {
      throw error
    } 
  },
  registerApi: async (otpValue: string, email: string, phone: string) => {
    try {
        const response = await axiosPrivate.post(
      `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/signup`,
      {
        otpValue,
        email,
        phone,
      }
    );
    return response;
    } catch (error) {
      throw error
    }
  },
  forgotPasswordApi: async (email: string) => {
    try {
        const response = await axiosPrivate.post(
      `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/forgot`,
      {
        email,
      }
    );
    return response.data;
    } catch (error) {
      throw error
    }  
  },
  resetPasswordApi: async (token: string,password: string) => {
    try {
         const response = await axiosPrivate.post(
      `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/reset`,
      {
      token,
      password
      }
    ); 
    } catch (error) {
      throw error
    }
  },
  logoutApi: async () => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/logout`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  ///Admin Auth ////
  adminLoginApi: async (email: string, password: string) => {
    try {
          const response = await axiosPrivate.post(
      `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/login`,
      {
        email,
        password,
      }
    );
    return response.data;
    } catch (error) {
      throw error
    }
  },
  adminLogoutApi: async () => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/logout`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  //// Provider Auth ////
  providerLoginApi: async (email: string, password: string) => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/login`,
        {
          email,
          password,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  ProviderLogoutApi: async () => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/logout`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //provider register
  providerRegisterTempApi: async (data: SignupFormData) => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/register-temp`,
        data
      );
      return response.data;
    } catch (error) {
      throw error
    }
  },
  providerRegisterApi: async (otp: string, email: string, phone: string) => {
    try {
       const response = await axiosPrivate.post(
      `${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/register`,
      {
        otp,
        email,
        phone,
      }
    );
    return response.data;
    } catch (error) {
      throw error
    }
   
  },
});

export default createAuthApi;
