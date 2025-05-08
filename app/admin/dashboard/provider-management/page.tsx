"use client"

import { useState, useEffect } from "react"
import { motion} from "framer-motion"
import Link from "next/link"
import { Eye } from "lucide-react"
import createAdminApi from "@/services/adminApi"
import { axiosPrivate } from "@/api/axios"
import { toast } from "react-toastify"

// Import shadcn components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Define the IServiceProvider interface (already provided)
export interface IServiceProvider {
    _id:string
  name: string;
  ownerName: string;
  email: string;
  phone?: string;
  googleId?: string;
  provider?: string;
  address?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  isListed: boolean;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  license?: string;
  ownerIdProof?: string;
  profilePicture?: string;
  coverPhoto?: string;
  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  startedYear?: number;
  description?: string;
}

const adminApi = createAdminApi(axiosPrivate)

const ProviderManagement = () => {
  const [providers, setProviders] = useState<IServiceProvider[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedProvider, setSelectedProvider] = useState<IServiceProvider | null>(null)
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false)


  // Fetch providers data
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true)
        const response = await adminApi.getProvidersList()
        console.log('response',response);
        setProviders(response.data.providers) 
        
      } catch (error) {
        console.error("Failed to fetch providers:", error)
        setLoading(false)
        toast.error("Failed to fetch providers")
      }
    }

    fetchProviders()
    setLoading(false)
  }, [])

  // Filter providers based on search term and filters


  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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

  // Placeholder for toggling provider listing status
//   const toggleProviderStatus = async (providerId: string) => {
//     try {
//       const provider = providers.find(p => p.email === providerId) // Assuming email as unique ID
//       if (!provider) return
//       const updatedStatus = !provider.isListed
//       await adminApi.updateProvider(providerId, { isListed: updatedStatus })
//       setProviders(providers.map(p => 
//         p.email === providerId ? { ...p, isListed: updatedStatus } : p
//       ))
//       toast.success(`Provider ${updatedStatus ? "listed" : "unlisted"} successfully`)
//     } catch (error) {
//       console.error("Failed to update provider status:", error)
//       toast.error("Failed to update provider status")
//     }
//   }


  return (
    <div className="flex-1 md:ml-64 transition-all duration-200 ease-in-out overflow-y-auto">
      {/* Top header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Provider Management</h2>
            <p className="text-sm text-slate-500">Manage and verify service providers</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4 md:p-6 max-w-7xl mx-auto">

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Service Providers</CardTitle>
            <CardDescription>{providers.length} providers found</CardDescription>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Listing Status</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {providers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                          No providers found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                        providers.map((provider) => (
                        <motion.tr key={provider.email} variants={itemVariants} className="border-b">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={provider.profilePicture || `/api/placeholder/32/32?text=${provider.name.charAt(0)}`} />
                                <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{provider.name}</div>
                                <div className="text-xs text-slate-500">{provider.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{provider.name}</TableCell>
                          <TableCell>{provider.ownerName}</TableCell>
                          <TableCell>{new Date(provider.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {/* <Badge
                              variant={provider.isListed ? "success" : "outline"}
                            >
                              {provider.isListed ? "Listed" : "Unlisted"}
                            </Badge> */}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                provider.verificationStatus === "approved"
                                  ? "default"
                                  : provider.verificationStatus === "rejected"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {provider.verificationStatus || "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                            {!provider.verificationStatus ? (
  <p>Not Applied</p>
) : provider.verificationStatus === "pending" ? (
  <Button variant="outline" size="sm" asChild>
    <Link href={`/admin/dashboard/provider-management/verify-provider?id=${provider._id}`}>
      <Eye className="h-4 w-4 mr-1" />
      Verify
    </Link>
  </Button>
) : null}
  
                              <Button
                                variant={provider.isListed ? "destructive" : "outline"}
                                size="sm"
                                // onClick={() => toggleProviderStatus(provider.email)}
                              >
                                {provider.isListed ? "Unlist" : "List"}
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default ProviderManagement