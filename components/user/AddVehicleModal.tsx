"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import createUserApi from "@/services/userApi";
import { axiosPrivate } from "@/api/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { FuelIcon as GasPump, Droplet, Zap, Flame } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import type { User as UserType, Address } from "../../types/user";
import { IVehicle } from "../../types/user";

const userApi = createUserApi(axiosPrivate);

type Brand = {
  _id: string;
  brandName: string;
  imageUrl: string;
  models: Model[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type Model = {
  _id: string;
  brandId: string;
  name: string;
  imageUrl: string;
  status: string;
  fuelTypes: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type AddVehicleModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  setUser?: (user: UserType) => void;
  user?: UserType;
  setVehicles?: React.Dispatch<React.SetStateAction<IVehicle[]>>;

};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: { opacity: 0, y: -20 },
};

const fuelTypeConfig = {
  Petrol: {
    icon: GasPump,
    color: "bg-red-100 text-red-600 border-red-200",
    label: "Petrol",
  },
  Diesel: {
    icon: Droplet,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    label: "Diesel",
  },
  CNG: {
    icon: Flame,
    color: "bg-green-100 text-green-600 border-green-200",
    label: "CNG",
  },
  LPG: {
    icon: Flame,
    color: "bg-purple-100 text-purple-600 border-purple-200",
    label: "LPG",
  },
  Electric: {
    icon: Zap,
    color: "bg-blue-100 text-blue-600 border-blue-200",
    label: "Electric",
  },
};

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  open,
  onOpenChange,
  setUser,
  user,
  setVehicles
}) => {
  const [step, setStep] = useState<"brand" | "model" | "fuel" | "final">(
    "brand"
  );
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedFuel, setSelectedFuel] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      fetchBrands();
    } else {
      // Reset state when modal closes
      setStep("brand");
      setSelectedBrand(null);
      setSelectedModel(null);
      setSelectedFuel(null);
    }
  }, [open]);

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.getBrandsApi();
      console.log("response", response);
      if (response && response.brands) {
        setBrands(response.brands);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      setError("Failed to load brands. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitVehicle = async () => {
    if (!selectedBrand || !selectedModel || !selectedFuel) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const vehicleData = {
        brandId: selectedBrand._id,
        brandName: selectedBrand.brandName,
        modelId: selectedModel._id,
        modelName: selectedModel.name,
        fuelType: selectedFuel,
      };

      const response = await userApi.addVehicleApi(vehicleData);

      setSubmitSuccess(true);
      const newVehicle = response.vehicle;
      
     if (setVehicles) {
  setVehicles(prev => [...prev, newVehicle]);
}
      if (user && setUser) {
        setUser({
          ...user,
          vehicles: [...user.vehicles, newVehicle],
        });
      }

      toast.success("Vehicle added successfully");

      if (!onOpenChange) {
        return;
      }
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Error adding the vehicle: ${errMsg}nkhkjhkhjhl`);
      setSubmitError("Failed to add vehicle. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getFuelIcon = (fuelType: string) => {
    const config = fuelTypeConfig[fuelType as keyof typeof fuelTypeConfig] || {
      icon: GasPump,
      color: "bg-gray-100 text-gray-600 border-gray-200",
      label: fuelType,
    };

    const Icon = config.icon;
    return { Icon, color: config.color, label: config.label };
  };

  const renderStepContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBrands}
            className="mt-2"
          >
            Try again
          </Button>
        </Alert>
      );
    }

    switch (step) {
      case "brand":
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="brand-step"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle>Select Brand</DialogTitle>
              </DialogHeader>

              {brands.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No brands available
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {brands.map((brand) => (
                    <motion.div
                      key={brand._id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className="cursor-pointer border hover:border-primary/50 hover:shadow-md transition-all"
                        onClick={() => {
                          setSelectedBrand(brand);
                          setStep("model");
                        }}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-4">
                          <div className="w-16 h-16 flex items-center justify-center">
                            <img
                              src={brand.imageUrl || "/placeholder.svg"}
                              alt={brand.brandName}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/images/placeholder-brand.png";
                              }}
                            />
                          </div>
                          <p className="mt-2 text-sm font-medium">
                            {brand.brandName}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        );

      case "model":
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="model-step"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <DialogHeader className="flex flex-row items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStep("brand")}
                  className="mr-2 h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <DialogTitle>Select Model</DialogTitle>
              </DialogHeader>

              {selectedBrand?.models.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No models available for this brand
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {selectedBrand?.models.map((model) => (
                    <motion.div
                      key={model._id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className="cursor-pointer border hover:border-primary/50 hover:shadow-md transition-all"
                        onClick={() => {
                          console.log("selected model", model);
                          setSelectedModel(model);
                          setStep("fuel");
                        }}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-4">
                          <div className="w-16 h-16 flex items-center justify-center">
                            <img
                              src={model.imageUrl || "/placeholder.svg"}
                              alt={model.name}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/images/placeholder-model.png";
                              }}
                            />
                          </div>
                          <p className="mt-2 text-sm font-medium">
                            {model.name}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        );

      case "fuel":
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="fuel-step"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <DialogHeader className="flex flex-row items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStep("model")}
                  className="mr-2 h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <DialogTitle>Select Fuel Type</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4">
                {selectedModel?.fuelTypes.map((fuel) => {
                  const { Icon, color, label } = getFuelIcon(fuel);
                  return (
                    <motion.div
                      key={fuel}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className={cn(
                          "cursor-pointer border-2 hover:shadow-md transition-all overflow-hidden",
                          color
                        )}
                        onClick={() => {
                          setSelectedFuel(fuel);
                          setStep("final");
                        }}
                      >
                        <CardContent className="flex items-center p-4 gap-3">
                          <div className="rounded-full p-2 bg-white/80 backdrop-blur">
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="font-medium">{label}</span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        );

      case "final":
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="final-step"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <DialogHeader>
                <DialogTitle>You're All Set!</DialogTitle>
              </DialogHeader>

              <motion.div className="space-y-4" variants={itemVariants}>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 bg-primary/10">
                      <h3 className="font-semibold">Vehicle Details</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <img
                            src={selectedBrand?.imageUrl || "/placeholder.svg"}
                            alt={selectedBrand?.brandName}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/images/placeholder-brand.png";
                            }}
                          />
                        </div>
                        <span className="text-sm">
                          <span className="text-muted-foreground">Brand:</span>{" "}
                          {selectedBrand?.brandName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <img
                            src={selectedModel?.imageUrl || "/placeholder.svg"}
                            alt={selectedModel?.name}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/images/placeholder-model.png";
                            }}
                          />
                        </div>
                        <span className="text-sm">
                          <span className="text-muted-foreground">Model:</span>{" "}
                          {selectedModel?.name}
                        </span>
                      </div>

                      {selectedFuel && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {React.createElement(
                              getFuelIcon(selectedFuel).Icon,
                              { className: "w-4 h-4" }
                            )}
                          </div>
                          <span className="text-sm">
                            <span className="text-muted-foreground">
                              Fuel Type:
                            </span>{" "}
                            {selectedFuel}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {submitError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                {submitSuccess ? (
                  <Alert
                    variant="default"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="rounded-full bg-green-100 p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <AlertDescription>
                        Vehicle added successfully!
                      </AlertDescription>
                    </motion.div>
                  </Alert>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full"
                      onClick={handleSubmitVehicle}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding Vehicle...
                        </>
                      ) : (
                        "Add Vehicle"
                      )}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Vehicle</DialogTitle>{" "}
          {/* Or whatever your modal is about */}
        </DialogHeader>

        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleModal;
