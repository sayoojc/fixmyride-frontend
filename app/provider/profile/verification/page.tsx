"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertCircle,
  CheckCircle,
  Upload,
  Calendar,
  Building,
  CreditCard,
  FileText,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react"
import Navbar from "@/components/provider/Navbar"
import { verificationSchema, type VerificationFormData } from "@/schema/providerSchema"
import createProviderApi from "@/services/providerApi"
import { axiosPrivate } from "@/api/axios"
import { axiosPublic } from "@/api/axiosPublic"
import createimageUploadApi from "@/services/imageUploadApi"
import { toast } from "react-toastify"

const providerApi = createProviderApi(axiosPrivate)
const imageUploadApi = createimageUploadApi(axiosPublic)

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
}

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.2 } },
}

export default function VerificationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [licensePreview, setLicensePreview] = useState<string | null>(null)
  const [idProofPreview, setIdProofPreview] = useState<string | null>(null)
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
    watch,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    mode: "onChange",
    defaultValues: {
      licenseImage: null,
      idProofImage: null,
      accountHolderName: "",
      ifscCode: "",
      accountNumber: "",
      startedYear: "",
      description: "",
    },
  })

  // Watch all form values
  const formValues = watch()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "license" | "idProof") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Set the file in the form
      setValue(type === "license" ? "licenseImage" : "idProofImage", file, { shouldValidate: true })

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        if (type === "license") {
          setLicensePreview(event.target?.result as string)
        } else {
          setIdProofPreview(event.target?.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: VerificationFormData) => {
    setIsSubmitting(true)

    try {
      // Upload images
      const licenseUrl = await imageUploadApi.uploadVerificationImageApi(data.licenseImage)
      const idProofUrl = await imageUploadApi.uploadVerificationImageApi(data.idProofImage)
      const response = await providerApi.providerVerification({
        ...data,licenseImage:licenseUrl,idProofImage:idProofUrl
      })
      // Show success and redirect
      toast.success("Verification submitted successfully! Your application is under review.")
      router.push("/provider/profile");
    } catch (error) {
      console.error("Error submitting verification:", error)
      toast.error("There was an error submitting your verification. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Validate fields for the current step
  const validateCurrentStep = async () => {
    let fieldsToValidate: string[] = []

    // Determine which fields to validate based on current step
    if (currentStep === 1) {
      fieldsToValidate = ["licenseImage", "idProofImage"]
    } else if (currentStep === 2) {
      fieldsToValidate = ["accountHolderName", "ifscCode", "accountNumber"]
    } else if (currentStep === 3) {
      fieldsToValidate = ["startedYear", "description"]
    }

    // Trigger validation for the fields
    const result = await trigger(fieldsToValidate as any)

    // If validation fails, collect errors for the current step
    if (!result) {
      const currentErrors: Record<string, string> = {}
      fieldsToValidate.forEach((field) => {
        if (errors[field as keyof VerificationFormData]) {
          currentErrors[field] = errors[field as keyof VerificationFormData]?.message as string
        }
      })
      setStepErrors(currentErrors)
      return false
    }

    setStepErrors({})
    return true
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      // Clear errors when going back
      setStepErrors({})
    }
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <motion.div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step === currentStep
                  ? "bg-blue-600 text-white"
                  : step < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => step < currentStep && setCurrentStep(step)}
              style={{ cursor: step < currentStep ? "pointer" : "default" }}
            >
              {step < currentStep ? <CheckCircle className="w-5 h-5" /> : <span>{step}</span>}
            </motion.div>

            {step < 3 && <div className={`w-16 h-1 ${step < currentStep ? "bg-green-500" : "bg-gray-200"}`}></div>}
          </div>
        ))}
      </div>
    )
  }

  const renderErrorMessage = (fieldName: string) => {
    const errorMessage = (errors[fieldName as keyof VerificationFormData]?.message as string) || stepErrors[fieldName]

    if (!errorMessage) return null

    return (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-sm mt-1 flex items-center"
      >
        <AlertTriangle className="h-4 w-4 mr-1" />
        {errorMessage}
      </motion.p>
    )
  }

  const renderStep1 = () => {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="licenseImage" className="text-base font-medium">
            Business License
          </Label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              errors.licenseImage ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-blue-500"
            }`}
          >
            <input
              id="licenseImage"
              type="file"
              accept="image/*"
              className="hidden"
              {...register("licenseImage")}
              onChange={(e) => handleFileChange(e, "license")}
            />
            {licensePreview ? (
              <div className="space-y-4">
                <img
                  src={licensePreview || "/placeholder.svg"}
                  alt="License Preview"
                  className="max-h-40 mx-auto rounded-md"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("licenseImage")?.click()}
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <label htmlFor="licenseImage" className="cursor-pointer block">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </label>
            )}
          </div>
          {renderErrorMessage("licenseImage")}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="idProofImage" className="text-base font-medium">
            Owner ID Proof
          </Label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              errors.idProofImage ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-blue-500"
            }`}
          >
            <input
              id="idProofImage"
              type="file"
              accept="image/*"
              className="hidden"
              {...register("idProofImage")}
              onChange={(e) => handleFileChange(e, "idProof")}
            />
            {idProofPreview ? (
              <div className="space-y-4">
                <img
                  src={idProofPreview || "/placeholder.svg"}
                  alt="ID Proof Preview"
                  className="max-h-40 mx-auto rounded-md"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("idProofImage")?.click()}
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <label htmlFor="idProofImage" className="cursor-pointer block">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </label>
            )}
          </div>
          {renderErrorMessage("idProofImage")}
        </motion.div>
      </motion.div>
    )
  }

  const renderStep2 = () => {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="accountHolderName" className="text-base font-medium">
            Account Holder Name
          </Label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              id="accountHolderName"
              className={`pl-10 ${errors.accountHolderName ? "border-red-400" : ""}`}
              placeholder="Enter account holder's full name"
              {...register("accountHolderName")}
            />
          </div>
          {renderErrorMessage("accountHolderName")}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="ifscCode" className="text-base font-medium">
            IFSC Code
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              id="ifscCode"
              className={`pl-10 ${errors.ifscCode ? "border-red-400" : ""}`}
              placeholder="Enter bank IFSC code (e.g., SBIN0123456)"
              {...register("ifscCode")}
            />
          </div>
          {renderErrorMessage("ifscCode")}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="accountNumber" className="text-base font-medium">
            Account Number
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              id="accountNumber"
              className={`pl-10 ${errors.accountNumber ? "border-red-400" : ""}`}
              placeholder="Enter bank account number"
              {...register("accountNumber")}
            />
          </div>
          {renderErrorMessage("accountNumber")}
        </motion.div>
      </motion.div>
    )
  }

  const renderStep3 = () => {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="startedYear" className="text-base font-medium">
            Business Started Year
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              id="startedYear"
              type="text"
              className={`pl-10 ${errors.startedYear ? "border-red-400" : ""}`}
              placeholder="Enter year business started (e.g., 2020)"
              {...register("startedYear")}
            />
          </div>
          {renderErrorMessage("startedYear")}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="description" className="text-base font-medium">
            Business Description
          </Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-500 h-5 w-5" />
            <Textarea
              id="description"
              className={`pl-10 min-h-[120px] ${errors.description ? "border-red-400" : ""}`}
              placeholder="Describe your business, services offered, and experience"
              {...register("description")}
            />
          </div>
          {renderErrorMessage("description")}
        </motion.div>

        <motion.div variants={itemVariants} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <AlertCircle className="text-blue-500 h-5 w-5 mt-0.5 mr-2" />
            <p className="text-sm text-blue-700">
              Your verification details will be reviewed by our team. This process typically takes 1-3 business days.
              You'll be notified once your account is verified.
            </p>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto p-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Account Verification</h1>
          <p className="text-gray-600 mt-2">Complete the verification process to unlock all features</p>
        </motion.div>

        {renderStepIndicator()}

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Document Verification"}
              {currentStep === 2 && "Bank Details"}
              {currentStep === 3 && "Business Information"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Upload required documents for verification"}
              {currentStep === 2 && "Provide your banking information"}
              {currentStep === 3 && "Tell us more about your business"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="verification-form" onSubmit={handleSubmit(onSubmit)}>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={currentStep === 1 ? "opacity-50" : ""}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            </motion.div>

            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  form="verification-form"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Verification
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          </CardFooter>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 p-4 bg-white rounded-lg shadow border border-gray-100"
        >
          <h3 className="font-medium text-gray-900 mb-2">Why verification is important:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
              <span>Builds trust with customers seeking reliable service providers</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
              <span>Verified accounts receive priority in search results</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
              <span>Access to premium features and promotional opportunities</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
              <span>Secure payment processing and financial transactions</span>
            </li>
          </ul>
        </motion.div>
      </main>

      <footer className="p-4 text-center bg-slate-900 text-white mt-8">
        <p>© 2025 Car Service Provider. All Rights Reserved.</p>
      </footer>
    </div>
  )
}
