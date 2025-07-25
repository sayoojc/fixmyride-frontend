"use client";

import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
  type ServicePackageFormData,
} from "../../validations/servicePackage";
import type { IServicePackage, IPart } from "../../types/service-packages";
import { toast } from "react-toastify";
import { Brand, Model } from "@/types/brand";
import createAdminApi from "@/services/adminApi";
import { axiosPrivate } from "@/api/axios";
const adminApi = createAdminApi(axiosPrivate);
import createimageUploadApi from "@/services/imageUploadApi";
import { axiosPublic } from "@/api/axiosPublic";
const imageUploadApi = createimageUploadApi(axiosPublic);
const serviceCategoryOptions = ["general", "ac", "brake", "washing","dent",'detailing','emergency','tyres','battery'];  

interface AddServicePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPackage: IServicePackage) => Promise<void>;
  brands: Brand[];
}

interface FormState {
  loading: boolean;
  serviceInput: string;
}

const AddServicePackageModal: React.FC<AddServicePackageModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  brands,
}) => {
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    serviceInput: "",
  });

  const {
  register,
  handleSubmit,
  watch,
  setValue,
  reset,
  control,
  formState: { errors },
} = useForm<ServicePackageFormData>({
  defaultValues: {
    title: '',
    description: '',
    brandId: '',
    modelId: '',
    fuelType: undefined,
    imageUrl:'',
    servicePackageCategory: 'general', 
    servicesIncluded: [],
    priceBreakup: {
      parts: [{ name: '', price: 0, quantity: 1 }],
      laborCharge: 0,
      discount: 0,
      tax: 0,
      total: 0,
    },
  },
});

  const [selectedBrand, setSelectedBrand] = useState<Brand>();
  const [selectedModel, setSelectedModel] = useState<Model>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
      setSelectedImage(file);
      
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    console.log('selected image',selectedImage)
  },[selectedImage])
  const { fields, append, remove } = useFieldArray({
    control,
    name: "priceBreakup.parts",
  });

  const watchedValues = watch();
  const parts = watch("priceBreakup.parts");
  const laborCharge = watch("priceBreakup.laborCharge");
  const discount = watch("priceBreakup.discount");
  const tax = watch("priceBreakup.tax");

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

  const onSubmit = 
    async (data: ServicePackageFormData): Promise<void> => {
      setLoading(true);
      try {
            if (!selectedImage?.name) {
              console.log('the selected image from the on submit no selected image block',selectedImage)
          throw Error("selected image is not found");
        }
             const imageUrl = await imageUploadApi.uploadImageApi(
          selectedImage
        );
        const newPackage: IServicePackage = await adminApi.addServicePackage(
         { ...data,imageUrl }
        ); 
        await onSuccess(newPackage);
        reset();
        setPreviewUrl("");
        updateServiceInput("");
        onClose();
      } catch (error) {
        console.error("Error adding service package:", error);
        toast.error("Failed to add service package");
      } finally {
        setLoading(false);
      }
    }
    
  

  const handleClose = useCallback((): void => {
    reset();
    setPreviewUrl("");
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
      // setSelectedFuel(value);
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
        (model) => model._id === value
      );
      setSelectedModel(selected);
    },
    [setValue, selectedBrand]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Service Package</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brandId">Brand</Label>

                    <Select
                      onValueChange={handleBrandChange}
                      value={watch("brandId")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand._id} value={brand._id}>
                            {brand.brandName}
                          </SelectItem>
                        ))}
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
                    <Select
                      onValueChange={handleModelChange}
                      value={watch("modelId")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedBrand?.models.map((model) => (
                          <SelectItem value={model._id} key={model._id}>
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
                <div>
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select
                    onValueChange={handleFuelTypeChange}
                    value={watch("fuelType")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
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
                <div className="mt-4">
                  <Label htmlFor="imageUpload">Upload Image</Label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block mt-1 text-sm"
                  />

                  {previewUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">
                        Image Preview:
                      </p>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-48 h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="servicePackageCategory">Service Category</Label>
                <Select
                  onValueChange={(value) =>
                     setValue("servicePackageCategory", value as ServicePackageFormData["servicePackageCategory"])
                  }
                  value={watch("servicePackageCategory")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.servicePackageCategory && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.servicePackageCategory.message}
                  </p>
                )}
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
              {formState.loading ? "Adding..." : "Add Package"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServicePackageModal;
