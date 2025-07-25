"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, Search, Filter, Loader2 } from "lucide-react"
import createAdminApi from "@/services/adminApi"
import { axiosPrivate } from "@/api/axios"
import { toast } from "react-toastify"
import {
  UniversalTable,
  TableBadge,
  TableAvatar,
  type TableColumn,
} from "../../../../components/Table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { IServiceProvider } from "@/types/provider"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const adminApi = createAdminApi(axiosPrivate)
const ProviderManagement = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [providers, setProviders] = useState<IServiceProvider[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    provider: IServiceProvider
    action: "list" | "unlist"
  } | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true)
        const response = await adminApi.getProvidersList(debouncedSearchTerm, currentPage, statusFilter)
        setProviders(response.data.providerResponse.sanitizedProviders)
        setTotalPages(response.data.providerResponse.totalPage)
      } catch (error) {
        toast.error("Failed to fetch providers")
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [debouncedSearchTerm, currentPage, statusFilter])
useEffect(() => {
  console.log('the total pages',totalPages)
},[totalPages]);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const actions = [
    {
      label: (item:IServiceProvider) => (item.isListed ? "Unlist" : "List"),
      onClick: (provider:IServiceProvider) => {
        setConfirmAction({
          provider,
          action: provider.isListed ? "unlist" : "list",
        })
      },
      variant: (item:IServiceProvider) => (item.isListed ? "destructive" : "outline"),
      disabled: (provider:IServiceProvider) => actionLoading === provider._id,
    },
  ]

  const columns: TableColumn<IServiceProvider>[] = [
    {
      key: "provider",
      header: "Provider",
      render: (_, provider) => (
        <TableAvatar
          src={provider.profilePicture}
          fallback={provider.name.charAt(0)}
          name={provider.name}
          email={provider.email}
        />
      ),
    },
    {
      key: "name",
      header: "Business Name",
    },
    {
      key: "verificationStatus",
      header: "Verification",
      render: (status) => (
        <TableBadge variant={status === "approved" ? "default" : status === "rejected" ? "destructive" : "secondary"}>
          {status || "Pending"}
        </TableBadge>
      ),
    },
  ]
  const handleProviderStatusChange = async (provider: IServiceProvider, action: "list" | "unlist") => {
    try {
      setActionLoading(provider._id)
      const updatedStatus = action === "list"
      await adminApi.toggleProviderListing(provider._id)
      setProviders(providers.map((p) => (p._id === provider._id ? { ...p, isListed: updatedStatus } : p)))
      toast.success(`Provider ${action}ed successfully`)
    } catch (error) {
      toast.error(`Failed to ${action} provider`)
    } finally {
      setActionLoading(null)
      setConfirmAction(null)
    }
  }

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
      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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
                  placeholder="Search providers..."
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
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setDebouncedSearchTerm("")
                  setStatusFilter("all")
                  setCurrentPage(1)
                }}
                variant="outline"
                className="text-sm"
              >
                Reset Filters
              </Button>
              <div className="text-xs lg:text-sm text-gray-600 flex items-center justify-center lg:justify-start">
                Total: {providers.length} providers
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
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
                <UniversalTable
                  title="Provider Management"
                  description="Manage service providers and their verification status"
                  data={providers}
                  columns={columns}
                  actions={actions}
                  loading={false}
                  emptyMessage="No providers found matching your filters"
                />
              </motion.div>
            )}
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
      </main>
      {/* Confirmation Modal */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.action === "unlist" ? "Unlist Provider" : "List Provider"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmAction?.action} {confirmAction?.provider.name}?
              {confirmAction?.action === "unlist"
                ? " This will remove them from the active providers list."
                : " This will add them to the active providers list."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmAction) {
                  handleProviderStatusChange(confirmAction.provider, confirmAction.action)
                }
              }}
              disabled={!!actionLoading}
              className={
                confirmAction?.action === "unlist" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {confirmAction?.action === "unlist" ? "Unlisting..." : "Listing..."}
                </>
              ) : confirmAction?.action === "unlist" ? (
                "Unlist Provider"
              ) : (
                "List Provider"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ProviderManagement
