import React,{useState,useEffect} from 'react';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
 // Define form schemas for validation
 export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image file is required")
    .optional()
});


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
  import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
 
interface EditBrandDialogProps {
  isEditBrandDialogOpen: boolean;
  setIsEditBrandDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingBrand: { brandName: string; imageUrl: string } | null;
  updateBrand: (data: z.infer<typeof brandSchema>) => void;
}

const EditBrandDialog: React.FC<EditBrandDialogProps> = ({
  isEditBrandDialogOpen,
  setIsEditBrandDialogOpen,
  editingBrand,
  updateBrand,
}) => {
  const editBrandForm = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });
  const [editBrandImagePreview,setEditBrandImagePreview] = useState<string|null>(editingBrand?.imageUrl ?? null);
  useEffect(() => {
    if (editingBrand) {
      editBrandForm.reset({
        name: editingBrand.brandName,
        image: undefined, // or null, based on how you handle it
      });
      setEditBrandImagePreview(editingBrand.imageUrl ?? null);
    }
  }, [editingBrand, editBrandForm]);
  return (
    <Dialog open={isEditBrandDialogOpen} onOpenChange={setIsEditBrandDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Brand</DialogTitle>
          <DialogDescription>
            Update the details of {editingBrand?.brandName}.
          </DialogDescription>
        </DialogHeader>
        <Form {...editBrandForm}>
          <form
            onSubmit={editBrandForm.handleSubmit(updateBrand)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={editBrandForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="edit-name">Brand Name</FormLabel>
                  <FormControl>
                    <Input id="edit-name" {...field}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel htmlFor="edit-image">Brand Logo</FormLabel>
              <FormControl>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      editBrandForm.setValue('image', file);
                      setEditBrandImagePreview(URL.createObjectURL(file))
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
                {/* Image Preview */}
                {editBrandImagePreview && (
              <img
                src={editBrandImagePreview}
                alt="Preview"
                className="mt-2 h-20 w-20 rounded object-contain border"
              />
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditBrandDialogOpen(false)}>
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

export default EditBrandDialog;
