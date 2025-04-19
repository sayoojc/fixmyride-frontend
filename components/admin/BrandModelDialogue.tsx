import React from 'react';
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
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";

  interface Model {
    _id: string;
    name: string;
    imageUrl: string;
    status: "active" | "blocked";
    createdAt: string;
  }
  
  interface Brand {
    _id: string;
    brandName: string;
    status: "active" | "blocked";
    imageUrl: string;
    models: Model[];
    createdAt: string;
  }
import { Brand, Model, FormMethods } from './types'; // define necessary types

type BrandModelDialogProps = {
  open: boolean;
  onClose: () => void;
  type: 'brand' | 'model';
  mode: 'add' | 'edit';
  form: FormMethods;
  onSubmit: (data: any) => void;
  editingItem?: Brand | Model | null;
  brands?: Brand[]; // Only for model type
};

const BrandModelDialog: React.FC<BrandModelDialogProps> = ({
  open,
  onClose,
  type,
  mode,
  form,
  onSubmit,
  editingItem,
  brands,
}) => {

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? `Add New ${type === 'brand' ? 'Brand' : 'Model'}` : `Edit ${type === 'brand' ? 'Brand' : 'Model'}`}</DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? `Enter the details of the new ${type === 'brand' ? 'brand' : 'model'} to add it to the system.`
              : `Update the details of ${editingItem?.name || ''}.`
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {type === 'brand' ? (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Brand Name</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="Toyota" {...field} defaultValue={editingItem?.name || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          form.setValue('image', file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="brand">Brand</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                          <SelectTrigger id="brand">
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {brands?.map((brand) => (
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
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="model-name">Model Name</FormLabel>
                      <FormControl>
                        <Input id="model-name" placeholder="Model name" {...field} defaultValue={editingItem?.name || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          form.setValue('image', file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{mode === 'add' ? `Add ${type === 'brand' ? 'Brand' : 'Model'}` : `Save Changes`}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BrandModelDialog;
