"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Edit,
  Shield,
  ShieldOff,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Clock,
  Wrench,
  Package,
} from "lucide-react"
import { toast } from "react-toastify"
import createAdminApi from "@/services/adminApi"
import { axiosPrivate } from "@/api/axios"
import { UniversalTable, TableBadge, type TableColumn, type TableAction } from "../../../../components/Table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Brand } from "@/types/brand"
import type { AxiosError } from "axios"
import type { IServicePackage, ActionType } from "../../../../types/service-packages"
import AddServicePackageModal from "../../../../components/admin/AddServicePckageModal"
import EditServicePackageModal from "../../../../components/admin/EditServicePackageModal"
import ConfirmationDialog from "../../../../components/admin/ConfirmationDialoge"

const adminApi = createAdminApi(axiosPrivate)

const ServicePlanManagement = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [fuelFilter, setFuelFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [servicePackages, setServicePackages] = useState<IServicePackage[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false)
  const [selectedPackage, setSelectedPackage] = useState<IServicePackage | null>(null)
  const [actionType, setActionType] = useState<ActionType>("block")

  const toggleRowExpansion = (packageId: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(packageId)) {
      newExpandedRows.delete(packageId)
    } else {
      newExpandedRows.add(packageId)
    }
    setExpandedRows(newExpandedRows)
  }

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandResponse = await adminApi.getBrandsApi("", -1, "")
        setBrands(brandResponse.BrandObject.formattedBrands)
      } catch (error) {
        const err = error as AxiosError<{ message: string }>
        toast.error(err.response?.data?.message || "Failed to fetch brands")
      }
    }
    fetchBrands()
  }, [])

  useEffect(() => {
    const fetchServicePackages = async () => {
      try {
        setLoading(true)
        const response = await adminApi.getServicePackages(searchTerm, currentPage, statusFilter, fuelFilter)
        setServicePackages(response.servicePackageResponse.servicePackages)
        setTotalPages(response.servicePackageResponse.totalCount)
      } catch (error) {
        const err = error as AxiosError<{ message: string }>
        toast.error(err.response?.data?.message || "Failed to fetch service packages.")
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
      const response = await adminApi.toggleServicePackageStatus(selectedPackage._id, actionType)
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
      const err = error as AxiosError<{ message: string }>
      toast.error(err.response?.data?.message || "Failed to update status of service package")
    } finally {
      setLoading(false)
      setIsConfirmDialogOpen(false)
      setSelectedPackage(null)
    }
  }, [selectedPackage, actionType])

  const handleAddSuccess = useCallback(async (): Promise<void> => {
    toast.success("Service package added successfully")
    setIsAddModalOpen(false)
    const response = await adminApi.getServicePackages(searchTerm, currentPage, statusFilter, fuelFilter)
    setServicePackages(response.servicePackageResponse.servicePackages)
  }, [searchTerm, currentPage, statusFilter, fuelFilter])

  const handleEditSuccess = useCallback((updatedPackage: IServicePackage) => {
    console.log('the handle edit success service package',updatedPackage)
    toast.success("Service package updated successfully")
    setServicePackages((prev) => prev.map((pkg) => (pkg._id === updatedPackage._id ? updatedPackage : pkg)))
    setIsEditModalOpen(false)
  }, [])

  const columns: TableColumn<IServicePackage>[] = [
    {
      key: "expand",
      header: "",
      render: (_, pkg) => (
        <Button variant="ghost" size="sm" onClick={() => toggleRowExpansion(pkg._id)} className="p-1">
          {expandedRows.has(pkg._id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      ),
    },
    {
      key: "package",
      header: "Package Details",
      render: (_, pkg) => (
        <div className="cursor-pointer" onClick={() => toggleRowExpansion(pkg._id)}>
          <div className="font-medium text-sm lg:text-base">{pkg.title}</div>
          <div className="text-xs lg:text-sm text-gray-600 truncate max-w-[200px] lg:max-w-sm">{pkg.description}</div>
          {pkg.isEmergency && (
            <TableBadge variant="destructive" >
              Emergency
            </TableBadge>
          )}
        </div>
      ),
    },
    {
      key: "services",
      header: "Services Included",
      render: (_, pkg) => (
        <div className="text-xs lg:text-sm">
          {pkg.servicesIncluded.slice(0, 3).map((service: string, idx: number) => (
            <div key={idx} className="text-gray-600 truncate max-w-[150px]">
              • {service}
            </div>
          ))}
          {pkg.servicesIncluded.length > 3 && (
            <div className="text-gray-400 text-xs">+{pkg.servicesIncluded.length - 3} more services</div>
          )}
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (_, pkg) => <div className="font-semibold text-lg text-green-600">₹{pkg.isEmergency ? pkg.emergencyServiceFee : pkg.priceBreakup.total}</div>,
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

  const renderExpandedDetails = (pkg: IServicePackage) => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gray-50 p-4 border-t"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Vehicle Information - Only for non-emergency packages */}
        {!pkg.isEmergency && (
          <Card className="p-4">
            <CardTitle className="text-sm font-medium mb-2 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Vehicle Information
            </CardTitle>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Brand:</span> {pkg.brandId?.brandName ?? "N/A"}
              </div>
              <div>
                <span className="font-medium">Model:</span> {pkg.modelId?.name ?? "N/A"}
              </div>
              <div>
                <span className="font-medium">Fuel Type:</span>
                <TableBadge variant="outline" >
                  {pkg.fuelType ?? "N/A"}
                </TableBadge>
              </div>
            </div>
          </Card>
        )}

        {/* Work Details - Only for non-emergency packages */}
        {!pkg.isEmergency && (
          <Card className="p-4">
            <CardTitle className="text-sm font-medium mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Work Details
            </CardTitle>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Work Hours:</span> {pkg.workHours ?? "N/A"} hours
              </div>
              <div>
                <span className="font-medium">Employees Required:</span> {pkg.numberOfEmployees}
              </div>
              <div>
                <span className="font-medium">Category:</span> {pkg.servicePackageCategory}
              </div>
            </div>
          </Card>
        )}

        {/* Emergency Package Info - Only for emergency packages */}
        {pkg.isEmergency && (
          <Card className="p-4">
            <CardTitle className="text-sm font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              Emergency Service
            </CardTitle>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Employees Required:</span> {pkg.numberOfEmployees}
              </div>
              <div>
                <span className="font-medium">Category:</span> {pkg.servicePackageCategory}
              </div>
              <div className="text-red-600 font-medium">Available for all vehicle types</div>
            </div>
          </Card>
        )}

        {/* Price Breakdown - Only if parts exist (non-emergency) */}
        {pkg.priceBreakup && pkg.priceBreakup.parts && pkg.priceBreakup.parts.length > 0 && (
          <Card className="p-4">
            <CardTitle className="text-sm font-medium mb-2 flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Price Breakdown
            </CardTitle>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Labor Charge:</span> ₹{pkg.priceBreakup.laborCharge ?? 0}
              </div>
              {pkg.priceBreakup.discount && pkg.priceBreakup.discount > 0 && (
                <div>
                  <span className="font-medium">Discount:</span> ₹{pkg.priceBreakup.discount}
                </div>
              )}
              {pkg.priceBreakup.tax && pkg.priceBreakup.tax > 0 && (
                <div>
                  <span className="font-medium">Tax:</span> ₹{pkg.priceBreakup.tax}
                </div>
              )}
              <div className="pt-2 border-t">
                <span className="font-semibold">Total:</span> ₹{pkg.priceBreakup.total}
              </div>
            </div>
          </Card>
        )}

        {/* Parts List - Only for non-emergency packages with parts */}
        {!pkg.isEmergency && pkg.priceBreakup?.parts && pkg.priceBreakup.parts.length > 0 && (
          <Card className="p-4 md:col-span-2 lg:col-span-3">
            <CardTitle className="text-sm font-medium mb-2">Parts Required</CardTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {pkg.priceBreakup.parts.map((part, idx) => (
                <div key={idx} className="bg-white p-2 rounded border text-sm">
                  <div className="font-medium">{part.name}</div>
                  <div className="text-gray-600">
                    Qty: {part.quantity} × ₹{part.price} = ₹{part.quantity * part.price}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* All Services List */}
        <Card className="p-4 md:col-span-2 lg:col-span-3">
          <CardTitle className="text-sm font-medium mb-2">All Services Included</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
            {pkg.servicesIncluded.map((service, idx) => (
              <div key={idx} className="text-sm text-gray-700 flex items-center gap-1">
                <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                {service}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  )

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
            <CardDescription>
              {servicePackages.length} packages found. Click on any row to view detailed information.
            </CardDescription>
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
                <div className="space-y-0">
                  {servicePackages.map((pkg) => (
                    <div key={pkg._id} className="border-b last:border-b-0">
                      <UniversalTable
                        title=""
                        description=""
                        data={[pkg]}
                        columns={columns}
                        actions={actions}
                        loading={false}
                        emptyMessage=""
                      />
                      {expandedRows.has(pkg._id) && renderExpandedDetails(pkg)}
                    </div>
                  ))}
                  {servicePackages.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No service packages found matching your filters
                    </div>
                  )}
                </div>
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
        message={`Are you sure you want to ${actionType} "${selectedPackage?.title}"? This action will ${actionType === "block" ? "prevent customers from booking" : "allow customers to book"} this service package.`}
        confirmText={actionType === "block" ? "Block" : "Unblock"}
        variant={actionType === "block" ? "destructive" : "default"}
      />
    </div>
  )
}

export default ServicePlanManagement
