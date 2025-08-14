"use client";
import React, { useEffect, useState } from "react";
import { CategoryBar } from "@/components/user/CategoryBar";
import { ServicePackages } from "@/components/user/ServicePackages";
import { CartSummary } from "@/components/user/CartSummary";
import AddVehicleModal from "@/components/user/AddVehicleModal";
import { VehicleSelector } from "../../components/user/VehicleSelector";
import createUserApi from "@/services/userApi";
import { axiosPrivate } from "@/api/axios";
import { Vehicle } from "@/types/user";
import { IFrontendCart } from "@/types/cart";
import { toast } from "react-toastify";

const userApi = createUserApi(axiosPrivate);
const serviceCategories = [
  {
    key: "general",
    name: "Periodic Services",
    icon: "/icons/periodic.png",
    isActive: true,
  },
  {
    key: "ac",
    name: "AC Service & Repair",
    icon: "/icons/ac.png",
    isActive: false,
  },
  {
    key: "battery",
    name: "Batteries",
    icon: "/icons/battery.png",
    isActive: false,
  },
  {
    key: "tyres",
    name: "Tyres & Wheel Care",
    icon: "/icons/tyre.png",
    isActive: false,
  },
  {
    key: "dent",
    name: "Denting & Painting",
    icon: "/icons/denting.png",
    isActive: false,
  },
  {
    key: "detailing",
    name: "Detailing Services",
    icon: "/icons/detailing.png",
    isActive: false,
  },
  {
    key: "emergency",
    name: "Emergency Services",
    icon: "/icons/sos.png",
    isActive: false,
  },
];

const CarServiceBooking = () => {
  const [selectedServiceCategory, setSelectedServiceCategory] =
    useState<string>('general');
  const [cart, setCart] = useState<IFrontendCart>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [openAddVehicleModal, setOpenAddVehicleModal] = useState(false);
useEffect(() => {
  const fetchVehicles = async () => {
    try {
      const response = await userApi.getVehiclesApi();
      console.log('the response',response);

      setVehicles(response.vehicles);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      toast.error("Unable to load vehicles. Please try again.");
    }
  };

  fetchVehicles();
}, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryBar
        serviceCategories={serviceCategories}
        selectedServiceCategory={selectedServiceCategory}
        setSelectedServiceCategory={setSelectedServiceCategory}
      />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Scheduled Packages
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cart?.vehicleId.modelId._id ?(
            <ServicePackages
              cart={cart}
              setCart={setCart}
              serviceCategory={selectedServiceCategory}
              modelId={cart.vehicleId.modelId._id}
              fuelType={cart.vehicleId.fuel}
            />
          ):(
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
          )}
          {cart ? (
            <CartSummary cart={cart} setCart={setCart} />
          ) : (
            <VehicleSelector
              vehicles={vehicles}
              setOpenAddVehicleModal={setOpenAddVehicleModal}
              setCart={setCart}
            />
          )}
          <AddVehicleModal
            open={openAddVehicleModal}
            onOpenChange={setOpenAddVehicleModal}
            setVehicles={setVehicles}
          />
        </div>
      </div>
    </div>
  );
};

export default CarServiceBooking;
