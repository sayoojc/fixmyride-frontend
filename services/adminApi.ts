import { AxiosInstance } from "axios";
import { ServicePackageFormData } from "@/types/service-packages";

const createAdminApi = (axiosPrivate: AxiosInstance) => ({
  AddBrandApi: async (brandName: string, imageUrl: string) => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/add-brand`,
        {
          brandName,
          imageUrl,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Adding brand failed");
    }
  },
  AddModelApi: async (
    model: string,
    imageUrl: string,
    brandId: string,
    fuelTypes: string[]
  ) => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/add-model`,
        {
          model,
          imageUrl,
          brandId,
          fuelTypes,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Adding model failed");
    }
  },
  getBrandsApi: async (search: string, page: number, statusFilter: string) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/get-brands?search=${search}&page=${page}&statusFilter=${statusFilter}`
      );
      return response.data;
    } catch (error) {
      console.error("Fetching Brand Data Failed", error);
    }
  },
  updateBrandStatusApi: async (brandId: string, newStatus: string) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/toggle-brand-status`,
        {
          brandId,
          newStatus,
        }
      );
      return response;
    } catch (error) {}
  },
  updateModelStatusApi: async (
    brandId: string,
    modelId: string,
    newStatus: string
  ) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/toggle-Model-status`,
        {
          brandId,
          modelId,
          newStatus,
        }
      );
      return response;
    } catch (error) {}
  },
  updateBrandApi: async (id: string, name: string, imageUrl: string) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/update-brand`,
        {
          id,
          name,
          imageUrl,
        }
      );
      return response;
    } catch (error) {}
  },
  updateModelApi: async (id: string, name: string, imageUrl: string) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/update-model`,
        {
          id,
          name,
          imageUrl,
        }
      );
      return response;
    } catch (error) {}
  },
  getUsersApi: async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/get-users`
      );
      return response;
    } catch (error) {
      console.error("fetching data failed", error);
      throw error;
    }
  },
  toggleListing: async (email: string) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/toggle-user-listing`,
        { email }
      );
      return response;
    } catch (error) {
      console.error("Toggling the status failed");
    }
  },
  getProvidersList: async (
    search: string,
    page: number,
    statusFilter: string
  ) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/get-providers?search=${search}&page=${page}&statusFilter=${statusFilter}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  getVerificationData: async (id: string) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/get-verification-data?id=${id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  getProviderById: async (id: string) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/get-provider?id=${id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  verifyProviderApi: async (
    providerId: string,
    verificationAction: string,
    adminNotes: string
  ) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/verify-provider`,
        {
          providerId,
          verificationAction,
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  toggleProviderListing: async (providerId: string) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/toggle-provider-listing`,
        {
          providerId,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addServicePackage: async (data: ServicePackageFormData) => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/add-service-package`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getServicePackages: async (
    searchTerm: string,
    currentPage: number,
    statusFilter: string,
    fuelFilter: string
  ) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/get-service-packages?search=${searchTerm}&page=${currentPage}&statusFilter=${statusFilter}&fuelFilter=${fuelFilter}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateServicePackage: async (id: string, data: ServicePackageFormData) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/update-service-package`,
        { id, data }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  toggleBlockStatus: async (id: string, actionType: string) => {
    try {
      console.log(
        "The toggle block unblock from the admin api",
        id,
        actionType
      );
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/toggle-block-status`,
        { id, actionType }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
});

export default createAdminApi;
