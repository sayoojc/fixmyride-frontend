"use client"

import type React from "react"
import { useState, useMemo, useCallback, useEffect } from "react"
import { Plus, Edit, Shield, ShieldOff, Search, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"
import { Brand, Model } from "@/types/brand";
import createAdminApi from "@/services/adminApi"
import { axiosPrivate } from "@/api/axios"
const adminApi = createAdminApi(axiosPrivate);
import type {
  IServicePackage,
  ServicePackageFilters,
  FilterStatus,
  FuelTypeFilter,
  ActionType,
} from "../../../../types/service-packages"

import AddServicePackageModal from "../../../../components/admin/AddServicePckageModal"
import EditServicePackageModal from "../../../../components/admin/EditServicePackageModal"
import ConfirmationDialog from "../../../../components/admin/ConfirmationDialoge"

const ServicePlanManagement: React.FC = () => {
   const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ServicePackageFilters>({
    search: "",
    status: "all",
    fuelType: "all",
  })


  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false)
  const [selectedPackage, setSelectedPackage] = useState<IServicePackage | null>(null)
  const [actionType, setActionType] = useState<ActionType>("block")
  const [brands,setBrands] = useState<Brand[]>([])
  const [servicePackages,setServicePackages] = useState<IServicePackage[]>([]);
  
      const [currentPage, setCurrentPage] = useState<number>(1);
      const [totalPages,setTotalPages] = useState<number>(1)
       const [searchTerm, setSearchTerm] = useState<string>("");
        const [statusFilter, setStatusFilter] = useState<string>("all");
        const [fuelFilter,setFuelFilter] = useState<string>("");

  useEffect(() => {
   const fetchData = async () => {
      try {

        const brandResponse = await adminApi.getBrandsApi("",-1,"")
        setBrands(brandResponse.BrandObject.formattedBrands);
      
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchData();
},[])
useEffect(() => {
   const fetchData = async () => {
      try {
      const response = await adminApi.getServicePackages(searchTerm,currentPage,statusFilter,fuelFilter)
      setServicePackages(response.servicePackageResponse.servicePackages)
      setTotalPages(response.servicePackageResponse.totalCount)
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchData();
},[searchTerm,currentPage,statusFilter,fuelFilter])

  const handleEdit = useCallback((pkg: IServicePackage): void => {
    setSelectedPackage(pkg)
    setIsEditModalOpen(true)
  }, [])

  const handleBlockUnblock = useCallback((pkg: IServicePackage, action: ActionType): void => {
    setSelectedPackage(pkg)
    setActionType(action)
    setIsConfirmDialogOpen(true)
  }, [])

  const confirmBlockUnblock = useCallback(async (): Promise<void> => {
    if (!selectedPackage) return

    try {
      setLoading(true);
      const response = await adminApi.toggleBlockStatus(selectedPackage._id, actionType);
        setServicePackages((prev) => (prev.map((pkg) => {
       if(pkg._id === response.servicePackage._id){
        return response.servicePackage
       }
       return pkg
      })))
      setLoading(false);
      toast.success(`Service package ${actionType}ed successfully`)
    } catch (error) {
      console.error(`Error ${actionType}ing service package:`, error)
    } finally {
      setIsConfirmDialogOpen(false)
      setSelectedPackage(null)
    
    }
  }, [selectedPackage, actionType,])

  const handleAddSuccess = useCallback(async (newPackage: IServicePackage): Promise<void> => {
    toast.success("Service package added successfully")
    setIsAddModalOpen(false)
  }, [])
const handleEditSuccess = useCallback((updatedPackage: IServicePackage) => {
  toast.success("Service package updated successfully");
   console.log('The updated service package returned',updatedPackage)
  setServicePackages((prev) =>
    prev.map((pkg) =>
      pkg._id === updatedPackage._id ? updatedPackage : pkg
    )
  );

  setIsEditModalOpen(false);
}, []);


  // Modal close handlers
  const closeAddModal = useCallback((): void => setIsAddModalOpen(false), [])
  const closeEditModal = useCallback((): void => {
    setIsEditModalOpen(false)
    setSelectedPackage(null)
  }, [])
  const closeConfirmDialog = useCallback((): void => {
    setIsConfirmDialogOpen(false)
    setSelectedPackage(null)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
   <div className="p-4 lg:p-6 pl-8 space-y-4 lg:space-y-6 max-w-7xl ml-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Service Plan Management</h1>
          <p className="text-sm lg:text-base text-gray-600">Manage service packages and pricing</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 text-sm lg:text-base">
          <Plus size={16} />
          Add Service Package
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter size={16} />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search packages..."
                   className="pl-10 text-sm"
                   value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
                 
          
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <Select value={fuelFilter} onValueChange={(value) => setFuelFilter(value)}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Filter by fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fuel Types</SelectItem>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="LPG">LPG</SelectItem>
                  <SelectItem value="CNG">CNG</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs lg:text-sm text-gray-600 flex items-center justify-center lg:justify-start">
                Total:  packages
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Service Packages Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Package Details</TableHead>
                    <TableHead className="min-w-[120px]">Vehicle</TableHead>
                    <TableHead className="min-w-[100px]">Fuel Type</TableHead>
                    <TableHead className="min-w-[150px]">Services</TableHead>
                    <TableHead className="min-w-[80px]">Price</TableHead>
                    <TableHead className="min-w-[80px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
               <TableBody>
  <AnimatePresence>
    {servicePackages.map((pkg: IServicePackage, index: number) => (
      <motion.tr
        key={pkg._id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ delay: index * 0.05 }}
        className="hover:bg-gray-50"
      >
        {/* Package Title & Description */}
        <TableCell className="p-3">
          <div>
            <div className="font-medium text-sm lg:text-base">{pkg.title}</div>
            <div className="text-xs lg:text-sm text-gray-600 truncate max-w-[180px] lg:max-w-xs">
              {pkg.description}
            </div>
          </div>
        </TableCell>

        {/* Vehicle Info */}
        <TableCell className="p-3">
          <div className="text-xs lg:text-sm">
            <div className="font-medium">{pkg.brandId?.brandName ?? "Unknown Brand"}</div>
            <div className="text-gray-600">{pkg.modelId?.name ?? "Unknown Model"}</div>
          </div>
        </TableCell>

        {/* Fuel Type */}
        <TableCell className="p-3">
          <Badge variant="outline" className="text-xs">
            {pkg.fuelType}
          </Badge>
        </TableCell>

        {/* Services Included */}
        <TableCell className="p-3">
          <div className="text-xs lg:text-sm">
            {pkg.servicesIncluded.slice(0,2).map((service: string, idx: number) => (
              <div key={idx} className="text-gray-600 truncate max-w-[130px]">
                • {service}
              </div>
            ))}
            {pkg.servicesIncluded.length > 2 && (
              <div className="text-gray-400 text-xs">+{pkg.servicesIncluded.length - 2} more</div>
            )}
          </div>
        </TableCell>

        {/* Price */}
        <TableCell className="p-3">
          <div className="font-medium text-sm lg:text-base">
            ₹{pkg.priceBreakup?.total ?? 0}
          </div>
        </TableCell>

        {/* Status */}
        <TableCell className="p-3">
          <Badge variant={pkg.isBlocked ? "destructive" : "default"} className="text-xs">
            {pkg.isBlocked ? "Blocked" : "Active"}
          </Badge>
        </TableCell>

        {/* Actions */}
        <TableCell className="p-3">
          <div className="flex items-center gap-1 lg:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(pkg)}
              className="h-8 w-8 p-0"
            >
              <Edit size={12} />
            </Button>
            <Button
              variant={pkg.isBlocked ? "default" : "destructive"}
              size="sm"
              onClick={() => handleBlockUnblock(pkg, pkg.isBlocked ? "unblock" : "block")}
              className="h-8 w-8 p-0"
            >
              {pkg.isBlocked ? <Shield size={12} /> : <ShieldOff size={12} />}
            </Button>
          </div>
        </TableCell>
      </motion.tr>
    ))}
  </AnimatePresence>
</TableBody>

              </Table>
              
            </div>
          </CardContent>
        </Card>
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
      </motion.div>

      {/* Modals */}
      <AddServicePackageModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSuccess={handleAddSuccess}
        brands={brands || [] }
      />

      <EditServicePackageModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSuccess={handleEditSuccess}
        servicePackage={selectedPackage}
         brands={brands || [] }
        
      />

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmBlockUnblock}
        title={`${actionType === "block" ? "Block" : "Unblock"} Service Package`}
        message={`Are you sure you want to ${actionType} "${selectedPackage?.title}"? This action will ${
          actionType === "block" ? "prevent customers from booking" : "allow customers to book"
        } this service package.`}
        confirmText={actionType === "block" ? "Block" : "Unblock"}
        variant={actionType === "block" ? "destructive" : "default"}
      />
    </div>
  )
}

export default ServicePlanManagement
