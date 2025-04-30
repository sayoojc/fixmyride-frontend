import { AxiosInstance } from "axios";
import { VerificationFormData } from "@/types/provider";

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

})



export default createProviderApi