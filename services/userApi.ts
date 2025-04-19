import { AxiosInstance } from "axios";

const createUserApi = (axiosPrivate:AxiosInstance) => ( {
  getProfileDataApi : async () => {
    try {
        const response = await axiosPrivate.get("/api/user/getProfileData");
        return response.data;
    } catch (error) {
        console.error('Fetching the user profile data is failed');
    }
  },
  getBrandAndModels : async () => {
    try {
        const response = await axiosPrivate.get("/api/user/get-brands");
        return response.data;
    } catch (error) {
        console.error('Fetching Brand Data Failed');
    }
  },

})


export default createUserApi