import React, { useEffect, useState } from 'react';
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
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Validation schema
const modelSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image file is required")
    
});

type ModelFormType = z.infer<typeof modelSchema>;

interface EditModelDialogProps {
  isEditModelDialogOpen: boolean;
  setIsEditModelDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingModel: { name: string; imageUrl: string } | null;
  updateModel: (data: ModelFormType) => void;
}

const EditModelDialog: React.FC<EditModelDialogProps> = ({
  isEditModelDialogOpen,
  setIsEditModelDialogOpen,
  editingModel,
  updateModel,
}) => {
  const editModelForm = useForm<ModelFormType>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });

  const [editModelImagePreview, setEditModelImagePreview] = useState<string | null>(
    editingModel?.imageUrl ?? null
  );

  useEffect(() => {
    if (editingModel) {
      editModelForm.reset({
        name: editingModel.name,
        image: undefined,
      });
      setEditModelImagePreview(editingModel.imageUrl ?? null);
    }
  }, [editingModel, editModelForm]);

  return (
    <Dialog open={isEditModelDialogOpen} onOpenChange={setIsEditModelDialogOpen}>
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
              <Button variant="outline" onClick={() => setIsEditModelDialogOpen(false)}>
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
