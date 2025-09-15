import React, { useEffect } from 'react';
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
  modelImagePreview: string | null;
  setModelImagePreview: (prev: string | null) => void;
}

const AddModelDialog: React.FC<AddModelDialogProps> = ({
  isAddModelDialogOpen,
  setIsAddModelDialogOpen,
  addModelForm,
  addModel,
  brands,
  modelImagePreview,
  setModelImagePreview
}) => {
useEffect(() => {
    if (isAddModelDialogOpen) {
      addModelForm.reset();
      setModelImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isAddModelDialogOpen, addModelForm, setModelImagePreview]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const clearFormAndPreview = () => {
    addModelForm.reset();
    addModelForm.setValue('image', undefined);
    setModelImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDialogToggle = (isOpen: boolean) => {
    if (!isOpen) {
      clearFormAndPreview();
    }
    setIsAddModelDialogOpen(isOpen);
  };

  const handleModelSubmit = (data: any) => {
    clearFormAndPreview();
    addModel(data);
    
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
          <form onSubmit={addModelForm.handleSubmit(handleModelSubmit)} className="grid gap-4 py-4">
            {/* Brand Select Field */}
            <FormField
              control={addModelForm.control}
              name="brandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="brand">Brand</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
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
                  ref={fileInputRef} // Add the ref here
                  id="modelImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      addModelForm.setValue('image', file);
                      setModelImagePreview(URL.createObjectURL(file));
                    } else {
                      addModelForm.setValue('image', undefined);
                      setModelImagePreview(null);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Image Preview */}
            {modelImagePreview && (
              <div className="relative">
                <img
                  src={modelImagePreview}
                  alt="Preview"
                  className="mt-2 h-20 w-20 rounded object-contain border"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={clearFormAndPreview}
                >
                  Clear Image
                </Button>
              </div>
            )}

            {/* Dialog Footer */}
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsAddModelDialogOpen(false)}>
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