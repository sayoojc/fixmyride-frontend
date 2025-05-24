import { AxiosInstance } from "axios";
import { Address } from "@/types/user";
import { IVehicle } from "@/types/vehicle";
import axios from "axios";

const createUserApi = (axiosPrivate:AxiosInstance) => ( {
  getProfileDataApi : async () => {
    try {
        const response = await axiosPrivate.get("/api/user/getProfileData");
        return response.data;
    } catch (error) {
        console.error('Fetching the user profile data is failed');
          throw new Error("Failed fetching the profile");

    }
  },
  getBrandAndModels : async () => {
    try {
        const response = await axiosPrivate.get("/api/user/get-brands");
        return response.data;
    } catch (error) {
        console.error('Fetching Brand Data Failed');
          throw new Error("Failed to fetch brand Data");

    }
  },
  addAddressApi : async (addressData:Address) => {
    try {
      const response = await axiosPrivate.post("/api/user/add-address", addressData );
    return response;
    } catch (error) {
      console.error('Fetching Brand Data Failed');
      throw new Error("Failed to add address");

      }
  },
  setDefaultAddress : async (addressId:string,userId:string) => {
    try {
      const response = await axiosPrivate.patch("/api/user/set-default-address", { addressId,userId });
    return response;
    } catch (error) {
      console.error('Setting default address failed');
      throw new Error("Setting default address failed");

      }
  },
  updateAddressApi : async ( addressForm:Address,_id:string,userId: string,) => {
    try {
      const response = await axiosPrivate.patch("/api/user/update-address",{
        addressForm,
        _id,
        userId,
       });
       return response;
    } catch (error) {
      console.error('Editing the address failed');
      throw new Error("Editing the address failed");

    }
  },
  deleteAddress : async(addressId:string,userId:string) => {
    try {
     const response =  await axiosPrivate.delete(`/api/user/delete-address`, {
        params: {
          addressId,
          userId,
        },
      });
    return response;
    } catch (error) {
      console.error('Deleting address failed');
      throw new Error("Deleting address failed");

    }
  },
  updateProfileApi : async(phone:string,userId:string,userName:string) => {
    try {
      const response = await axiosPrivate.put("/api/user/update-profile",{
        phone,
        userId,
        userName
      });
      return response.data;
    } catch (error) {
      console.error('Updating profile failed');
       throw new Error("Updating profile failed");
    }
  },
  changePasswordApi : async(userId:string, currentPassword:string, newPassword:string) => {
    try {
      const response = await axiosPrivate.put("/api/user/change-password",{
        userId,
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Changing the password failed');
      throw new Error("Changing the password failed");
    }
  },
  getBrandsApi : async() => {
    try {
       const response = await axiosPrivate.get("/api/user/get-brand-model-data");
    return response.data
    } catch (error) {
      console.error('Error while fetching the brand model data');
      throw new Error("Error while fetching the brand model data");

    }
   
  },
addVehicleApi: async (vehicleData: Partial<IVehicle>) => {
  try {
    const response = await axiosPrivate.post("/api/user/add-vehicle", vehicleData);
    return response.data;
  } catch (error: any) {
    console.error('Error while adding the vehicle:', error);

    // Optionally, rethrow the original error
    if (axios.isAxiosError(error)) {
      // This gives you access to `error.response?.data.message` etc.
      throw new Error(error.response?.data?.message || "Axios error while adding the vehicle");
    }

    throw new Error("Unknown error while adding the vehicle");
  }
}

})



export default createUserApi