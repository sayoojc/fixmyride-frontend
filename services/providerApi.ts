import { AxiosInstance } from "axios";
import { VerificationFormData } from "@/types/provider";
import { IServiceProvider } from "@/types/provider";

const createProviderApi = (axiosPrivate: AxiosInstance) => ({
  getProfileData: async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/profile`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  providerVerification: async (verificationData: VerificationFormData) => {
    try {
      const response = await axiosPrivate.post(
        `${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/profile/verify`,
        {
          verificationData,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateProfile: async (data: Partial<IServiceProvider>) => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/profile`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getOrderDetails: async (orderId: string) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/order/${orderId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getNotifications: async (
    debouncedSearchTerm: string,
    currentPage: number,
    filterType: string,
    itemsPerPage:number,
    unreadOnlyFilter:boolean
  ) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/notifications`,
        {
          params:{
            search:debouncedSearchTerm,
            page:currentPage,
            filter:filterType,
            itemsPerPage,
            unreadOnly:unreadOnlyFilter
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  markNotificationAsRead: async(notificationId:string) => {
    try {
      console.log('the mark notificatin as read service function ');
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/notifications/${notificationId}/read`
      );
      return response.data;
    } catch (error) {
      throw error 
    }
  },
  markNotificationAsUnread: async(notificationId:string) => {
    try {
      
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/notifications/${notificationId}/unread`
      );
      return response.data;
    } catch (error) {
      throw error
    }
  },
  deleteNotification: async(notificationId:string) => {
    try {
      const response = await axiosPrivate.delete(
        `${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/notifications/${notificationId}`
      )
      return response.data;
    } catch (error) {
      throw error
    }
  },
  markAllAsRead: async() => {
    try {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_PROVIDER_API_END_POINT}/notifications`
      )
      return response.data;
    } catch (error) {
      throw error
    }
  }

});

export default createProviderApi;
