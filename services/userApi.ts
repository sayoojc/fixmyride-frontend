import { AxiosInstance } from "axios";
// interface Address {
//   userId: string | undefined;
//   addressLine1: string;
//   addressLine2?: string;
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   isDefault: boolean;
//   addressType: string;
// }
import { Address } from "@/types/user";

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
  addAddressApi : async (addressData:Address) => {
    try {
      const response = await axiosPrivate.post("/api/user/add-address", { address: addressData });
    return response;
    } catch (error) {
      console.error('Fetching Brand Data Failed');
      }
  },
  setDefaultAddress : async (addressId:string,userId:string) => {
    try {
      const response = await axiosPrivate.patch("/api/user/set-default-address", { addressId,userId });
    return response;
    } catch (error) {
      console.error('Fetching Brand Data Failed');
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
    }
  },
  deleteAddress : async(addressId:string,userId:string) => {
    try {
      console.log('addressId and userId',addressId,userId);
     const response =  await axiosPrivate.delete(`/api/user/delete-address`, {
        params: {
          addressId,
          userId,
        },
      });
    return response;
    } catch (error) {
      console.error('Deleting address failed');
    }
  }

})



export default createUserApi