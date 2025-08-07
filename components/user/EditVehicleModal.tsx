"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Car, Fuel, Settings, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type {
  IVehicle,
  EditVehicleFormData,
} from "../../types/vehicle";
import { axiosPrivate } from "@/api/axios";
import createUserApi from "@/services/userApi";
const userApi = createUserApi(axiosPrivate);
import { FUEL_TYPES as fuelTypes } from "@/constants/fuelTypes";
import { Brand } from "@/types/brand";

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: IVehicle | null;
  onSave: (vehicleId: string, data: EditVehicleFormData) => Promise<void>;
}

export default function EditVehicleModal({
  isOpen,
  onClose,
  vehicle,
  onSave,
}: EditVehicleModalProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand>();
  const [formData, setFormData] = useState<EditVehicleFormData>({
    brandId: vehicle?.brandId._id.toString() ?? "",
    modelId: vehicle?.modelId._id.toString() ?? "",
    fuel: vehicle?.fuel ?? "",
    isDefault: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<EditVehicleFormData>>({});
   useEffect(() => {
    console.log('form data',formData)
   },[formData]);
  // Initialize form data when vehicle changes
useEffect(() => {
  if (vehicle && brands.length > 0) {
    const matchingBrand = brands.find(
      (brand) => brand._id === vehicle.brandId._id
    );

    setSelectedBrand(matchingBrand ?? undefined);

    setFormData({
      brandId: vehicle.brandId._id.toString(),
      modelId: vehicle.modelId._id.toString(),
      fuel: vehicle.fuel,
      isDefault: vehicle.isDefault,
    });
  }
}, [vehicle, brands]);


  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await userApi.getBrandsApi();
        console.log("the response after fetchingjj brands", response);
        setBrands(response.brands);
      } catch (error) {}
    };
    fetchBrands();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<EditVehicleFormData> = {};

    if (!formData.brandId) {
      newErrors.brandId = "Brand is required";
    }
    if (!formData.modelId) {
      newErrors.modelId = "Model is required";
    }
    if (!formData.fuel) {
      newErrors.fuel = "Fuel type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!vehicle || !validateForm()) return;

    setIsLoading(true);
    try {
      await onSave(vehicle._id.toString(), formData);
      onClose();
    } catch (error) {
      console.error("Error updating vehicle:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Edit Vehicle
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Vehicle Info */}
          {vehicle && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-600">
                      Current Vehicle
                    </p>
                    <p className="text-lg font-semibold">
                      {vehicle?.brandId.brandName} {vehicle.modelId.name} {vehicle.fuel}
                    </p>
                  </div>
                  {formData.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Brand Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div className="space-y-2">
            <Label htmlFor="brand">Brand *</Label>
            <Select
              value={formData.brandId}
              onValueChange={(value) => {
                const brand = brands.find((brand) => brand._id === value);
                setSelectedBrand(brand);
                setFormData((prev) => ({ ...prev, brandId: value }));
              }}
            >
              <SelectTrigger className={errors.brandId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                {brands?.map((brand) => (
                  <SelectItem key={brand._id} value={brand._id}>
                    {brand.brandName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.brandId && (
              <p className="text-sm text-red-500">{errors.brandId}</p>
            )}
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model">Model *</Label>
            <Select
              value={formData.modelId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, modelId: value }))
              }
              disabled={!formData.brandId}
            >
              <SelectTrigger className={errors.modelId ? "border-red-500" : ""}>
                <SelectValue
                  placeholder={
                    formData.brandId ? "Select a model" : "Select a brand first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {selectedBrand?.models.map((model) => (
                  <SelectItem key={model._id} value={model._id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.modelId && (
              <p className="text-sm text-red-500">{errors.modelId}</p>
            )}
          </div>

          {/* Fuel Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="fuel" className="flex items-center gap-2">
              <Fuel className="h-4 w-4" />
              Fuel Type *
            </Label>
            <Select
              value={formData.fuel}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, fuel: value }))
              }
            >
              <SelectTrigger className={errors.fuel ? "border-red-500" : ""}>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                {fuelTypes.map((fuel) => (
                  <SelectItem key={fuel.label} value={fuel.id}>
                    {fuel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.fuel && (
              <p className="text-sm text-red-500">{errors.fuel}</p>
            )}
          </div>
            </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="default" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Set as Default Vehicle
              </Label>
              <p className="text-sm text-gray-500">
                This vehicle will be selected by default for new orders
              </p>
            </div>
            <Switch
              id="default"
              checked={formData.isDefault}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isDefault: checked }))
              }
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
