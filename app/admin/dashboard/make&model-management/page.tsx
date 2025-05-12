"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import BrandList from "@/components/admin/BrandList";
import AddBrandDialog from "@/components/admin/AddBrandDialog";
import AddModelDialog from "@/components/admin/AddModelDialog";
import DashboardHeader from "@/components/admin/DashboardHeader";
import EditBrandDialog from "@/components/admin/EditBrandDialogue";
import EditModelDialog from "@/components/admin/EditModelDialog";
import createAdminApi from "@/services/adminApi";
import { axiosPrivate } from "@/api/axios";

const adminApi = createAdminApi(axiosPrivate);

import createimageUploadApi from "@/services/imageUploadApi";
import { axiosPublic } from "@/api/axiosPublic";
const imageUploadApi = createimageUploadApi(axiosPublic);


import { Badge } from "@/components/ui/badge";
import {
  Pagination,
} from "@/components/ui/pagination";


// Define interfaces
interface Model {
  _id: string;
  name: string;
  imageUrl: string;
  status: "active" | "blocked";
 
}

interface Brand {
  _id: string;
  brandName: string;
  status: "active" | "blocked";
  imageUrl: string;
  models: Model[];
 
}

// Define form schemas for validation
export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image file is required"),
});

const modelSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  brandId: z.string().min(1, "Brand is required"),
  image: z
  .instanceof(File)
  .refine((file) => file.size > 0, "Image file is required"),
   fuelTypes: z.array(z.string()).min(1, "At least one fuel type is required"),
});




const BrandModelManagement: React.FC = () => {
  // State management
  const [brandImagePreview, setBrandImagePreview] = useState<string | null>(null);
  const [modelImagePreview,setModelImagePreview] = useState<string  | null>(null);
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isAddBrandDialogOpen, setIsAddBrandDialogOpen] = useState<boolean>(false);
  const [isAddModelDialogOpen, setIsAddModelDialogOpen] = useState<boolean>(false);
  const [isEditBrandDialogOpen, setIsEditBrandDialogOpen] = useState<boolean>(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isEditModelDialogOpen, setIsEditModelDialogOpen] = useState<boolean>(false);
  const [editingModel, setEditingModel] = useState<{ name: string; imageUrl: string,_id:string } | null>(null);

  const editModelForm = useForm({
    defaultValues: {
      name: "",
      image: null,
    },
  });

  const itemsPerPage = 10;

  // Initialize forms
  const addBrandForm = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      image:undefined,
    },
  });


  const editBrandForm = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });

  const addModelForm = useForm<z.infer<typeof modelSchema>>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      name: "",
      brandId: "",
      image: undefined,
    },
  });

  const handleDialogChange = (isOpen: boolean) => {
    setIsAddBrandDialogOpen(isOpen);
    if (!isOpen) {
      // Reset form values
      addBrandForm.reset();
      setBrandImagePreview(null);
    }
  };

  const handleDialogToggle = (
    isOpen: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    resetForm?: () => void,
    resetImagePreview?: () => void
  ) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm?.();
      resetImagePreview?.();
    }
  };
  

  // Load brands on component mount
  useEffect(() => {
    const fetchBrandsWithModels = async () => {
      try {
        console.log('calling get brands api');
       const brands = await adminApi.getBrandsApi();
       console.log('brands',brands.brand);
        setBrands(brands.brand);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandsWithModels();
  }, []);

  // Set edit form values when editingBrand changes
  useEffect(() => {
    if (editingBrand) {
      editBrandForm.reset({
        name: editingBrand.brandName,
        image: undefined,
      });
    }
  }, [editingBrand, editBrandForm]);

  // Get status badge variant
  const getStatusBadge = (status: "active" | "blocked") => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "blocked":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Blocked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Filter brands based on search and status

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch = brand.brandName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || brand.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  Pagination
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // CRUD operations
  const addBrand = async (brandData: z.infer<typeof brandSchema>) => {

    try {
     const imageUrl = await imageUploadApi.uploadBrandImageApi(brandData.image);
      const newBrand = await adminApi.AddBrandApi(brandData.name,imageUrl);
      setBrands([...brands, newBrand]);
      setIsAddBrandDialogOpen(false);
      addBrandForm.reset();
    } catch (error) {
      console.error("Error adding brand:", error);
    }
   
  };


  const updateBrand = async (updatedBrandData: z.infer<typeof brandSchema>) => {
    console.log('updatebrand function fired');
    if (!editingBrand) return;
     try {
      console.log('updated brand data',updatedBrandData);
      let imageUrl = editingBrand.imageUrl;

   
    if (updatedBrandData.image && updatedBrandData.image.size > 0) {
      imageUrl = await imageUploadApi.uploadBrandImageApi(updatedBrandData.image);
    }
      
      // Call API to update brand
      const response = await adminApi.updateBrandApi(
        editingBrand._id, 
        updatedBrandData.name, 
        imageUrl
      );
      
      // Update state with new data
      setBrands(brands.map(brand => 
        brand._id === editingBrand._id 
          ? { ...brand, brandName: updatedBrandData.name, imageUrl } 
          : brand
      ));
      
      setIsEditBrandDialogOpen(false);
      setEditingBrand(null);
      editBrandForm.reset();
    } catch (error) {
      console.error("Error updating brand:", error);
    }
  };
  
  const toggleBrandStatus = async (brandId: string) => {
    try {
      const brand = brands.find(b => b._id === brandId);
      if (!brand) return;
      const newStatus = brand.status === "active" ? "blocked" : "active";
      const response = await adminApi.updateBrandStatusApi(brandId, newStatus);
      console.log({response})
      if (response && response.status === 200) {
        setBrands(brands.map(brand =>
          brand._id === brandId
            ? { ...brand, status: newStatus }
            : brand
        ));
      } else {
        console.warn("Failed to update brand status.");
      }
    } catch (error) {
      console.error(`Error toggling brand status:`, error);
    }
  };

  const toggleModelStatus = async (brandId: string, modelId: string, newStatus: "active" | "blocked") => {
    try {
      const response = await adminApi.updateModelStatusApi(brandId, modelId, newStatus);
      const updatedModel = response?.data.model;
      if (!updatedModel) {
        console.warn("Model status update failed or response malformed");
        return;
      }
      setBrands(prevBrands =>
        prevBrands.map(brand => {
          if (brand._id !== brandId) return brand;
  
          const updatedModels = brand.models.map(model =>
            model._id === modelId ? { ...model, status: updatedModel.status } : model
          );
  
          return { ...brand, models: updatedModels };
        })
      );
    } catch (error) {
      console.error(`Error toggling model status:`, error);
    }
  };
  

  const addModel = async(modelData: z.infer<typeof modelSchema>) => {

    const imageUrl = await imageUploadApi.uploadBrandImageApi(modelData.image);
    console.log('The image url from the add model',imageUrl);
     const response = await adminApi.AddModelApi(modelData.name,imageUrl,modelData.brandId,modelData.fuelTypes);
     console.log('response',response);
        
     setBrands((prevBrands) => 
      prevBrands.map((brand) => {
        if(brand._id === modelData.brandId){
          const updatedModels = brand.models ? [...brand.models,response] :[response];
          return {...brand,models:updatedModels}
        }
        return brand;
      })
    )
    setIsAddModelDialogOpen(false);
    addModelForm.reset();
  };


  const updateModel = async (updatedModelData: z.infer<typeof modelSchema>) => {
    console.log("updateModel function fired");
    if (!editingModel) return;
  
    try {
      console.log("Updated model data", updatedModelData);
      let imageUrl = editingModel.imageUrl;
  
      // Upload image if a new one is selected
      if (updatedModelData.image && updatedModelData.image.size > 0) {
        imageUrl = await imageUploadApi.uploadBrandImageApi(updatedModelData.image);
      }
  
      // API call to update model
      const response = await adminApi.updateModelApi(
        editingModel._id,
        updatedModelData.name,
        imageUrl
      );
  
      const updatedModel = response?.data?.model;
      if (!updatedModel) {
        console.warn("Model update failed or response malformed");
        return;
      }
  
      // Update state
      setBrands(prevBrands =>
        prevBrands.map(brand => {
          // Only update the brand that owns the model
          const hasModel = brand.models.some(model => model._id === editingModel._id);
          if (!hasModel) return brand;
  
          const updatedModels = brand.models.map(model =>
            model._id === editingModel._id ? updatedModel : model
          );
  
          return { ...brand, models: updatedModels };
        })
      );
  
      // Reset form and close dialog
      setIsEditModelDialogOpen(false);
      setEditingModel(null);
      editModelForm.reset();
    } catch (error) {
      console.error("Error updating model:", error);
    }
  };
  
  

  return (
<div className="flex h-screen bg-slate-50">
  <div className="flex-1 md:ml-64 transition-all duration-200 ease-in-out overflow-y-auto">
    {/* Top header */}
    <DashboardHeader
        setIsAddBrandDialogOpen={setIsAddBrandDialogOpen}
        setIsAddModelDialogOpen={setIsAddModelDialogOpen}
      />
  
    <BrandList
      brands={brands}
      loading={loading}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      toggleBrandStatus={toggleBrandStatus}
      toggleModelStatus={toggleModelStatus}
      getStatusBadge={getStatusBadge}
      setIsEditBrandDialogOpen = {setIsEditBrandDialogOpen}
      setEditingBrand = {setEditingBrand}
      setEditingModel = {setEditingModel}
      setIsEditModelDialogOpen = {setIsEditModelDialogOpen}
      
    />
  </div>

  {/* Add Brand Dialog */}
  <AddBrandDialog
        isAddBrandDialogOpen={isAddBrandDialogOpen}
        setIsAddBrandDialogOpen={setIsAddBrandDialogOpen}
        addBrandForm={addBrandForm}
        addBrand={addBrand}
      />
  
  {/* Edit Brand Dialog */}
  <EditBrandDialog
        isEditBrandDialogOpen={isEditBrandDialogOpen}
        setIsEditBrandDialogOpen={setIsEditBrandDialogOpen}
        editingBrand={editingBrand}
        editBrandForm={editBrandForm}
        updateBrand={updateBrand}
      />
 
  {/* Add Model Dialog */}
  
  <AddModelDialog
        isAddModelDialogOpen={isAddModelDialogOpen}
        setIsAddModelDialogOpen={setIsAddModelDialogOpen}
        addModelForm={addModelForm}
        addModel={addModel}
        brands={brands}
      />

<div>
      <button onClick={() => setIsEditModelDialogOpen(true)}>Edit Model</button>

      <EditModelDialog
        isEditModelDialogOpen={isEditModelDialogOpen}
        setIsEditModelDialogOpen={setIsEditModelDialogOpen}
        editingModel={editingModel}
        editModelForm={editModelForm}
        updateModel={updateModel}
      />
    </div>
  
</div>


    
  );
};

export default BrandModelManagement;