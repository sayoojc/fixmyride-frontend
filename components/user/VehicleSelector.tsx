"use client";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IVehicle } from "@/types/user";
import createUserApi from "@/services/userApi";
import { axiosPrivate } from "@/api/axios";
import { IFrontendCart } from "@/types/cart";
import { useDispatch } from "react-redux";
import { setVehicleData } from "../../redux/features/vehicleSlice";
import { IServicePackage } from "@/types/service-packages";
const userApi = createUserApi(axiosPrivate);
interface VehicleSelectorProps {
  vehicles: IVehicle[];
  setOpenAddVehicleModal: (state: boolean) => void;
  setCart: (state: IFrontendCart) => void;
}
export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  vehicles,
  setOpenAddVehicleModal,
  setCart,
}) => {
  const dispatch = useDispatch();
  const selectVehicleHandler = async (vehicleId: string) => {
    try {
      const response = await userApi.addVehicleToCart(vehicleId);
      const cart = response.cart;
      const selectedVehicleData = {
        id: cart.vehicleId._id,
        brand: {
          name: cart.vehicleId.brandId?.brandName,
          imageUrl: cart.vehicleId.brandId?.imageUrl,
        },
        model: {
          name: cart.vehicleId.modelId?.name,
          imageUrl: cart.vehicleId.modelId?.imageUrl,
          fuelType: cart.vehicleId.fuel,
        },
      };
      dispatch(setVehicleData(selectedVehicleData));
      setCart(cart);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-4">
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Select Your Vehicle</h3>
            <p className="text-gray-600 mb-4">
              Choose a vehicle to see available services
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {vehicles.map((vehicle) => (
              <motion.div
                key={vehicle._id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="cursor-pointer"
              >
                <Card className="overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow">
                  <CardContent
                    className="p-3 flex flex-col items-center text-center"
                    onClick={() => selectVehicleHandler(vehicle._id)}
                  >
                    <motion.div
                      className="relative h-20 w-28 mb-2 overflow-hidden rounded-md"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.img
                        src={vehicle.modelId.imageUrl || "/placeholder.svg"}
                        alt={vehicle.modelId.name}
                        className="object-cover h-full w-full"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                    <h4 className="font-semibold text-sm">
                      {vehicle.brandId.brandName}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {vehicle.modelId.name}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-[104px] border-dashed shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0 h-full">
                  <Button
                    variant="ghost"
                    className="w-full h-full flex flex-col items-center justify-center"
                    onClick={() => {
                      setOpenAddVehicleModal(true);
                    }}
                  >
                    <Plus className="h-8 w-8 text-gray-400 mb-1" />
                    <span className="text-sm font-medium text-gray-600">
                      Add New Vehicle
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
