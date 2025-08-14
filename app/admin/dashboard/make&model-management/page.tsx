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
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Brand } from "@/types/editBrandInterface";
import { ModelType } from "@/types/editBrandInterface";
import { AxiosError } from "axios";
import {
  brandSchema,
  modelSchema,
} from "@/types/brandModelManagement.interface";

const BrandModelManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddBrandDialogOpen, setIsAddBrandDialogOpen] =
    useState<boolean>(false);
  const [isAddModelDialogOpen, setIsAddModelDialogOpen] =
    useState<boolean>(false);
  const [isEditBrandDialogOpen, setIsEditBrandDialogOpen] =
    useState<boolean>(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isEditModelDialogOpen, setIsEditModelDialogOpen] =
    useState<boolean>(false);
  const [editingModel, setEditingModel] = useState<ModelType | null>(null);
  const addBrandForm = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      image: undefined,
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

  useEffect(() => {
    const fetchBrandsWithModels = async () => {
      try {
        const brands = await adminApi.getBrandsApi(
          searchTerm,
          currentPage,
          statusFilter
        );
        setBrands(brands.BrandObject.formattedBrands);
        setCurrentPage(currentPage);
        setTotalPages(brands.BrandObject.totalPage);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandsWithModels();
  }, [searchTerm, currentPage, statusFilter]);

  useEffect(() => {
    if (editingBrand) {
      editBrandForm.reset({
        name: editingBrand.brandName,
        image: undefined,
      });
    }
  }, [editingBrand, editBrandForm]);

  const getStatusBadge = (status: "active" | "blocked") => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "blocked":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Blocked
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const addBrand = async (brandData: z.infer<typeof brandSchema>) => {
    try {
      if (!brandData.image) {
        toast.error("please select an image");
        return;
      }
      const imageUrl = await imageUploadApi.uploadBrandImageApi(
        brandData.image
      );
      const response = await adminApi.AddBrandApi(brandData.name, imageUrl);
      setBrands([...brands, response.brand]);
      toast.success("Brand Added Successfully");
      setIsAddBrandDialogOpen(false);
      addBrandForm.reset();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Adding brand failed!");
    }
  };

  const updateBrand = async (updatedBrandData: z.infer<typeof brandSchema>) => {
    if (!editingBrand) return;
    try {
      let imageUrl = editingBrand.imageUrl;

      if (updatedBrandData.image && updatedBrandData.image.size > 0) {
        imageUrl = await imageUploadApi.uploadBrandImageApi(
          updatedBrandData.image
        );
      }
      await adminApi.updateBrandApi(
        editingBrand._id,
        updatedBrandData.name,
        imageUrl
      );
      setBrands(
        brands.map((brand) =>
          brand._id === editingBrand._id
            ? { ...brand, brandName: updatedBrandData.name, imageUrl }
            : brand
        )
      );
      toast.success("Brand Updated Successfully");
      setIsEditBrandDialogOpen(false);
      setEditingBrand(null);
      editBrandForm.reset();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Adding brand failed!");
    }
  };

  const toggleBrandStatus = async (brandId: string) => {
    try {
      const brand = brands.find((b) => b._id === brandId);
      if (!brand) return;
      const newStatus = brand.status === "active" ? "blocked" : "active";
      const response = await adminApi.updateBrandStatusApi(brandId, newStatus);
      if (response && response.status === 200) {
        setBrands(
          brands.map((brand) => {
            if (brand._id === brandId) {
              return {
                ...brand,
                status: newStatus,
                models: brand.models.map((model) => ({
                  ...model,
                  status: newStatus,
                })),
              };
            } else {
              return brand;
            }
          })
        );
        toast.success("Brand Updated Successfully");
      } else {
        console.warn("Failed to update brand status.");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(
        err.response?.data?.message || "updating brand status failed!"
      );
    }
  };

  const toggleModelStatus = async (
    brandId: string,
    modelId: string,
    newStatus: "active" | "blocked"
  ) => {
    try {
      const response = await adminApi.updateModelStatusApi(
        brandId,
        modelId,
        newStatus
      );
      const updatedModel = response?.data.model;
      if (!updatedModel) {
        console.warn("Model status update failed or response malformed");
        return;
      }
      toast.success("Model updated Successfully");

      setBrands((prevBrands) =>
        prevBrands.map((brand) => {
          if (brand._id !== brandId) return brand;

          const updatedModels = brand.models.map((model) =>
            model._id === modelId
              ? { ...model, status: updatedModel.status }
              : model
          );

          return { ...brand, models: updatedModels };
        })
      );
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(
        err.response?.data?.message || "updating model status failed!"
      );
    }
  };

  const addModel = async (modelData: z.infer<typeof modelSchema>) => {
    try {
      const imageUrl = await imageUploadApi.uploadBrandImageApi(
        modelData.image
      );
      const response = await adminApi.AddModelApi(
        modelData.name,
        imageUrl,
        modelData.brandId,
        modelData.fuelTypes
      );
      toast.success("Model Added Successfully");
      setBrands((prevBrands) =>
        prevBrands.map((brand) => {
          if (brand._id === modelData.brandId) {
            const updatedModels = brand.models
              ? [...brand.models, response.model]
              : [response.model];
            return { ...brand, models: updatedModels };
          }
          return brand;
        })
      );
      setIsAddModelDialogOpen(false);
      addModelForm.reset();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Adding model failed!");
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
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          brands={brands}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          toggleBrandStatus={toggleBrandStatus}
          toggleModelStatus={toggleModelStatus}
          getStatusBadge={getStatusBadge}
          setIsEditBrandDialogOpen={setIsEditBrandDialogOpen}
          setEditingBrand={setEditingBrand}
          setEditingModel={setEditingModel}
          setIsEditModelDialogOpen={setIsEditModelDialogOpen}
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

      <EditModelDialog
        isEditModelDialogOpen={isEditModelDialogOpen}
        setIsEditModelDialogOpen={setIsEditModelDialogOpen}
        editingModel={editingModel}
        setBrands={setBrands}
        brands={brands}
        setEditingModel={setEditingModel}
      />
    </div>
  );
};

export default BrandModelManagement;
