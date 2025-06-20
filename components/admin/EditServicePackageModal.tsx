"use client";

import type React from "react";
import { useState, useCallback, useEffect } from "react";
import {
  useForm,
  useFieldArray,
  type FieldErrors,
  type Control,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ServicePackageSchema,
  type ServicePackageFormData,
} from "../../validations/servicePackage";
import type { IServicePackage, IPart } from "../../types/service-packages";
import { toast } from "react-toastify";
import { Brand, Model } from "@/types/brand";
import createAdminApi from "@/services/adminApi";
import { axiosPrivate } from "@/api/axios";
const adminApi = createAdminApi(axiosPrivate);

interface EditServicePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedPackage: IServicePackage) => void;
  brands: Brand[];
  servicePackage: IServicePackage | null;
 
}

interface FormState {
  loading: boolean;
  serviceInput: string;
}

const EditServicePackageModal: React.FC<EditServicePackageModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  brands,
  servicePackage,
}) => {
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    serviceInput: "",
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  }: {
    register: any;
    control: Control<ServicePackageFormData>;
    handleSubmit: any;
    watch: any;
    setValue: any;
    reset: any;
    formState: { errors: FieldErrors<ServicePackageFormData> };
  } = useForm<ServicePackageFormData>({
    resolver: zodResolver(ServicePackageSchema),
  });
  const [selectedBrand, setSelectedBrand] = useState<Brand>();
  const [selectedModel, setSelectedModel] = useState<Model>();
  const [selectedFuel, setSelectedFuel] = useState<string>();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "priceBreakup.parts",
  });


  // Populate form when servicePackage changes
  useEffect(() => {
    if (servicePackage && isOpen) {
      const formData: ServicePackageFormData = {
        title: servicePackage.title,
        description: servicePackage.description,
        brandId: servicePackage.brandId._id,
        modelId: servicePackage.modelId._id,
        fuelType: servicePackage.fuelType,
        servicesIncluded: servicePackage.servicesIncluded,
        priceBreakup: servicePackage.priceBreakup,
      };
      reset(formData);
      replace(servicePackage.priceBreakup.parts);
    }
  }, [servicePackage, isOpen, reset, replace]);

  // Calculate total automatically
  const watchedValues = watch();
  const parts = watch("priceBreakup.parts");
  const laborCharge = watch("priceBreakup.laborCharge");
  const discount = watch("priceBreakup.discount");
  const tax = watch("priceBreakup.tax");
  // Calculate total automatically
  useEffect(() => {
    const partsTotal = (parts || []).reduce(
      (sum: number, part: IPart) =>
        sum + (part?.price || 0) * (part?.quantity || 0),
      0
    );

    const subtotal = (partsTotal || 0) + (laborCharge || 0) - (discount || 0);
    const total = subtotal + (tax || 0);

    setValue("priceBreakup.total", Math.max(0, total));
  }, [parts, laborCharge, discount, tax, setValue]);

  const updateServiceInput = useCallback((value: string): void => {
    setFormState((prev) => ({ ...prev, serviceInput: value }));
  }, []);

  const setLoading = useCallback((loading: boolean): void => {
    setFormState((prev) => ({ ...prev, loading }));
  }, []);

  const addService = useCallback((): void => {
    if (formState.serviceInput.trim()) {
      const currentServices: string[] = watchedValues.servicesIncluded || [];
      setValue("servicesIncluded", [
        ...currentServices,
        formState.serviceInput.trim(),
      ]);
      updateServiceInput("");
    }
  }, [
    formState.serviceInput,
    watchedValues.servicesIncluded,
    setValue,
    updateServiceInput,
  ]);

  const removeService = useCallback(
    (index: number): void => {
      const currentServices: string[] = watchedValues.servicesIncluded || [];
      setValue(
        "servicesIncluded",
        currentServices.filter((_, i: number) => i !== index)
      );
    },
    [watchedValues.servicesIncluded, setValue]
  );

  const addPart = useCallback((): void => {
    append({ name: "", price: 0, quantity: 1 });
  }, [append]);

  const removePart = useCallback(
    (index: number): void => {
      remove(index);
    },
    [remove]
  );

  const onSubmit = useCallback(
    async (data: ServicePackageFormData): Promise<void> => {
      if (!servicePackage) return;

      setLoading(true);
      try {
        const updatedPackage =
          await adminApi.updateServicePackage(servicePackage._id, data);
          console.log('the service package updated',updatedPackage);
          onSuccess(updatedPackage.servicePackage);
      } catch (error) {
        console.error("Error updating service package:", error);
        toast.error("Failed to update service package");
      } finally {
        setLoading(false);
      }
    },
    [servicePackage, onSuccess, onClose, setLoading]
  );

  const handleClose = useCallback((): void => {
    reset();
    updateServiceInput("");
    onClose();
  }, [reset, updateServiceInput, onClose]);

  const handleServiceInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      updateServiceInput(event.target.value);
    },
    [updateServiceInput]
  );

  const handleServiceInputKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (event.key === "Enter") {
        event.preventDefault();
        addService();
      }
    },
    [addService]
  );

  const handleFuelTypeChange = useCallback(
    (value: "petrol" | "diesel" | "lpg" | "cng"): void => {
      setValue("fuelType", value);
    },
    [setValue]
  );

  const handleBrandChange = useCallback(
    (value: string): void => {
      setValue("brandId", value);
      const selected = brands.find((brand) => brand._id === value);
      setSelectedBrand(selected || undefined);
    },
    [setValue, brands]
  );

  const handleModelChange = useCallback(
    (value: string): void => {
      setValue("modelId", value);
      const selected = selectedBrand?.models.find(
        (model) => model._id == value
      );
      setSelectedModel(selected);
    },
    [setValue, selectedBrand]
  );

  if (!servicePackage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Service Package</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Package Title</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Enter package title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select onValueChange={handleFuelTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={servicePackage.fuelType} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedModel?.fuelTypes.map((fuel) => (
                        <SelectItem key={fuel} value={fuel}>
                          {fuel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fuelType && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.fuelType.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter package description"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brandId">Brand</Label>
                  <Select onValueChange={handleBrandChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          servicePackage.brandId.brandName || "Select Brand"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectContent>
                        <SelectItem value="placeholder"> </SelectItem>

                        {brands.map((brand) => (
                          <SelectItem key={brand._id} value={brand._id}>
                            {brand.brandName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectContent>
                  </Select>
                  {errors.brandId && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.brandId.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="modelId">Model</Label>
                  <Select onValueChange={handleModelChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          watchedValues.model
                            ? watchedValues.model
                            : servicePackage.modelId.name
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
                    <p className="text-sm text-red-600 mt-1">
                      {errors.modelId.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Included */}
          <Card>
            <CardHeader>
              <CardTitle>Services Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={formState.serviceInput}
                    onChange={handleServiceInputChange}
                    placeholder="Enter service name"
                    onKeyPress={handleServiceInputKeyPress}
                  />
                  <Button type="button" onClick={addService}>
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {watchedValues.servicesIncluded?.map(
                      (service: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                          <span>{service}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeService(index)}
                          >
                            <X size={14} />
                          </Button>
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                </div>
                {errors.servicesIncluded && (
                  <p className="text-sm text-red-600">
                    {errors.servicesIncluded.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Price Breakup */}
          <Card>
            <CardHeader>
              <CardTitle>Price Breakup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Parts */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Parts</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPart}
                  >
                    <Plus size={14} className="mr-1" />
                    Add Part
                  </Button>
                </div>
                <div className="space-y-2">
                  {fields.map((field, index: number) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-12 gap-2 items-end"
                    >
                      <div className="col-span-5">
                        <Input
                          {...register(`priceBreakup.parts.${index}.name`)}
                          placeholder="Part name"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          step="0.01"
                          {...register(`priceBreakup.parts.${index}.price`, {
                            valueAsNumber: true,
                          })}
                          placeholder="Price"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          {...register(`priceBreakup.parts.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                          placeholder="Qty"
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePart(index)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Other charges */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="laborCharge">Labor Charge</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("priceBreakup.laborCharge", {
                      valueAsNumber: true,
                    })}
                    placeholder="0.00"
                  />
                  {errors.priceBreakup?.laborCharge && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.priceBreakup.laborCharge.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="discount">Discount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("priceBreakup.discount", {
                      valueAsNumber: true,
                    })}
                    placeholder="0.00"
                  />
                  {errors.priceBreakup?.discount && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.priceBreakup.discount.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="tax">Tax</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("priceBreakup.tax", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {errors.priceBreakup?.tax && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.priceBreakup.tax.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="total">Total</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("priceBreakup.total", { valueAsNumber: true })}
                    placeholder="0.00"
                    readOnly
                    className="bg-gray-50"
                  />
                  {errors.priceBreakup?.total && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.priceBreakup.total.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={formState.loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formState.loading}>
              {formState.loading ? "Updating..." : "Update Package"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServicePackageModal;
