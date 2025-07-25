import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosPrivate } from "@/api/axios";
import { axiosPublic } from "@/api/axiosPublic";
import createAdminApi from "@/services/adminApi";
import createimageUploadApi from "@/services/imageUploadApi";
const imageUploadApi = createimageUploadApi(axiosPublic);
const adminApi = createAdminApi(axiosPrivate);
import { Brand } from "@/types/editBrandInterface";
import { toast } from "react-toastify";
import { ModelType } from "@/types/editBrandInterface";
import { modelSchema } from "@/schema/editModel.schema";
import { FUEL_TYPES } from "@/constants/fuelTypes";
type ModelFormType = z.infer<typeof modelSchema>;

interface EditModelDialogProps {
  isEditModelDialogOpen: boolean;
  setIsEditModelDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingModel: {
    name: string;
    imageUrl: string;
    _id: string;
    brand: string;
    fuelTypes: string[];
  } | null;
  brands: { _id: string; brandName: string }[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
  setEditingModel: React.Dispatch<React.SetStateAction<ModelType | null>>;
}

const EditModelDialog: React.FC<EditModelDialogProps> = ({
  isEditModelDialogOpen,
  setIsEditModelDialogOpen,
  editingModel,
  brands,
  setBrands,
  setEditingModel,
}) => {
  const editModelForm = useForm<ModelFormType>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      name: "",
      image: new File([], ""),
      brandId: "",
      fuelTypes: [],
    },
  });

  const [editModelImagePreview, setEditModelImagePreview] = useState<
    string | null
  >(editingModel?.imageUrl ?? null);

  useEffect(() => {
    if (editingModel && brands.length > 0) {
      const matchedBrand = brands.find(
        (b) => b.brandName === editingModel.brand
      );

      console.log("editing model from the modal", editingModel);
      editModelForm.reset({
        name: editingModel.name,
        image: new File([], ""),
        fuelTypes: editingModel.fuelTypes,
        brandId: matchedBrand?._id || "",
      });

      setEditModelImagePreview(editingModel.imageUrl ?? null);
    }
  }, [editingModel, brands, editModelForm]);

  const watchedValues = editModelForm.watch();
  useEffect(() => {
    console.log("the watched value", watchedValues);
  }, [watchedValues]);

  const updateModel = async (updatedModelData: {
    name: string;
    fuelTypes: string[];
    brandId: string;
    image: File | undefined;
  }) => {
    if (!editingModel) {
      return;
    }

    try {
      let imageUrl = editingModel.imageUrl;
      if (updatedModelData.image && updatedModelData.image?.size > 0) {
        try {
          imageUrl = await imageUploadApi.uploadBrandImageApi(
            updatedModelData.image
          );
        } catch (error) {
          toast.error("Image upload failed");
          console.error("Image upload error:", error);
          return;
        }
      }
      const response = await adminApi.updateModelApi(
        editingModel._id,
        updatedModelData.name,
        imageUrl,
        updatedModelData.fuelTypes,
        updatedModelData.brandId
      );

      const updatedModel = response?.data?.model;
      if (!updatedModel) {
        toast.error("Model update failed");
        console.warn("Model update failed or response malformed");
        return;
      }
      setBrands((prevBrands) => {
        const newBrands = [...prevBrands];
        const oldBrandIndex = newBrands.findIndex((brand) =>
          brand.models.some((model) => model._id === editingModel._id)
        );

        const newBrandIndex = newBrands.findIndex(
          (brand) => brand._id === updatedModel.brandId
        );
        if (
          oldBrandIndex !== -1 &&
          newBrandIndex !== -1 &&
          oldBrandIndex !== newBrandIndex
        ) {
          newBrands[oldBrandIndex] = {
            ...newBrands[oldBrandIndex],
            models: newBrands[oldBrandIndex].models.filter(
              (model) => model._id !== updatedModel._id
            ),
          };
          newBrands[newBrandIndex] = {
            ...newBrands[newBrandIndex],
            models: [...newBrands[newBrandIndex].models, updatedModel],
          };
        } else {
          const targetBrandIndex =
            oldBrandIndex !== -1 ? oldBrandIndex : newBrandIndex;
          if (targetBrandIndex !== -1) {
            newBrands[targetBrandIndex] = {
              ...newBrands[targetBrandIndex],
              models: newBrands[targetBrandIndex].models.map((model) =>
                model._id === updatedModel._id ? updatedModel : model
              ),
            };
          }
        }

        return newBrands;
      });
      toast.success("Model updated successfully");
      setIsEditModelDialogOpen(false);
      setEditingModel(null);
      editModelForm.reset();
    } catch (error) {
      toast.error("Failed to update model");
      console.error("Error updating model:", error);
    }
  };
  return (
    <Dialog
      open={isEditModelDialogOpen}
      onOpenChange={setIsEditModelDialogOpen}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Model</DialogTitle>
          <DialogDescription>
            Update the details of {editingModel?.name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...editModelForm}>
          <form
            onSubmit={editModelForm.handleSubmit(updateModel)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={editModelForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="edit-name">Model Name</FormLabel>
                  <FormControl>
                    <Input id="edit-name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editModelForm.control}
              name="brandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="brand">Brand</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="brand">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem value={brand._id} key={brand._id}>
                            {brand.brandName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Supported Fuel Types</FormLabel>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {FUEL_TYPES.map((fuel) => (
                  <FormField
                    key={fuel.id}
                    control={editModelForm.control}
                    name="fuelTypes"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={fuel.id}
                          className="flex flex-row items-center space-x-2 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={(field.value || []).includes(fuel.id)}
                              onCheckedChange={(checked) => {
                                const updatedFuelTypes = checked
                                  ? [...(field.value || []), fuel.id]
                                  : (field.value || []).filter(
                                      (value: string) => value !== fuel.id
                                    );
                                field.onChange(updatedFuelTypes);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-normal">
                            {fuel.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </div>
            <FormItem>
              <FormLabel htmlFor="edit-image">Model Image</FormLabel>
              <FormControl>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      editModelForm.setValue("image", file);
                      setEditModelImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {editModelImagePreview && (
              <img
                src={editModelImagePreview}
                alt="Preview"
                className="mt-2 h-20 w-20 rounded object-contain border"
              />
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditModelDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModelDialog;
