import { AxiosInstance } from "axios";
import { VerificationFormData } from "@/types/provider";
import { IServiceProvider } from "@/types/provider";

const createProviderApi = (axiosPrivate:AxiosInstance) => ( {

    getProfileData : async () => {
        try {
            const response = await axiosPrivate.get(`${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/get-profile-data`);
            return response.data;
        } catch (error) {
            throw error
        }
      },
      providerVerification : async (verificationData:VerificationFormData) => {
        try {
            const response = await axiosPrivate.post(`${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/verify-provider`,{
                verificationData
            });
            return response.data;
        } catch (error) {
            throw error
        }
      },
      getVerificationData : async (id:string) => {
        try {
            const response = await axiosPrivate.post(`${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/getVerificationData`,{id});
            return response.data;
        } catch (error) {
            throw error
        }
      },
      updateProfile : async (data:Partial<IServiceProvider>) => {
        try{
         const response = await axiosPrivate.patch(`${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/update-profile`,data);
         return response.data
        } catch(error) {
          throw error
        }
      }

})



export default createProviderApi