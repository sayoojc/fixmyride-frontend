// Base interfaces matching your MongoDB schema
export interface IPart {
  name: string
  price: number
  quantity: number
}

export interface IPriceBreakup {
  parts: IPart[]
  laborCharge: number
  discount?: number
  tax?: number
  total: number
}

export interface IBrand {
  _id: string
  brandName: string
  imageUrl:string
  status:string
}

export interface IModel {
  _id: string
  name: string
  brandId: string
  imageUrl:string
}

export interface IServicePackage {
  _id: string
  title: string
  description: string
  brandId: IBrand
  modelId: IModel
  fuelType: "petrol" | "diesel" | "lpg" | "cng"
  servicesIncluded: string[]
  priceBreakup: IPriceBreakup
  isBlocked: boolean
  imageUrl:string
  createdAt: string
  updatedAt?: string
  isAdded:boolean
  servicePackageCategory:"general" | "ac" | "brake" | "washing"
}

// Form data types
export interface ServicePackageFormData {
  title: string
  description: string
  brandId: string
  modelId: string
  fuelType: "petrol" | "diesel" | "lpg" | "cng"
  servicesIncluded: string[]
  priceBreakup: IPriceBreakup
  imageUrl:string
  servicePackageCategory:"general" | "ac" | "brake" | "washing"
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Filter types
export type FilterStatus = "all" | "active" | "blocked"
export type FuelTypeFilter = "all" | "petrol" | "diesel" | "lpg" | "cng"

export interface ServicePackageFilters {
  search: string
  status: FilterStatus
  fuelType: FuelTypeFilter
  brandId?: string
  modelId?: string
}

// Modal props types
export interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface AddServicePackageModalProps extends BaseModalProps {
  onSuccess: (newPackage: IServicePackage) => void
}

export interface EditServicePackageModalProps extends BaseModalProps {
  onSuccess: (updatedPackage: IServicePackage) => void
  servicePackage: IServicePackage | null
}

export interface ConfirmationDialogProps extends BaseModalProps {
  onConfirm: () => void
  title: string
  message: string
  confirmText: string
  variant?: "default" | "destructive"
}

// Action types
export type ActionType = "block" | "unblock"

// Hook return types
export interface UseServicePackagesReturn {
  servicePackages: IServicePackage[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  addServicePackage: (data: ServicePackageFormData) => Promise<IServicePackage>
  updateServicePackage: (id: string, data: ServicePackageFormData) => Promise<IServicePackage>
  toggleBlockStatus: (id: string, isBlocked: boolean) => Promise<void>
}
