import { axiosPublic } from "@/api/axiosPublic";
export const fetchLocationFromPincode = async (pincode: string) => {
  try {
    const response = await axiosPublic.get(`${process.env.NEXT_PUBLIC_PIN_CODE_API}${pincode}`);
   
    if (response.data[0].Status === "Success") {
      const postOffice = response.data[0].PostOffice[0];
      return {
        city: postOffice.District,
        state: postOffice.State,
      };
    }
  } catch (error) {
  throw error
  }
  return null;
};
