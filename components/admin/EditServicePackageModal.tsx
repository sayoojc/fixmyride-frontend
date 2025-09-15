"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Trash2, Upload, ImageIcon, Calculator, Package, Info, AlertTriangle, Edit } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ServicePackageSchema, type ServicePackageFormData } from "../../validations/servicePackage"
import type { IServicePackage, IPart } from "../../types/service-packages"
import { toast } from "react-toastify"
import type { Brand, Model } from "@/types/brand"
import createAdminApi from "@/services/adminApi"
import createimageUploadApi from "@/services/imageUploadApi"
import { axiosPrivate } from "@/api/axios"
import { axiosPublic } from "@/api/axiosPublic"
import { categoryKeys } from "@/constants/serviceCategories"

const imageUploadApi = createimageUploadApi(axiosPublic)
const adminApi = createAdminApi(axiosPrivate)

interface EditServicePackageModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (updatedPackage: IServicePackage) => void
  brands: Brand[]
  servicePackage: IServicePackage | null
}

interface FormState {
  loading: boolean
  serviceInput: string
  isEmergency: boolean
}

const EditServicePackageModal: React.FC<EditServicePackageModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  brands,
  servicePackage,
}) => {
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    serviceInput: "",
    isEmergency: false,
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<ServicePackageFormData>({
    resolver: zodResolver(ServicePackageSchema),
    defaultValues: {
      title: "",
      description: "",
      brandId: "",
      modelId: "",
      fuelType: undefined,
      imageUrl: "",
      servicePackageCategory: "general",
      servicesIncluded: [],
      workHours: 0,
      numberOfEmployees: 1,
      isEmergency: false,
      emergencyServiceFee: 0,
      priceBreakup: {
        parts: [{ name: "", price: 0, quantity: 1 }],
        laborCharge: 0,
        discount: 0,
        tax: 0,
        total: 0,
      },
    },
  })

  const [selectedBrand, setSelectedBrand] = useState<Brand>()
  const [selectedModel, setSelectedModel] = useState<Model>()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file")
        return
      }
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "priceBreakup.parts",
  })

  const servicesIncluded = watch("servicesIncluded")
  const parts = watch("priceBreakup.parts")
  const laborCharge = watch("priceBreakup.laborCharge")
  const discount = watch("priceBreakup.discount")
  const tax = watch("priceBreakup.tax")
  const emergencyServiceFee = watch("emergencyServiceFee")

  useEffect(() => {
    if (formState.isEmergency) {
      setValue("priceBreakup.total", Math.max(0, emergencyServiceFee || 0))
    } else {
      const partsTotal = (parts || []).reduce(
        (sum: number, part: IPart) => sum + (part?.price || 0) * (part?.quantity || 0),
        0,
      )
      const subtotal = (partsTotal || 0) + (laborCharge || 0) - (discount || 0)
      const total = subtotal + (tax || 0)

      setValue("priceBreakup.total", Math.max(0, total))
    }
  }, [parts, laborCharge, discount, tax, emergencyServiceFee, formState.isEmergency, setValue])

  useEffect(() => {
    if (servicePackage?.imageUrl) {
      setPreviewUrl(servicePackage.imageUrl)
    }
  }, [servicePackage])

  useEffect(() => {
    if (servicePackage && isOpen) {
      const isEmergencyPackage = servicePackage.servicePackageCategory === "emergency" || servicePackage.isEmergency

      setFormState((prev) => ({ ...prev, isEmergency: isEmergencyPackage }))

      const formData: ServicePackageFormData = {
        title: servicePackage.title,
        description: servicePackage.description,
        imageUrl: servicePackage.imageUrl,
        servicePackageCategory: servicePackage.servicePackageCategory,
        brandId: servicePackage.brandId?._id || "",
        modelId: servicePackage.modelId?._id || "",
        fuelType: servicePackage.fuelType,
        servicesIncluded: servicePackage.servicesIncluded,
        workHours: Number(servicePackage.workHours) || 0,
        numberOfEmployees: Number(servicePackage.numberOfEmployees) || 1,
        isEmergency: isEmergencyPackage,
        emergencyServiceFee: servicePackage.emergencyServiceFee || 0,
        priceBreakup: servicePackage.priceBreakup,
      }

      reset(formData)
      replace(servicePackage.priceBreakup.parts)

      // Set selected brand and model
      if (servicePackage.brandId?._id) {
        const brand = brands.find((b) => b._id === servicePackage.brandId._id)
        setSelectedBrand(brand)
        if (brand && servicePackage.modelId?._id) {
          const model = brand.models.find((m) => m._id === servicePackage.modelId._id)
          setSelectedModel(model)
        }
      }
    }
  }, [servicePackage, isOpen, reset, replace, brands])

  const updateServiceInput = useCallback((value: string): void => {
    setFormState((prev) => ({ ...prev, serviceInput: value }))
  }, [])

  const setLoading = useCallback((loading: boolean): void => {
    setFormState((prev) => ({ ...prev, loading }))
  }, [])

  const addService = useCallback((): void => {
    if (formState.serviceInput.trim()) {
      const currentServices: string[] = servicesIncluded || []
      setValue("servicesIncluded", [...currentServices, formState.serviceInput.trim()])
      updateServiceInput("")
    }
  }, [formState.serviceInput, servicesIncluded, setValue, updateServiceInput])

  const removeService = useCallback(
    (index: number): void => {
      const currentServices: string[] = servicesIncluded || []
      setValue(
        "servicesIncluded",
        currentServices.filter((_, i: number) => i !== index),
      )
    },
    [servicesIncluded, setValue],
  )

  const addPart = useCallback((): void => {
    append({ name: "", price: 0, quantity: 1 })
  }, [append])

  const removePart = useCallback(
    (index: number): void => {
      remove(index)
    },
    [remove],
  )

  const handleEmergencyToggle = useCallback(
    (checked: boolean): void => {
      setFormState((prev) => ({ ...prev, isEmergency: checked }))
      setValue("isEmergency", checked)

      if (checked) {
        setValue("brandId", "")
        setValue("modelId", "")
        setValue("fuelType", undefined)
        setValue("servicePackageCategory", "emergency")
        setValue("workHours", 0)
        setValue("priceBreakup", {
          parts: [],
          laborCharge: 0,
          discount: 0,
          tax: 0,
          total: 0,
        })
        setSelectedBrand(undefined)
        setSelectedModel(undefined)
      } else {
        setValue("emergencyServiceFee", 0)
        setValue("servicePackageCategory", "general")
      }
    },
    [setValue],
  )

  const onSubmit = useCallback(
    async (data: ServicePackageFormData): Promise<void> => {
      console.log("[v0] Starting form submission with data:", data)

      if (!servicePackage) {
        console.log("[v0] No service package found, aborting submission")
        return
      }

      console.log("[v0] Service package ID:", servicePackage._id)
      setLoading(true)

      try {
        let updatedData = { ...data, isEmergency: formState.isEmergency }
        console.log("[v0] Prepared data for API call:", updatedData)

        if (selectedImage) {
          console.log("[v0] Uploading image first...")
          const url = await imageUploadApi.uploadImageApi(selectedImage)
          console.log("[v0] Image uploaded successfully, URL:", url)
          updatedData = { ...updatedData, imageUrl: url }
        }

        console.log("[v0] Making API call to update service package...")
        console.log("[v0] API endpoint will be called with:", {
          id: servicePackage._id,
          data: updatedData,
        })

        const updatedPackage = await adminApi.updateServicePackage(servicePackage._id, updatedData)
        console.log("[v0] API call successful, response:", updatedPackage)

        onSuccess(updatedPackage.servicePackage)
        reset()
        setPreviewUrl("")
        updateServiceInput("")
        setFormState((prev) => ({ ...prev, isEmergency: false }))
        onClose()

        console.log("[v0] Form submission completed successfully")
      } catch (error) {
       console.log('error',error)

      } finally {
        setLoading(false)
        
      }
    },
    [servicePackage, onSuccess, onClose, setLoading, selectedImage, formState.isEmergency, reset, updateServiceInput],
  )

  const handleClose = useCallback((): void => {
    reset()
    setPreviewUrl("")
    updateServiceInput("")
    setFormState((prev) => ({ ...prev, isEmergency: false }))
    onClose()
  }, [reset, updateServiceInput, onClose])

  const handleServiceInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      updateServiceInput(event.target.value)
    },
    [updateServiceInput],
  )

  const handleServiceInputKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (event.key === "Enter") {
        event.preventDefault()
        addService()
      }
    },
    [addService],
  )

  const handleFuelTypeChange = useCallback(
    (value: "petrol" | "diesel" | "lpg" | "cng"): void => {
      setValue("fuelType", value)
    },
    [setValue],
  )

  const handleBrandChange = useCallback(
    (value: string): void => {
      setValue("brandId", value)
      const selected = brands.find((brand) => brand._id === value)
      setSelectedBrand(selected || undefined)
    },
    [setValue, brands],
  )

  const handleModelChange = useCallback(
    (value: string): void => {
      setValue("modelId", value)
      const selected = selectedBrand?.models.find((model) => model._id === value)
      setSelectedModel(selected)
    },
    [setValue, selectedBrand],
  )

  if (!servicePackage) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl h-[95vh] p-0 flex flex-col">
        <DialogHeader className="shrink-0 px-6 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Edit className="h-6 w-6 text-green-600" />
            Edit Service Package
            {formState.isEmergency && (
              <Badge variant="destructive" className="ml-2">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Emergency
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-4">
            <Card className="border-2 border-orange-100 shadow-sm">
              <CardHeader className="bg-orange-50/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Package Type
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="isEmergency" className="text-sm font-semibold text-gray-700">
                      Is Emergency Service
                    </Label>
                  </div>
                  <Switch
                    id="isEmergency"
                    checked={formState.isEmergency}
                    onCheckedChange={handleEmergencyToggle}
                    className="data-[state=checked]:bg-orange-600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100 shadow-sm">
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-blue-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                    Package Title *
                  </Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder={
                      formState.isEmergency
                        ? "e.g., Emergency Roadside Assistance"
                        : "e.g., Complete Car Service Package"
                    }
                    className="mt-1.5 h-11"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {!formState.isEmergency && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="brandId" className="text-sm font-semibold text-gray-700">
                          Brand *
                        </Label>
                        <Select onValueChange={handleBrandChange} value={watch("brandId")}>
                          <SelectTrigger className="mt-1.5 h-11">
                            <SelectValue placeholder="Select vehicle brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((brand) => (
                              <SelectItem key={brand._id} value={brand._id}>
                                {brand.brandName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.brandId && (
                          <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.brandId.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="modelId" className="text-sm font-semibold text-gray-700">
                          Model *
                        </Label>
                        <Select onValueChange={handleModelChange} value={watch("modelId")}>
                          <SelectTrigger className="mt-1.5 h-11">
                            <SelectValue placeholder="Select vehicle model" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedBrand?.models.map((model) => (
                              <SelectItem value={model._id} key={model._id}>
                                {model.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.modelId && (
                          <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.modelId.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="fuelType" className="text-sm font-semibold text-gray-700">
                          Fuel Type *
                        </Label>
                        <Select onValueChange={handleFuelTypeChange} value={watch("fuelType")}>
                          <SelectTrigger className="mt-1.5 h-11">
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedModel?.fuelTypes.map((fuel) => (
                              <SelectItem key={fuel} value={fuel}>
                                <span className="capitalize">{fuel}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.fuelType && (
                          <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.fuelType.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="servicePackageCategory" className="text-sm font-semibold text-gray-700">
                          Service Category *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setValue(
                              "servicePackageCategory",
                              value as ServicePackageFormData["servicePackageCategory"],
                            )
                          }
                          value={watch("servicePackageCategory")}
                        >
                          <SelectTrigger className="mt-1.5 h-11">
                            <SelectValue placeholder="Select service category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryKeys.map((category) => (
                              <SelectItem key={category} value={category}>
                                <span className="capitalize">
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.servicePackageCategory && (
                          <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.servicePackageCategory.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label className="text-sm font-semibold text-gray-700">Package Image *</Label>
                  <div className="mt-1.5">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="file"
                            id="imageUpload"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        </div>
                      </div>

                      {previewUrl && (
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              src={previewUrl || "/placeholder.svg"}
                              alt="Preview"
                              className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <div className="absolute -top-2 -right-2">
                              <Badge variant="secondary" className="text-xs">
                                <ImageIcon className="h-3 w-3 mr-1" />
                                Preview
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder={
                      formState.isEmergency
                        ? "Describe the emergency service details..."
                        : "Describe what's included in this service package..."
                    }
                    rows={4}
                    className="mt-1.5 resize-none"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {!formState.isEmergency && (
                    <div>
                      <Label htmlFor="workHours" className="text-sm font-semibold text-gray-700">
                        Estimated Work Hours *
                      </Label>
                      <Input
                        id="workHours"
                        step="0.5"
                        min="0"
                        {...register("workHours", { valueAsNumber: true })}
                        placeholder="e.g., 2.5"
                        className="mt-1.5 h-11"
                      />
                      {errors.workHours && (
                        <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.workHours.message}
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="numberOfEmployees" className="text-sm font-semibold text-gray-700">
                      Employees Required *
                    </Label>
                    <Input
                      id="numberOfEmployees"
                      min="1"
                      {...register("numberOfEmployees", { valueAsNumber: true })}
                      placeholder="e.g., 2"
                      className="mt-1.5 h-11"
                    />
                    {errors.numberOfEmployees && (
                      <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.numberOfEmployees.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 shadow-sm">
              <CardHeader className="bg-green-50/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-green-600" />
                  Services Included
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      value={formState.serviceInput}
                      onChange={handleServiceInputChange}
                      placeholder={
                        formState.isEmergency
                          ? "Enter emergency service (e.g., Towing, Jump Start)"
                          : "Enter service name (e.g., Oil Change, Brake Inspection)"
                      }
                      onKeyPress={handleServiceInputKeyPress}
                      className="h-11"
                    />
                    <Button type="button" onClick={addService} className="h-11 px-6 bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  {servicesIncluded && servicesIncluded.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Added Services:</p>
                      <div className="grid gap-2">
                        <AnimatePresence>
                          {servicesIncluded?.map((service: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-lg"
                            >
                              <span className="text-sm font-medium text-green-800">{service}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeService(index)}
                                className="h-8 w-8 p-0 text-green-600 hover:text-red-600 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {errors.servicesIncluded && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.servicesIncluded.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {formState.isEmergency && (
              <Card className="border-2 border-orange-100 shadow-sm">
                <CardHeader className="bg-orange-50/50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-orange-600" />
                    Emergency Service Fee
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="emergencyServiceFee" className="text-sm font-semibold text-gray-700">
                        Emergency Service Fee (₹) *
                      </Label>
                      <Input
                        id="emergencyServiceFee"
                        step="0.01"
                        min="0"
                        {...register("emergencyServiceFee", { valueAsNumber: true })}
                        placeholder="Enter emergency service fee"
                        className="mt-1.5 h-11"
                      />
                      {errors.emergencyServiceFee && (
                        <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.emergencyServiceFee.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        This is the total fee for the emergency service including all charges
                      </p>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-orange-800">Total Emergency Service Cost:</span>
                        <span className="text-lg font-bold text-orange-900">₹{emergencyServiceFee || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!formState.isEmergency && (
              <Card className="border-2 border-purple-100 shadow-sm">
                <CardHeader className="bg-purple-50/50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-purple-600" />
                    Price Breakup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div>
                    <div className="flex items-center justify-between mb-4 pt-2">
                      <Label className="text-sm font-semibold text-gray-700">Parts & Components</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPart}
                        className="h-9 border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Part
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {fields.map((field, index: number) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-lg border"
                        >
                          <div className="col-span-5">
                            <Label className="text-xs font-medium text-gray-600">Part Name</Label>
                            <Input
                              {...register(`priceBreakup.parts.${index}.name`)}
                              placeholder="e.g., Engine Oil Filter"
                              className="mt-1 h-10"
                            />
                          </div>
                          <div className="col-span-3">
                            <Label className="text-xs font-medium text-gray-600">Price (₹)</Label>
                            <Input
                              step="0.01"
                              {...register(`priceBreakup.parts.${index}.price`, {
                                valueAsNumber: true,
                              })}
                              placeholder="0.00"
                              className="mt-1 h-10"
                            />
                          </div>
                          <div className="col-span-3">
                            <Label className="text-xs font-medium text-gray-600">Quantity</Label>
                            <Input
                              {...register(`priceBreakup.parts.${index}.quantity`, {
                                valueAsNumber: true,
                              })}
                              placeholder="1"
                              className="mt-1 h-10"
                            />
                          </div>
                          <div className="col-span-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePart(index)}
                              disabled={fields.length === 1}
                              className="h-10 w-10 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-4 block">Additional Charges (₹)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="laborCharge" className="text-xs font-medium text-gray-600">
                          Labor Charge
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register("priceBreakup.laborCharge", {
                            valueAsNumber: true,
                          })}
                          placeholder="0.00"
                          className="h-11"
                        />
                        {errors.priceBreakup?.laborCharge && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.priceBreakup.laborCharge.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discount" className="text-xs font-medium text-gray-600">
                          Discount
                        </Label>
                        <Input
                          step="0.01"
                          {...register("priceBreakup.discount", {
                            valueAsNumber: true,
                          })}
                          placeholder="0.00"
                          className="h-11"
                        />
                        {errors.priceBreakup?.discount && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.priceBreakup.discount.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tax" className="text-xs font-medium text-gray-600">
                          Tax
                        </Label>
                        <Input
                          step="0.01"
                          {...register("priceBreakup.tax", { valueAsNumber: true })}
                          placeholder="0.00"
                          className="h-11"
                        />
                        {errors.priceBreakup?.tax && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.priceBreakup.tax.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="total" className="text-xs font-medium text-gray-600">
                          Total Amount
                        </Label>
                        <Input
                          step="0.01"
                          {...register("priceBreakup.total", { valueAsNumber: true })}
                          placeholder="0.00"
                          readOnly
                          className="h-11 bg-purple-50 border-purple-200 font-semibold text-purple-800"
                        />
                        {errors.priceBreakup?.total && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {errors.priceBreakup.total.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>

        <div className="shrink-0 border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={formState.loading}
              className="h-11 px-6 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formState.loading}
              onClick={handleSubmit(onSubmit)}
              className="h-11 px-8 bg-green-600 hover:bg-green-700"
            >
              {formState.loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating Package...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Package
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditServicePackageModal
