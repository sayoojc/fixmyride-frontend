import React, { useState } from "react";
import { brandSchema } from "@/types/brandModelManagement.interface";
import { z } from "zod"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface AddBrandDialogProps {
  isAddBrandDialogOpen: boolean;
  setIsAddBrandDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addBrandForm: UseFormReturn<z.infer<typeof brandSchema>>;
  addBrand: (data: z.infer<typeof brandSchema>) => void;
}

const AddBrandDialog: React.FC<AddBrandDialogProps> = ({
  isAddBrandDialogOpen,
  setIsAddBrandDialogOpen,
  addBrandForm,
  addBrand,
}) => {
  const [brandImagePreview, setBrandImagePreview] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleDialogToggle = (isOpen: boolean) => {
    if (!isOpen) {
      addBrandForm.reset();
      setBrandImagePreview(null);
    }
    setIsAddBrandDialogOpen(isOpen);
  };

  

    if(loading) {
        return  (
                  <div className="spinner center">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="spinner-blade"></div>
                    ))}
                  </div>
                )
    } else  {
return (
    <Dialog open={isAddBrandDialogOpen} onOpenChange={handleDialogToggle}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Brand</DialogTitle>
          <DialogDescription>
            Enter the details of the new brand to add it to the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...addBrandForm}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                await addBrandForm.handleSubmit(addBrand)(e);
                setBrandImagePreview(null);
              } finally {
                setLoading(false);
              }
            }}
          >
            {/* Brand Name Field */}
            <FormField
              control={addBrandForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Brand Name</FormLabel>
                  <FormControl>
                    <Input id="name" placeholder="Toyota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Brand Logo Field */}
            <FormItem>
              <FormLabel htmlFor="image">Brand Logo</FormLabel>
              <FormControl>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      addBrandForm.setValue("image", file);
                      setBrandImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Image Preview */}
            {brandImagePreview && (
              <img
                src={brandImagePreview}
                alt="Preview"
                className="mt-2 h-20 w-20 rounded object-contain border"
              />
            )}

            {/* Dialog Footer */}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddBrandDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Add Brand
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
    }
  
};

export default AddBrandDialog;
