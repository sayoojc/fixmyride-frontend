import React from 'react';
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

  import { useForm } from "react-hook-form";



interface EditModelDialogProps {
  isEditModelDialogOpen: boolean;
  setIsEditModelDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingModel: { name: string; imageUrl: string } | null;
  editModelForm: any; // Replace with the actual type for your form
  updateModel: (data: { name: string; image: string | File }) => void;
}

const EditModelDialog: React.FC<EditModelDialogProps> = ({
  isEditModelDialogOpen,
  setIsEditModelDialogOpen,
  editingModel,
  editModelForm,
  updateModel,
}) => {
 
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
            onSubmit={editModelForm.handleSubmit(() => {
              if (editingModel) {
                updateModel({
                  name: editingModel.name,
                  image: editingModel.imageUrl,
                });
              }
            })}
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
                      editModelForm.setValue('image', file);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
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
