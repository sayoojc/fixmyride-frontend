import { AxiosInstance } from "axios";
import { Address } from "@/types/user";
import { IVehicle } from "@/types/vehicle";
import { AvailableDate } from "@/types/checkout";
import { TimeSlot } from "@/types/checkout";
import { EditVehicleFormData } from "@/types/vehicle";
import axios from "axios";

const createUserApi = (axiosPrivate: AxiosInstance) => ({
  ///////Address Api/////////////////////
  async getAddresses() {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/addresses`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addAddressApi: async (addressData: Address) => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/addresses`,
        addressData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  setDefaultAddress: async (addressId: string) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/addresses/${addressId}/default`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateAddressApi: async (addressForm: Address, _id: string) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/addresses/${_id}`,
        {
          addressForm,
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteAddress: async (addressId: string) => {
    try {
      const response = await axiosPrivate.delete(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/addresses/${addressId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  /////////Brand API///////
  getBrandsApi: async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/brands`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  ////////Cart APIs//////////

  async getCart(cartId: string) {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/cart`,
        { params: { cartId } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  fetchCart: async (vehicleId: string) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/cart`,
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
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/cart/services`,
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
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/cart/vehicle`,
        { vehicleId }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  removeFromCart: async (cartId: string, packageId: string) => {
    try {
      const response = await axiosPrivate.delete(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/cart/${cartId}/services/${packageId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  /////////Profile APIs///////
  getProfileDataApi: async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/profile`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfileApi: async (phone: string, userName: string) => {
    try {
      const response = await axiosPrivate.put(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/profile`,
        {
          phone,
          userName,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  changePasswordApi: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await axiosPrivate.put(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/profile/password`,
        {
          currentPassword,
          newPassword,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  //////Vehicle APIs///////
  addVehicleApi: async (vehicleData: {
    brandId: string;
    brandName: string;
    modelId: string;
    modelName: string;
    fuelType: string;
  }) => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/vehicles`,
        vehicleData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getVehiclesApi: async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/vehicles`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteVehicleApi: async (vehicleId: string) => {
    try {
      const response = await axiosPrivate.delete(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/vehicles/${vehicleId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  editVehicleApi: async (vehicleId: string, data: EditVehicleFormData) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/vehicles/${vehicleId}`,
        { ...data }
      );
      return response.data;
    } catch (error) {
      console.error("Error editing vehicle:", error);
      throw error;
    }
  },
  //// service package api///
  getServicePackages: async (
    vehicleId: string,
    serviceCategory: string,
    fuelType: string
  ) => {
    try {
      if (!vehicleId || !serviceCategory) return;
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/service-packages?vehicleId=${vehicleId}&serviceCategory=${serviceCategory}&fuelType=${fuelType}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  //////payment APIs/////////
  async createRazorPayOrder(amount: number) {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/payments/razorpay/order`,
        { amount }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async verifyRazorpayPayment(
    orderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    cartId: string,
    paymentMethod: string,
    selectedAddressId: {
      addressLine1: string;
      addressLine2: string;
      addressType: string;
      city: string;
      id?: string;
      isDefault: boolean;
      latitude: number;
      longitude: number;
      state: string;
      userId: string;
      zipCode: string;
    },
    selectedDate: AvailableDate,
    selectedSlot: TimeSlot
  ) {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/payments/razorpay/verify`,
        {
          orderId,
          razorpayPaymentId,
          razorpaySignature,
          cartId,
          paymentMethod,
          selectedAddressId,
          selectedDate,
          selectedSlot,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  //// Order Apis////
  async getOrderdetails(id: string) {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_USER_API_END_POINT}/orders/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
});

export default createUserApi;
