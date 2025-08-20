import { AxiosInstance } from "axios";
import { ServicePackageFormData } from "@/types/service-packages";
import { get } from "http";

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
      throw error;
    }
  },
  getBrandsApi: async (search: string, page: number, statusFilter: string) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/brands?search=${search}&page=${page}&statusFilter=${statusFilter}`
      );
      return response.data;
    } catch (error) {
      throw error;
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
    } catch (error) {
      throw error;
    }
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
    } catch (error) {
      throw error;
    }
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
      throw error;
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
    } catch (error) {
      throw error;
    }
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
          brandId,
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
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
      throw error;
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
  ////order management////
getAllOrders: async ({
  search,
  page,
  limit,
  status,
  dateFilter,
  startDate,
  endDate,
}: {
  search: string;
  page: number;
  limit: number;
  status: string;
  dateFilter: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const params = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
      statusFilter: status,
      dateFilter,
    });

    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await axiosPrivate.get(
      `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/orders?${params.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
},
getOrderById: async (orderId: string) => {
  try {
    const response = await axiosPrivate.get(
      `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/orders/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
},
getNotifications: async (search: string, page: number, limit: number,statusFilter:string) => {
  try {
    const response = await axiosPrivate.get(
      `${process.env.NEXT_PUBLIC_ADMIN_API_END_POINT}/notifications?search=${search}&page=${page}&limit=${limit}&statusFilter=${statusFilter}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

});

export default createAdminApi;
