"use client";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { axiosPrivate } from "@/api/axios";
import createUserApi from "@/services/userApi";
import { IServicePackage } from "@/types/service-packages";
import { IFrontendCart } from "@/types/cart";

const userApi = createUserApi(axiosPrivate);

interface CartSummaryProps { 
  setCart:(state:IFrontendCart) => void
}

export const ServicePackages:React.FC<CartSummaryProps> = ({setCart}) => {
  const vehicle = useSelector((state: RootState) => state.vehicle);
  const [servicePackages, setServicePackages] = useState<IServicePackage[]>([]);

  useEffect(() => {
    const fetchServicePackages = async () => {
      try {
        const response = await userApi.getServicePackages();
        
        setServicePackages(response.servicePackages || []);
      } catch (error) {
        console.error("Failed to fetch service packages:", error);
        throw error;
      }
    };

    fetchServicePackages();
  }, []);

  const handleAddToCart = async (serviceId: string,vehicleId:string) => {
    try {
      const response = await userApi.addToCart(serviceId,vehicleId);
      console.log('The response after add to cart',response)
      setCart(response.cart);
      setServicePackages((prev) => prev.map((service) => {
        if(service._id === serviceId){
          service.isAdded = true;
          return service;
        }
        return service
      }))
    } catch (error) {
      throw error;
    }
  };


  // Handle the case when servicePackages is undefined or empty
  if (!servicePackages || servicePackages.length === 0) {
    return (
      <div className="lg:col-span-2 space-y-6">Loading service packages...</div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      {servicePackages.map((service) => (
        <div
          key={service._id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div
            className={`px-2 py-1 text-white w-max ${
              service._id === "683693d245f412053dec2c98"
                ? "bg-green-500"
                : "hidden"
            }`}
          >
            RECOMMENDED
          </div>
          <div className="p-4" onClick={() => handleAddToCart(service._id,vehicle.id)}>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 mb-4 md:mb-0">
                {service.modelId?.imageUrl ? (
                  <img
                    src={service.modelId.imageUrl || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-36 rounded object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-36 rounded"></div>
                )}
              </div>
              <div className="md:w-3/4 md:pl-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">
                    {service.title || "Unnamed Package"}
                  </h2>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {service.modelId?.name || "Standard"}{" "}
                    {service.fuelType || ""}
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  • {service.brandId.brandName || "Standard Warranty"} •{" "}
                  {service.description || "Recommended service"}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  {(service.servicesIncluded || [])
                    .slice(0, 5)
                    .map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                </div>

                {service.servicesIncluded &&
                  service.servicesIncluded.length > 5 && (
                    <div className="mt-2 text-green-500 text-sm cursor-pointer">
                      + {service.servicesIncluded.length - 5} more View All
                    </div>
                  )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="flex items-center">
                {service.priceBreakup && (
                  <>
                    <span className="text-gray-400 line-through mr-2">
                      Rs.{" "}
                      {(
                        service.priceBreakup.total +
                        (service.priceBreakup.discount || 0)
                      ).toFixed(2)}
                    </span>
                    <span className="text-2xl font-bold">
                      ₹ {service.priceBreakup.total.toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {service.isAdded ? (
                <div className="flex items-center text-green-500">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Added To Cart</span>
                </div>
              ) : (
                <button
                  // onClick={() => addToCart(service._id)}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
