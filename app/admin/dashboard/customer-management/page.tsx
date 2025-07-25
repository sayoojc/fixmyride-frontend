"use client"

import { useState, useEffect } from "react"
import { type TableColumn, UniversalTable, TableBadge } from "../../../../components/Table"
import createAdminApi from "@/services/adminApi"
import { axiosPrivate } from "@/api/axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { toast } from "react-toastify";
import type { IAdminUserInterface } from "@/types/user"
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
import { Loader2 } from "lucide-react"

const adminApi = createAdminApi(axiosPrivate)
const CustomerManagement = () => {
  const [users, setUsers] = useState<IAdminUserInterface[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    user: IAdminUserInterface
    action: "block" | "unblock"
  } | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getUsersApi(debouncedSearchTerm, currentPage, statusFilter);
      setUsers(response.data.users)
      setTotalPages(response.data.totalCount)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserStatusChange = async (user: IAdminUserInterface, action: "block" | "unblock") => {
    try {
      setActionLoading(user._id )
      const response = await adminApi.toggleListing(user.email);
      toast.success('User status updated successfuly')
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          (u._id ) === (user._id ) ? { ...u, isListed: action === "unblock" } : u,
        ),
      )
    } catch (error) {
   toast.error('User status updation failed');
    } finally {
      setActionLoading(null)
      setConfirmAction(null)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchUsers()
  }, [debouncedSearchTerm, currentPage, statusFilter])

  const columns: TableColumn<IAdminUserInterface>[] = [
    {
      key: "name",
      header: "Name",
      accessor: "name",
    },
    {
      key: "email",
      header: "Email",
      accessor: "email",
    },
    {
      key: "isListed",
      header: "Status",
      render: (status: boolean) => (
        <TableBadge variant={status ? "default" : "destructive"}>{status ? "Listed" : "Unlisted"}</TableBadge>
      ),
    },
  ]

  const actions = [
    {
      label: (row: IAdminUserInterface) => (row.isListed ? "Block User" : "Unblock User"),
      onClick: (row: IAdminUserInterface) => {
        setConfirmAction({
          user: row,
          action: row.isListed ? "block" : "unblock",
        })
      },
      disabled: (row: IAdminUserInterface) => actionLoading === (row._id),
      loading: (row: IAdminUserInterface) => actionLoading === (row._id ),
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
      <main className="p-4 md:p-6 max-w-7xl mx-auto">
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
                    placeholder="Search customers..."
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
                  Total: {users.length} customers
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>{users.length} customers found</CardDescription>
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="overflow-x-auto"
              >
                <UniversalTable
                  title="Customer Management"
                  description="Manage system users and permissions"
                  data={users}
                  columns={columns}
                  actions={actions}
                  loading={false}
                  emptyMessage="No customers found matching your filters"
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
      </main>
      {/* Confirmation Modal */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction?.action === "block" ? "Block User" : "Unblock User"}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmAction?.action} {confirmAction?.user.name}?
              {confirmAction?.action === "block"
                ? " This will prevent them from accessing the platform."
                : " This will restore their access to the platform."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmAction) {
                  handleUserStatusChange(confirmAction.user, confirmAction.action)
                }
              }}
              disabled={!!actionLoading}
              className={
                confirmAction?.action === "block" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {confirmAction?.action === "block" ? "Blocking..." : "Unblocking..."}
                </>
              ) : confirmAction?.action === "block" ? (
                "Block User"
              ) : (
                "Unblock User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default CustomerManagement
