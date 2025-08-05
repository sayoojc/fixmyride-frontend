"use client";
import { useSelector } from "react-redux";
import type React from "react";

import type { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { axiosPrivate } from "@/api/axios";
import createUserApi from "@/services/userApi";
import type { IServicePackage } from "@/types/service-packages";
import type { IFrontendCart } from "@/types/cart";

const userApi = createUserApi(axiosPrivate);

interface ServicePackagesProps {
  setCart: (state: IFrontendCart) => void;
  serviceCategory: string;
  modelId: string;
  fuelType: string;
  cart: IFrontendCart;
}

export const ServicePackages: React.FC<ServicePackagesProps> = ({
  setCart,
  serviceCategory,
  modelId,
  fuelType,
  cart,
}) => {
  const vehicle = useSelector((state: RootState) => state.vehicle);
  const [servicePackages, setServicePackages] = useState<IServicePackage[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchServicePackages = async () => {
      setLoading(true);
      const response = await userApi.getServicePackages(
        modelId,
        serviceCategory,
        fuelType
      );
      setServicePackages(response.servicePackages);
      setLoading(false);
    };

    fetchServicePackages();
  }, [serviceCategory]);
  useEffect(() => {
     if (!cart?.services || servicePackages.length === 0) return;
    setServicePackages((prev) =>
      prev.map((sp) => {
        const isInCart = cart?.services?.some(
          (cartService) => cartService.serviceId._id === sp._id
        );
        return {
          ...sp,
          isAdded: isInCart,
        };
      })
    );
  }, [cart,servicePackages.length]);

  const handleAddToCart = async (serviceId: string, vehicleId: string) => {
    try {
      const response = await userApi.addToCart(serviceId, vehicleId);
      setCart(response.cart);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  };

  if (!vehicle.id) {
    return (
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Select Your Vehicle
            </h3>
            <p className="text-gray-600 mb-6">
              Choose your vehicle to see personalized service packages tailored
              for your car's needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-800">
                  Customized Services
                </h4>
                <p className="text-gray-600 mt-1">
                  Services matched to your vehicle model
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-800">Best Pricing</h4>
                <p className="text-gray-600 mt-1">
                  Competitive rates for quality service
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-800">Expert Care</h4>
                <p className="text-gray-600 mt-1">Professional technicians</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <span className="ml-3 text-gray-600">
            Loading service packages...
          </span>
        </div>
      </div>
    );
  }
  if (!servicePackages || servicePackages.length === 0) {
    return (
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No Service Packages Available
          </h3>
          <p className="text-gray-600">
            We couldn't find any service packages for your selected vehicle.
            Please try selecting a different vehicle or contact support.
          </p>
        </div>
      </div>
    );
  }

  // Render service packages
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
          <div className="p-4">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 mb-4 md:mb-0">
                {service.modelId?.imageUrl ? (
                  <img
                    src={service.modelId.imageUrl || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-36 rounded object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-36 rounded flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h6"
                      />
                    </svg>
                  </div>
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
                  • {service.brandId?.brandName || "Standard Warranty"} •{" "}
                  {service.description || "Recommended service"}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  {(service.servicesIncluded || [])
                    .slice(0, 5)
                    .map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <div className="mt-2 text-green-500 text-sm cursor-pointer hover:text-green-600">
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
                  onClick={() => handleAddToCart(service._id, vehicle.id)}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
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
