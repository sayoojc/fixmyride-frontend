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
  AddModelApi : async (model:string,imageUrl:string,brandId:string) => {
    try {
        const response = await axiosPrivate.post("/api/admin/add-model",{
            model,
            imageUrl,
            brandId
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
  }

})


export default createAdminApi