"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Shield, ShieldOff, Search, Filter } from "lucide-react"
import { toast } from "react-toastify"
import createAdminApi from "@/services/adminApi"
import { axiosPrivate } from "@/api/axios"
import { UniversalTable, TableBadge, type TableColumn, type TableAction } from "../../../../components/Table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Brand } from "@/types/brand"
import type { IServicePackage, ActionType } from "../../../../types/service-packages"
import AddServicePackageModal from "../../../../components/admin/AddServicePckageModal"
import EditServicePackageModal from "../../../../components/admin/EditServicePackageModal"
import ConfirmationDialog from "../../../../components/admin/ConfirmationDialoge"

const adminApi = createAdminApi(axiosPrivate)

const ServicePlanManagement = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [fuelFilter, setFuelFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [servicePackages, setServicePackages] = useState<IServicePackage[]>([])
  const [brands, setBrands] = useState<Brand[]>([])

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false)
  const [selectedPackage, setSelectedPackage] = useState<IServicePackage | null>(null)
  const [actionType, setActionType] = useState<ActionType>("block")

  // Fetch brands data
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandResponse = await adminApi.getBrandsApi("", -1, "")
        setBrands(brandResponse.BrandObject.formattedBrands)
      } catch (error) {
        console.error("Error fetching brands:", error)
      }
    }
    fetchBrands()
  }, [])

  // Fetch service packages data
  useEffect(() => {
    const fetchServicePackages = async () => {
      try {
        setLoading(true)
        const response = await adminApi.getServicePackages(searchTerm, currentPage, statusFilter, fuelFilter)
        setServicePackages(response.servicePackageResponse.servicePackages)
        setTotalPages(response.servicePackageResponse.totalCount)
      } catch (error) {
        console.error("Error fetching service packages:", error)
        setError("Failed to fetch service packages")
        toast.error("Failed to fetch service packages")
      } finally {
        setLoading(false)
      }
    }

    fetchServicePackages()
  }, [searchTerm, currentPage, statusFilter, fuelFilter])

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
      setLoading(true)
      const response = await adminApi.toggleBlockStatus(selectedPackage._id, actionType)
      setServicePackages((prev) =>
        prev.map((pkg) => {
          if (pkg._id === response.servicePackage._id) {
            return response.servicePackage
          }
          return pkg
        }),
      )
      toast.success(`Service package ${actionType}ed successfully`)
    } catch (error) {
      console.error(`Error ${actionType}ing service package:`, error)
      toast.error(`Failed to ${actionType} service package`)
    } finally {
      setLoading(false)
      setIsConfirmDialogOpen(false)
      setSelectedPackage(null)
    }
  }, [selectedPackage, actionType])

  const handleAddSuccess = useCallback(
    async (newPackage: IServicePackage): Promise<void> => {
      toast.success("Service package added successfully")
      setIsAddModalOpen(false)
      // Refresh the data
      const response = await adminApi.getServicePackages(searchTerm, currentPage, statusFilter, fuelFilter)
      setServicePackages(response.servicePackageResponse.servicePackages)
    },
    [searchTerm, currentPage, statusFilter, fuelFilter],
  )

  const handleEditSuccess = useCallback((updatedPackage: IServicePackage) => {
    toast.success("Service package updated successfully")
    setServicePackages((prev) => prev.map((pkg) => (pkg._id === updatedPackage._id ? updatedPackage : pkg)))
    setIsEditModalOpen(false)
  }, [])

  // Define table columns for UniversalTable
  const columns: TableColumn<IServicePackage>[] = [
    {
      key: "package",
      header: "Package Details",
      render: (_, pkg) => (
        <div>
          <div className="font-medium text-sm lg:text-base">{pkg.title}</div>
          <div className="text-xs lg:text-sm text-gray-600 truncate max-w-[180px] lg:max-w-xs">{pkg.description}</div>
        </div>
      ),
    },
    {
      key: "vehicle",
      header: "Vehicle",
      render: (_, pkg) => (
        <div className="text-xs lg:text-sm">
          <div className="font-medium">{pkg.brandId?.brandName ?? "Unknown Brand"}</div>
          <div className="text-gray-600">{pkg.modelId?.name ?? "Unknown Model"}</div>
        </div>
      ),
    },
    {
      key: "fuelType",
      header: "Fuel Type",
      render: (fuelType) => <TableBadge variant="outline">{fuelType}</TableBadge>,
    },
    {
      key: "services",
      header: "Services",
      render: (_, pkg) => (
        <div className="text-xs lg:text-sm">
          {pkg.servicesIncluded.slice(0, 2).map((service: string, idx: number) => (
            <div key={idx} className="text-gray-600 truncate max-w-[130px]">
              • {service}
            </div>
          ))}
          {pkg.servicesIncluded.length > 2 && (
            <div className="text-gray-400 text-xs">+{pkg.servicesIncluded.length - 2} more</div>
          )}
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (_, pkg) => <div className="font-medium text-sm lg:text-base">₹{pkg.priceBreakup?.total ?? 0}</div>,
    },
    {
      key: "status",
      header: "Status",
      render: (_, pkg) => (
        <TableBadge variant={pkg.isBlocked ? "destructive" : "default"}>
          {pkg.isBlocked ? "Blocked" : "Active"}
        </TableBadge>
      ),
    },
  ]

  // Define table actions for UniversalTable
  const actions: TableAction<IServicePackage>[] = [
    {
      label: "Edit",
      onClick: (pkg) => handleEdit(pkg),
      variant: "outline",
      icon: <Edit className="h-4 w-4" />,
    },
    {
      label: (pkg) => (pkg.isBlocked ? "Unblock" : "Block"),
      onClick: (pkg) => handleBlockUnblock(pkg, pkg.isBlocked ? "unblock" : "block"),
      variant: (pkg) => (pkg.isBlocked ? "default" : "destructive"),
      icon: (pkg) => (pkg.isBlocked ? <Shield className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />),
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  return (
    <div className="flex-1 md:ml-64 transition-all duration-200 ease-in-out overflow-y-auto">
      {/* Top header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Service Plan Management</h2>
            <p className="text-sm text-slate-500">Manage service packages and pricing</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Add Service Package
          </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="p-4 md:p-6">
        <Card className="mb-6">
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
                Total: {servicePackages.length} packages
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main content */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Service Packages</CardTitle>
            <CardDescription>{servicePackages.length} packages found</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col gap-4 py-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-8 bg-slate-200 rounded w-24"></div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="overflow-x-auto">
                <UniversalTable
                  title="Service Package Management"
                  description="Manage service packages and their status"
                  data={servicePackages}
                  columns={columns}
                  actions={actions}
                  loading={false}
                  emptyMessage="No service packages found matching your filters"
                />
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
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
          <span className="px-4 py-2 border rounded-md text-sm font-semibold bg-blue-100 text-blue-700">
            Page {currentPage}
          </span>
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

      {/* Modals */}
      <AddServicePackageModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        brands={brands || []}
      />

      <EditServicePackageModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedPackage(null)
        }}
        onSuccess={handleEditSuccess}
        servicePackage={selectedPackage}
        brands={brands || []}
      />

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false)
          setSelectedPackage(null)
        }}
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
