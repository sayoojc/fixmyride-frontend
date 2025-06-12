import { AxiosInstance } from "axios";
import { Address } from "@/types/user";
import { IVehicle } from "@/types/vehicle";
import axios from "axios";

const createUserApi = (axiosPrivate: AxiosInstance) => ({
  getProfileDataApi: async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/getProfileData`
      );
      return response.data;
    } catch (error) {
      console.error("Fetching the user profile data is failed");
      throw new Error("Failed fetching the profile");
    }
  },
  getBrandAndModels: async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/get-brands`
      );
      return response.data;
    } catch (error) {
      console.error("Fetching Brand Data Failed");
      throw new Error("Failed to fetch brand Data");
    }
  },
  addAddressApi: async (addressData: Address) => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/add-address`,
        addressData
      );
      return response;
    } catch (error) {
      console.error("Fetching Brand Data Failed");
      throw new Error("Failed to add address");
    }
  },
  setDefaultAddress: async (addressId: string, userId: string) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/set-default-address`,
        { addressId, userId }
      );
      return response;
    } catch (error) {
      console.error("Setting default address failed");
      throw new Error("Setting default address failed");
    }
  },
  updateAddressApi: async (
    addressForm: Address,
    _id: string,
    userId: string
  ) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/update-address`,
        {
          addressForm,
          _id,
          userId,
        }
      );
      return response;
    } catch (error) {
      console.error("Editing the address failed");
      throw new Error("Editing the address failed");
    }
  },
  deleteAddress: async (addressId: string, userId: string) => {
    try {
      const response = await axiosPrivate.delete(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/delete-address`,
        {
          params: {
            addressId,
            userId,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Deleting address failed");
      throw new Error("Deleting address failed");
    }
  },
  updateProfileApi: async (phone: string, userId: string, userName: string) => {
    try {
      const response = await axiosPrivate.put(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/update-profile`,
        {
          phone,
          userId,
          userName,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Updating profile failed");
      throw new Error("Updating profile failed");
    }
  },
  changePasswordApi: async (
    userId: string,
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const response = await axiosPrivate.put(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/change-password`,
        {
          userId,
          currentPassword,
          newPassword,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Changing the password failed");
      throw new Error("Changing the password failed");
    }
  },
  getBrandsApi: async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/get-brand-model-data`
      );
      return response.data;
    } catch (error) {
      console.error("Error while fetching the brand model data");
      throw new Error("Error while fetching the brand model data");
    }
  },
  addVehicleApi: async (vehicleData: Partial<IVehicle>) => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/add-vehicle`,
        vehicleData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Axios error while adding the vehicle"
        );
      }

      throw new Error("Unknown error while adding the vehicle");
    }
  },
  getVehiclesApi: async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/get-vehicles`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getServicePackages: async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/get-service-packages`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Axios error while getting the service packages"
        );
      }

      throw new Error("Unknown error while getting the service packages");
    }
  },
  fetchCart: async (vehicleId: string) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/get-cart`,
        {
          params: { vehicleId },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addToCart: async (serviceId: string, vehicleId: string) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/add-to-cart`,
        { serviceId, vehicleId }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addVehicleToCart: async (vehicleId: string) => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/add-vehicle-to-cart`,
        { vehicleId }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  removeFromCart: async (cartId: string, packageId: string) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/remove-service-from-cart`,
        { cartId, packageId }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
});

export default createUserApi;
