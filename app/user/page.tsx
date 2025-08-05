"use client";
import React, { useEffect, useState } from "react";
import { CategoryBar } from "@/components/user/CategoryBar";
import { ServicePackages } from "@/components/user/ServicePackages";
import { CartSummary } from "@/components/user/CartSummary";
import AddVehicleModal from "@/components/user/AddVehicleModal";
import { VehicleSelector } from "../../components/user/VehicleSelector";
import createUserApi from "@/services/userApi";
import { axiosPrivate } from "@/api/axios";
import { IVehicle } from "@/types/user";
import { IFrontendCart } from "@/types/cart";

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
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [openAddVehicleModal, setOpenAddVehicleModal] = useState(false);
  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await userApi.getVehiclesApi();
      setVehicles(response.vehicles);
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
          {cart?.vehicleId.modelId._id && (
            <ServicePackages
              cart={cart}
              setCart={setCart}
              serviceCategory={selectedServiceCategory}
              modelId={cart.vehicleId.modelId._id}
              fuelType={cart.vehicleId.fuel}
            />
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
