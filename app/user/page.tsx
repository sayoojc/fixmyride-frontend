"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
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

const CarServiceBooking = () => {
  const vehicle = useSelector((state: RootState) => state.vehicle);
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

  useEffect(() => {
    console.log("the cart", cart);
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryBar />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Scheduled Packages
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ServicePackages setCart={setCart} />
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
