import { AxiosInstance } from "axios";

const createAdminApi = (axiosPrivate:AxiosInstance) => ( {
  AddBrandApi : async (brandName:string,imageUrl:string) => {
    try {
        const response = await axiosPrivate.post("/api/admin/add-brand",{
            brandName,
            imageUrl
        });
        return response.data;
    } catch (error) {
        console.error('Adding brand failed');
    }
  },
  AddModelApi : async (model:string,imageUrl:string,brandId:string,fuelTypes:string[]) => {
    try {
        const response = await axiosPrivate.post("/api/admin/add-model",{
            model,
            imageUrl,
            brandId,
            fuelTypes
        });
        return response.data;
    } catch (error) {
        console.error('Adding model failed');
    }
  },
  getBrandsApi : async () => {
    try {
        const response = await axiosPrivate.get("/api/admin/get-brands");
        return response.data;
    } catch (error) {
        console.error('Fetching Brand Data Failed');
    }
  },
  updateBrandStatusApi: async (brandId:string,newStatus:string) => {
    try {
      const response = await axiosPrivate.patch("/api/admin/toggle-brand-status",{
        brandId,
        newStatus
      })
      return response
    } catch (error) {
      
    }
  },
  updateModelStatusApi: async (brandId:string,modelId:string,newStatus:string) => {
    try {
      const response = await axiosPrivate.patch("/api/admin/toggle-Model-status",{
        brandId,
        modelId,
        newStatus
      });
      return response;
    } catch (error) {
      
    }
  },
  updateBrandApi: async(id:string, 
    name:string, 
    imageUrl:string) => {
    try {
      const response = await axiosPrivate.patch("/api/admin/update-brand",{
      id,
      name,
      imageUrl,
      })
      return response
    } catch (error) {
      
    }
  },
  updateModelApi: async(id:string, 
    name:string, 
    imageUrl:string) => {
    try {
      const response = await axiosPrivate.patch("/api/admin/update-model",{
      id,
      name,
      imageUrl,
      })
      return response
    } catch (error) {
      
    }
  },
  getUsersApi:async () => {
    try {
      const response = await axiosPrivate.get("/api/admin/get-users");
      return response;
    } catch (error) {
       console.error('fetching data failed',error);
       throw error;
    }
  },
  toggleListing:async (email:string) => {
    try {
      const response = await axiosPrivate.patch("/api/admin/toggle-user-listing",{email});
      return response;
    } catch (error) {
       console.error('Toggling the status failed');
    }
  },
  getProvidersList : async () => {
    try {
      const response = await axiosPrivate.get("/api/admin/get-providers");
        return response;
    } catch (error) {
            throw error
        }
      },
  getVerificationData : async (id:string) => {
    try {
      const response = await axiosPrivate.get(`/api/admin/get-verification-data?id=${id}`,);
      return response
    } catch (error) {
       throw error
    }
  },
  getProviderById : async (id:string) => {
    try {
      const response = await axiosPrivate.get(`/api/admin/get-provider?id=${id}`);
        return response;
    } catch (error) {
            throw error
        }
      },
  verifyProviderApi: async (providerId:string,verificationAction:string,adminNotes:string) => {
    try {
      const response = await axiosPrivate.patch('/api/admin/verify-provider',{
           providerId,
           verificationAction
      })
      return response
    } catch (error) {
      throw error
    }
  },
  toggleProviderListing: async (providerId:string) => {
    try {
      const response = await axiosPrivate.patch('/api/admin/toggle-provider-listing',{
        providerId
      });
      return response.data;
    } catch (error) {
      throw error
    }
  }

})


export default createAdminApi