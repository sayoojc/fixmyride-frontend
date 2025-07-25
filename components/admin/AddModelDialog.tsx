import React, { useState } from 'react';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FUEL_TYPES = [
  { id: "petrol", label: "Petrol" },
  { id: "diesel", label: "Diesel" },
  { id: "cng", label: "CNG" },
  { id: "lpg", label: "LPG" },
];

interface AddModelDialogProps {
  isAddModelDialogOpen: boolean;
  setIsAddModelDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addModelForm: any;
  addModel: (data: any) => void;
  brands: { _id: string; brandName: string }[];
}

const AddModelDialog: React.FC<AddModelDialogProps> = ({
  isAddModelDialogOpen,
  setIsAddModelDialogOpen,
  addModelForm,
  addModel,
  brands,
}) => {
  const [modelImagePreview, setModelImagePreview] = useState<string | null>(null);

  const handleDialogToggle = (isOpen: boolean) => {
    if (!isOpen) {
      addModelForm.reset();
      setModelImagePreview(null);
    }
    setIsAddModelDialogOpen(isOpen);
  };

  return (
    <Dialog
      open={isAddModelDialogOpen}
      onOpenChange={handleDialogToggle}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Model</DialogTitle>
          <DialogDescription>Add a new model to an existing brand.</DialogDescription>
        </DialogHeader>
        <Form {...addModelForm}>
          <form onSubmit={addModelForm.handleSubmit(addModel)} className="grid gap-4 py-4">
            {/* Brand Select Field */}
            <FormField
              control={addModelForm.control}
              name="brandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="brand">Brand</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            {/* Model Name Field */}
            <FormField
              control={addModelForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="model-name">Model Name</FormLabel>
                  <FormControl>
                    <Input id="model-name" placeholder="Model name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fuel Types Field */}
            <div className="space-y-2">
              <FormLabel>Supported Fuel Types</FormLabel>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {FUEL_TYPES.map((fuel) => (
                  <FormField
                    key={fuel.id}
                    control={addModelForm.control}
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

            {/* Model Image Field */}
            <FormItem>
              <FormLabel htmlFor="modelImage">Model Image</FormLabel>
              <FormControl>
                <Input
                  id="modelImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      addModelForm.setValue('image', file);
                      setModelImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Image Preview */}
            {modelImagePreview && (
              <img
                src={modelImagePreview}
                alt="Preview"
                className="mt-2 h-20 w-20 rounded object-contain border"
              />
            )}

            {/* Dialog Footer */}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModelDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Model</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddModelDialog;