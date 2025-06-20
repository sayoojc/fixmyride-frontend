"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import createAdminApi from "@/services/adminApi"
import { axiosPrivate } from "@/api/axios"
const adminApi = createAdminApi(axiosPrivate)
import type { IVerification } from "@/types/provider"
import { CheckCircle, XCircle, FileText, Building, CreditCard, ArrowLeft } from "lucide-react"
import { toast } from "react-toastify"

// Import shadcn components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// Define TypeScript interfaces
import type { IServiceProvider } from "@/types/provider"

interface ProviderVerificationProps {
  onBack: () => void
}

const ProviderVerification = ({ onBack }: ProviderVerificationProps) => {
  const [provider, setProvider] = useState<IServiceProvider | null>(null)
  const [verificationData, setVerificationData] = useState<IVerification | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [currentTab, setCurrentTab] = useState<string>("idProof")
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)
  const [verificationAction, setVerificationAction] = useState<"Verified" | "Rejected" | null>(null)
  const [adminNotes, setAdminNotes] = useState<string>("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const providerId = searchParams.get("id")
  // Fetch provider data
  useEffect(() => {
    const fetchProvider = async () => {
      if (!providerId) return
      try {
        setLoading(true)
        const verificationData = await adminApi.getVerificationData(providerId);
        console.log('the verification data from the verify provider',verificationData)
        setVerificationData(verificationData.data.verificationData)
        const response = await adminApi.getProviderById(providerId)
        console.log('the provider',response);
        setProvider(response.data.provider)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch provider details:", error)
        setLoading(false)
        toast.error("Failed to fetch provider details")
      }
    }

    fetchProvider()
  }, [providerId])

  // Open confirmation modal
  const openConfirmModal = (action: "Verified" | "Rejected") => {
    setVerificationAction(action)
    setIsConfirmModalOpen(true)
  }

  // Close confirmation modal
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false)
    setVerificationAction(null)
  }

  // Handle verification
  const handleVerification = async () => {
    if (!provider || !verificationAction || !providerId) return

    try {
      // Include admin notes in the verification request
      const response = adminApi.verifyProviderApi(providerId, verificationAction, adminNotes)
      toast.success(`provider ${verificationAction} successfully`)
      router.push("/admin/dashboard/provider-management")
      closeConfirmModal()
    } catch (error) {
      console.error("Failed to verify provider:", error)
      toast.error("Failed to update verification status")
    }
  }

  // Animation variants for Framer Motion
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  if (loading) {
    return (
      <div className="h-screen p-4">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="flex gap-4">
            <div className="w-64 flex-shrink-0">
              <div className="bg-slate-200 border rounded-xl h-96"></div>
            </div>
            <div className="flex-1">
              <div className="h-8 bg-slate-200 rounded mb-4"></div>
              <div className="h-80 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="h-screen p-4">
        <div className="max-w-7xl mx-auto text-center py-8">
          <h3 className="text-2xl font-semibold text-slate-800 mb-2">Provider Not Found</h3>
          <p className="text-slate-500 mb-4">The provider you're looking for does not exist or has been removed.</p>
          <Button onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="h-screen flex flex-col overflow-hidden"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Top header */}
      <header className="bg-white border-b border-slate-200 w-[85%] ml-[250px] overflow-hidden p-2 shadow-sm py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Provider Verification</h2>
              <p className="text-xs text-slate-500">Review and verify provider documentation</p>
            </div>
          </div>
          <Badge
            variant={
              provider?.verificationStatus === "approved"
                ? "default"
                : provider?.verificationStatus === "rejected"
                  ? "destructive"
                  : "secondary"
            }
            className="text-xs py-1"
          >
            {provider?.verificationStatus}
          </Badge>
        </div>
      </header>

      {/* Main content */}
      <main className="w-[85%] ml-[250px] overflow-hidden p-2">
        <div className="flex gap-3 h-full">
          {/* Provider Information Card */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white border rounded-lg p-3 shadow-sm h-full overflow-auto">
              <div className="flex items-center mb-2">
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage src={`/api/placeholder/96/96?text=${provider?.name.charAt(0)}`} />
                  <AvatarFallback>{provider?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-base font-semibold">{provider?.name}</h3>
                  <p className="text-xs text-slate-500">{provider?.email}</p>
                </div>
              </div>

              <div className="space-y-1 mt-2 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Business:</span>
                  <span className="font-medium text-slate-800 truncate ml-1">{provider?.name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Started:</span>
                  <span className="font-medium text-slate-800">{verificationData?.startedYear}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Status:</span>
                  <Badge variant={provider.isListed ? "default" : "destructive"} className="text-xs">
                    {provider.isListed ? "Active" : "Blocked"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">Verification:</span>
                  <Badge
                    variant={
                      provider?.verificationStatus === "approved"
                        ? "default"
                        : provider?.verificationStatus === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {provider?.verificationStatus}
                  </Badge>
                </div>
              </div>

              {provider?.verificationStatus === "pending" && (
                <div className="mt-4 space-y-2">
                  <Button
                    onClick={() => openConfirmModal("Verified")}
                    className="w-full bg-green-600 hover:bg-green-700 h-8 text-xs"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verify Provider
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => openConfirmModal("Rejected")}
                    className="w-full h-8 text-xs"
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Reject Provider
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full flex flex-col">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="idProof" className="py-1 text-xs">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>ID Proof</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="shopLicense" className="py-1 text-xs">
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    <span>Shop License</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="bankDetails" className="py-1 text-xs">
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    <span>Bank Details</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="description" className="py-1 text-xs">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>Description</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto">
                {/* ID Proof Tab */}
                <TabsContent value="idProof" className="mt-2 h-full">
                  <Card className="h-full">
                    <CardHeader className="py-2 px-4">
                      <CardTitle className="flex items-center text-sm text-slate-800">
                        <FileText className="h-4 w-4 mr-1 text-blue-600" />
                        ID Proof Document
                      </CardTitle>
                      <CardDescription className="text-xs">Government issued identification</CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 h-[calc(100%-60px)]">
                      <div className="bg-slate-100 rounded-lg overflow-hidden h-full flex items-center justify-center">
                        <img
                          src={verificationData?.idProofImage || "/api/placeholder/400/320"}
                          alt="ID Proof"
                          className="w-[400px] h-[300px] object-contain"
                          style={{ maxWidth: "100%" }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Shop License Tab */}
                <TabsContent value="shopLicense" className="mt-2 h-full">
                  <Card className="h-full">
                    <CardHeader className="py-2 px-4">
                      <CardTitle className="flex items-center text-sm text-slate-800">
                        <Building className="h-4 w-4 mr-1 text-blue-600" />
                        Shop License Document
                      </CardTitle>
                      <CardDescription className="text-xs">Business license or permit</CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 h-[calc(100%-60px)]">
                      <div className="bg-slate-100 rounded-lg overflow-hidden h-full flex items-center justify-center">
                        <img
                          src={verificationData?.licenseImage || "/api/placeholder/400/320"}
                          alt="Shop License"
                          className="w-[400px] h-[300px] object-contain"
                          style={{ maxWidth: "100%" }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Bank Details Tab */}
                <TabsContent value="bankDetails" className="mt-2 h-full">
                  <Card className="h-full">
                    <CardHeader className="py-2 px-4">
                      <CardTitle className="flex items-center text-sm text-slate-800">
                        <CreditCard className="h-4 w-4 mr-1 text-blue-600" />
                        Bank Account Details
                      </CardTitle>
                      <CardDescription className="text-xs">Payment information</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 overflow-auto">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-slate-500 mb-1">Account Holder</p>
                          <p className="text-sm font-semibold">{verificationData?.accountHolderName}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-slate-500 mb-1">Bank name</p>
                          <p className="text-sm font-semibold">{verificationData?.bankName}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-slate-500 mb-1">Account Number</p>
                          <p className="text-sm font-semibold">{verificationData?.accountNumber}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-slate-500 mb-1">IFSC Code</p>
                          <p className="text-sm font-semibold">{verificationData?.ifscCode}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Description Tab */}
                <TabsContent value="description" className="mt-2 h-full">
                  <Card className="h-full">
                    <CardHeader className="py-2 px-4">
                      <CardTitle className="flex items-center text-sm text-slate-800">
                        <FileText className="h-4 w-4 mr-1 text-blue-600" />
                        Business Description
                      </CardTitle>
                      <CardDescription className="text-xs">About the provider's business</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 overflow-auto h-[calc(100%-60px)]">
                      <div className="bg-slate-50 p-3 rounded-lg mb-3">
                        <p className="text-sm whitespace-pre-line">{verificationData?.description}</p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-600">Started in:{verificationData?.startedYear}</span>
                          <Badge variant="outline" className="text-xs font-medium">
                            {/* {provider.startedYear} ({new Date().getFullYear() - Number(provider.startedYear)} years) */}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <Dialog open={isConfirmModalOpen} onOpenChange={closeConfirmModal}>
            <DialogContent className="max-w-xs">
              <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-base">
                    {verificationAction === "Verified" ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Confirm Verification
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-600" />
                        Confirm Rejection
                      </>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    {verificationAction === "Verified"
                      ? "Are you sure you want to verify this provider?"
                      : "Are you sure you want to reject this provider?"}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-2 mb-4">
                  <div className="bg-slate-50 p-2 rounded-lg text-xs">
                    <p className="font-medium text-slate-800">{provider?.ownerName}</p>
                    <p className="text-slate-500">{provider?.name}</p>
                  </div>

                  <div className="mt-3">
                    <label htmlFor="admin-notes" className="text-xs font-medium text-slate-700 block mb-1">
                      Admin Notes
                    </label>
                    <textarea
                      id="admin-notes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add verification notes here..."
                      className="w-full text-xs p-2 border border-slate-300 rounded-md h-20 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <DialogFooter className="flex-row justify-end gap-2">
                  <Button variant="outline" onClick={closeConfirmModal} size="sm" className="text-xs h-7">
                    Cancel
                  </Button>
                  <Button
                    variant={verificationAction === "Verified" ? "default" : "destructive"}
                    onClick={handleVerification}
                    size="sm"
                    className={`text-xs h-7 ${verificationAction === "Verified" ? "bg-green-600 hover:bg-green-700" : ""}`}
                  >
                    {verificationAction === "Verified" ? "Verify" : "Reject"}
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ProviderVerification
