import { AxiosInstance } from "axios";
import { ServicePackageFormData } from "@/types/service-packages";

const createAdminApi = (axiosPrivate: AxiosInstance) => ({
  ///Brand management///
  AddBrandApi: async (brandName: string, imageUrl: string) => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/brands`,
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
  getBrandsApi: async (search: string, page: number, statusFilter: string) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/brands?search=${search}&page=${page}&statusFilter=${statusFilter}`
      );
      return response.data;
    } catch (error) {
      console.error("Fetching Brand Data Failed", error);
    }
  },
  updateBrandStatusApi: async (brandId: string, newStatus: string) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/brands/${brandId}/status`,
        {
          newStatus,
        }
      );
      return response;
    } catch (error) {}
  },
  updateBrandApi: async (id: string, name: string, imageUrl: string) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/brands/${id}`,
        {
          name,
          imageUrl,
        }
      );
      return response;
    } catch (error) {}
  },

  /// Model management ///
  AddModelApi: async (
    model: string,
    imageUrl: string,
    brandId: string,
    fuelTypes: string[]
  ) => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/model`,
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

  updateModelStatusApi: async (
    brandId: string,
    modelId: string,
    newStatus: string
  ) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/Model/${modelId}/status`,
        {
          brandId,
          newStatus,
        }
      );
      return response;
    } catch (error) {}
  },

  updateModelApi: async (
    id: string,
    name: string,
    imageUrl: string,
    fuelTypes: string[],
    brandId: string
  ) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/model/${id}`,
        {
          name,
          imageUrl,
          fuelTypes,
          brandId
        }
      );
      return response;
    } catch (error) {}
  },

  /////User management ////

  getUsersApi: async (
    debouncedSearchTerm: string,
    currentPage: number,
    statusFilter: string
  ) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/users?search=${debouncedSearchTerm}&page=${currentPage}&statusFilter=${statusFilter}`
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
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/users/${email}`
      );
      return response;
    } catch (error) {
      console.error("Toggling the status failed");
    }
  },
  ///Provider management///
  getProvidersList: async (
    search: string,
    page: number,
    statusFilter: string
  ) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/providers?search=${search}&page=${page}&statusFilter=${statusFilter}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  getVerificationData: async (id: string) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/verification/${id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  getProviderById: async (id: string) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/provider/${id}`
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
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/verification/${providerId}`,
        {
          verificationAction,
          adminNotes,
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
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/provider/${providerId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  ////Service package management////
  addServicePackage: async (data: ServicePackageFormData) => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/service-package`,
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
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/service-packages?search=${searchTerm}&page=${currentPage}&statusFilter=${statusFilter}&fuelFilter=${fuelFilter}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateServicePackage: async (id: string, data: ServicePackageFormData) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/service-package/${id}`,
        { data }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  toggleServicePackageStatus: async (id: string, actionType: string) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/service-package/${id}/status`,
        { actionType }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
});

export default createAdminApi;
