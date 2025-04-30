import { AxiosInstance } from "axios";

const createimageUploadApi = (axiosPublic:AxiosInstance) => ( {
     uploadBrandImageApi: async(imageFile:File):Promise<string> => {
    try {
        const data = new FormData();
        data.append("file",imageFile);
        data.append("upload_preset","fixmyride");
        data.append("cloud_name","dokhjooln");
        const response = await axiosPublic.post(   
        "https://api.cloudinary.com/v1_1/dokhjooln/image/upload",
        data,
    {
        headers:{
            "Content-Type":"multipart/form-data",
        },
    }
    );
    return response.data.secure_url
    } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
    }
  },
   uploadVerificationImageApi: async(imageFile:File):Promise<string> => {
    try {
        const data = new FormData();
        data.append("file",imageFile);
        data.append("upload_preset","fixmyride");
        data.append("cloud_name","dokhjooln");
        const response = await axiosPublic.post(   
        "https://api.cloudinary.com/v1_1/dokhjooln/image/upload",
        data,
    {
        headers:{
            "Content-Type":"multipart/form-data",
        },
    }
    );
    return response.data.secure_url
    } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
    }
  }

})


export default createimageUploadApi