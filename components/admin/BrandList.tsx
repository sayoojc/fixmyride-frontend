import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Model {
  brand:string,
  fuelTypes:[string]
  _id: string;
  name: string;
  imageUrl: string;
  status: "active" | "blocked";
}

interface Brand {
  _id: string;
  brandName: string;
  imageUrl: string;
  status: "active" | "blocked";
  models: Model[];
}

interface BrandListProps {
  setCurrentPage:(state:number) =>void;
  currentPage:number;
  brands: Brand[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  totalPages: number;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  toggleBrandStatus: (brandId: string) => void;
  toggleModelStatus: (
    brandId: string,
    modelId: string,
    status: "active" | "blocked"
  ) => void;
  getStatusBadge: (status: "active" | "blocked") => React.ReactNode;
  setIsEditBrandDialogOpen: (status: boolean) => void;
  setEditingBrand: (brand: Brand) => void;
  setEditingModel: (model: Model) => void;
  setIsEditModelDialogOpen: (status: boolean) => void;
}

const BrandList: React.FC<BrandListProps> = ({
  setCurrentPage,
  currentPage,
  brands,
  loading,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  totalPages,
  toggleBrandStatus,
  toggleModelStatus,
  getStatusBadge,
  setIsEditBrandDialogOpen,
  setEditingBrand,
  setEditingModel,
  setIsEditModelDialogOpen,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const handleBrandClick = (brand: Brand) => {
    setSelectedBrand(selectedBrand === brand ? null : brand);
  };
 
  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            placeholder="Search brands..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter}  onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          <Button onClick={() => setStatusFilter('all')}>Reset</Button>
        </div>
      </div>

      {/* Brands Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.length > 0 ? (
              brands.map((brand) => (
                <React.Fragment key={brand._id}>
                  {/* Brand row */}
                  <TableRow className="bg-slate-50">
                    <TableCell className="font-semibold">
                      <img
                        src={brand.imageUrl}
                        alt={`${brand.brandName} logo`}
                        className="h-10 w-10 object-contain cursor-pointer"
                        onClick={() => handleBrandClick(brand)}
                      />
                    </TableCell>
                    <TableCell>{brand.brandName}</TableCell>
                    <TableCell>{getStatusBadge(brand.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">More</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => toggleBrandStatus(brand._id)}
                          >
                            {brand.status === "active"
                              ? "Block Brand"
                              : "Unblock Brand"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingBrand(brand);
                              setIsEditBrandDialogOpen(true);
                            }}
                          >
                            Edit Brand
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Show models if the brand is selected */}
                  {selectedBrand && selectedBrand._id === brand._id && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Model Name</TableHead>
                              <TableHead>Image</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {brand.models.length > 0 ? (
                              brand.models.map((model) => (
                                <TableRow key={model._id}>
                                  <TableCell>{model.name}</TableCell>
                                  <TableCell>
                                    <img
                                      src={model.imageUrl}
                                      alt={`${model.name} image`}
                                      className="h-10 w-10 object-contain"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {getStatusBadge(model.status)}
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost">More</Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuLabel>
                                          Actions
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            toggleModelStatus(
                                              brand._id,
                                              model._id,
                                              model.status === "active"
                                                ? "blocked"
                                                : "active"
                                            )
                                          }
                                        >
                                          {model.status === "active"
                                            ? "Block Model"
                                            : "Unblock Model"}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setEditingModel({name:model.name,
                                              fuelTypes:model.fuelTypes,
                                              imageUrl:model.imageUrl,
                                              brand:brand.brandName,
                                              _id:model._id,
                                              status:model.status                               
                                            });
                                            setIsEditModelDialogOpen(true);
                                          }}
                                        >
                                          edit Model
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4}>
                                  No models found for this brand.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  No brands found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
<div className="flex justify-center items-center gap-4 mt-6">
  {/* Minus / Prev Button */}
  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-4 py-2 rounded-md border text-sm font-medium ${
      currentPage === 1
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-white hover:bg-gray-100 text-gray-800 border-gray-300"
    }`}
  >
    Prev
  </button>

  {/* Current Page Display */}
  <span className="px-4 py-2 border rounded-md text-sm font-semibold bg-blue-100 text-blue-700">
    Page {currentPage}
  </span>

  {/* Plus / Next Button */}
  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`px-4 py-2 rounded-md border text-sm font-medium ${
      currentPage === totalPages
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-white hover:bg-gray-100 text-gray-800 border-gray-300"
    }`}
  >
    Next
  </button>
</div>


    </div>
  );
};

export default BrandList;
