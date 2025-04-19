{/* Add Brand Dialog */}
{/* <Dialog
open={isAddBrandDialogOpen}
onOpenChange={(isOpen) =>
  handleDialogToggle(isOpen, setIsAddBrandDialogOpen, () => addBrandForm.reset(), () =>
    setBrandImagePreview(null)
  )
}
>
<DialogContent className="sm:max-w-[600px]">
  <DialogHeader>
    <DialogTitle>Add New Brand</DialogTitle>
    <DialogDescription>Enter the details of the new brand to add it to the system.</DialogDescription>
  </DialogHeader>
  <Form {...addBrandForm}>
    <form onSubmit={addBrandForm.handleSubmit(addBrand)} className="grid gap-4 py-4">
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
      {brandImagePreview && (
        <img
          src={brandImagePreview}
          alt="Preview"
          className="mt-2 h-20 w-20 rounded object-contain border"
        />
      )}
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsAddBrandDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">Add Brand</Button>
      </DialogFooter>
    </form>
  </Form>
</DialogContent>
</Dialog> */}

{/* Edit Brand Dialog */}
{/* <Dialog open={isEditBrandDialogOpen} onOpenChange={setIsEditBrandDialogOpen}>
<DialogContent className="sm:max-w-[600px]">
  <DialogHeader>
    <DialogTitle>Edit Brand</DialogTitle>
    <DialogDescription>Update the details of {editingBrand?.brandName}.</DialogDescription>
  </DialogHeader>
  <Form {...editBrandForm}>
  <form
onSubmit={editBrandForm.handleSubmit(() => {
if (editingBrand) {
  updateBrand(editingBrand);
}
})}
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
                editBrandForm.setValue("image", file);
              }
            }}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsEditBrandDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  </Form>
</DialogContent>
</Dialog> */}

{/* Add Model Dialog */}
{/* <Dialog
open={isAddModelDialogOpen}
onOpenChange={(isOpen) =>
  handleDialogToggle(isOpen, setIsAddModelDialogOpen, () => addModelForm.reset(), () =>
    setModelImagePreview(null)
  )
}
>
<DialogContent className="sm:max-w-[600px]">
  <DialogHeader>
    <DialogTitle>Add New Model</DialogTitle>
    <DialogDescription>Add a new model to an existing brand.</DialogDescription>
  </DialogHeader>
  <Form {...addModelForm}>
    <form onSubmit={addModelForm.handleSubmit(addModel)} className="grid gap-4 py-4">
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
                addModelForm.setValue("image", file);
                setModelImagePreview(URL.createObjectURL(file));
              }
            }}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
      {modelImagePreview && (
        <img
          src={modelImagePreview}
          alt="Preview"
          className="mt-2 h-20 w-20 rounded object-contain border"
        />
      )}
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsAddModelDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">Add Model</Button>
      </DialogFooter>
    </form>
  </Form>
</DialogContent>
</Dialog>  */}