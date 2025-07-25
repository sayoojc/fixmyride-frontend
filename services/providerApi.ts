import { AxiosInstance } from "axios";
import { VerificationFormData } from "@/types/provider";
import { IServiceProvider } from "@/types/provider";

const createProviderApi = (axiosPrivate:AxiosInstance) => ( {

    getProfileData : async () => {
        try {
            const response = await axiosPrivate.get(`${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/profile`);
            return response.data;
        } catch (error) {
            throw error
        }
      },
      providerVerification : async (verificationData:VerificationFormData) => {
        try {
            const response = await axiosPrivate.post(`${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/profile/verify`,{
                verificationData
            });
            return response.data;
        } catch (error) {
            throw error
        }
      },
      updateProfile : async (data:Partial<IServiceProvider>) => {
        try{
         const response = await axiosPrivate.patch(`${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/profile`,data);
         return response.data
        } catch(error) {
          throw error
        }
      },
      getOrderDetails : async (orderId:string) => {
        try {
          console.log('the get order details api and the order id',orderId);
          const response = await axiosPrivate.get(`${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/order/${orderId}`);
          return response.data;
        } catch (error) {
          throw error
        }
      }

})



export default createProviderApi