import { AxiosInstance } from "axios";
import { VerificationFormData } from "@/types/provider";
import { IServiceProvider } from "@/types/provider";

const createProviderApi = (axiosPrivate:AxiosInstance) => ( {

    getProfileData : async () => {
        try {
            const response = await axiosPrivate.get("/api/provider/get-profile-data");
            return response.data;
        } catch (error) {
            throw error
        }
      },
      providerVerification : async (verificationData:VerificationFormData) => {
        try {
            const response = await axiosPrivate.post("/api/provider/verify-provider",{
                verificationData
            });
            return response.data;
        } catch (error) {
            throw error
        }
      },
      getVerificationData : async (id:string) => {
        try {
            const response = await axiosPrivate.post("/api/provider/getVerificationData",{id});
            return response.data;
        } catch (error) {
            throw error
        }
      },
      updateProfile : async (data:Partial<IServiceProvider>) => {
        try{
         const response = await axiosPrivate.patch("/api/provider/update-profile",data);
         return response.data
        } catch(error) {
          throw error
        }
      }

})



export default createProviderApi