import React, { useState } from 'react';

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
import { set } from 'react-hook-form';

interface Model {
  _id: string;
  name: string;
  imageUrl: string;
  status: 'active' | 'blocked';
}

interface Brand {
  _id: string;
  brandName: string;
  imageUrl: string;
  status: 'active' | 'blocked';
  models: Model[];
}

interface BrandListProps {
  brands: Brand[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  toggleBrandStatus: (brandId: string) => void;
  toggleModelStatus: (brandId: string, modelId: string, status: 'active' | 'blocked') => void;
  getStatusBadge: (status: 'active' | 'blocked') => React.ReactNode;
  setIsEditBrandDialogOpen:(status:boolean) => void;
  setEditingBrand:(brand:Brand) => void;
}

const BrandList: React.FC<BrandListProps> = ({
  brands,
  loading,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  toggleBrandStatus,
  toggleModelStatus,
  getStatusBadge,
  setIsEditBrandDialogOpen,
  setEditingBrand
}) => {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const handleBrandClick = (brand: Brand) => {
    setSelectedBrand(selectedBrand === brand ? null : brand); // Toggle brand details
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
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          <Button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>Reset</Button>
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
                          <DropdownMenuItem onClick={() => toggleBrandStatus(brand._id)}>
                            {brand.status === 'active' ? 'Block Brand' : 'Unblock Brand'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() =>{
                            setEditingBrand(brand)
                            setIsEditBrandDialogOpen(true) }}>
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
                                  <TableCell>{getStatusBadge(model.status)}</TableCell>
                                  <TableCell>
                                    <Button onClick={() => toggleModelStatus(brand._id, model._id, 'active')}>
                                      Set Active
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4}>No models found for this brand.</TableCell>
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
                <TableCell colSpan={4}>No brands found matching your filters.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default BrandList;
