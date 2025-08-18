"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { axiosPrivate } from "@/api/axios"
import createAdminApi from "@/services/adminApi"
// import type { IAdmin } from "@/types/admin"
import type { AxiosError } from "axios"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ShoppingCart,
  Search,
  MoreVertical,
  Eye,
  Calendar,
  DollarSign,
  User,
  Car,
  MapPin,
  Clock,
  Filter,
  CalendarDays,
} from "lucide-react"
import type { Order } from "@/types/order"
import { toast } from "react-toastify"

const adminApi = createAdminApi(axiosPrivate)

const getOrderStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-emerald-700 bg-emerald-100"
    case "confirmed":
      return "text-indigo-700 bg-indigo-100"
    case "in-progress":
      return "text-amber-700 bg-amber-100"
    case "cancelled":
    case "failed":
      return "text-rose-700 bg-rose-100"
    case "placed":
      return "text-violet-700 bg-violet-100"
    default:
      return "text-gray-700 bg-gray-100"
  }
}

const getBadgeVariant = (status: string) => {
  switch (status) {
    case "completed":
      return "default"
    case "confirmed":
      return "secondary"
    case "in-progress":
      return "outline"
    case "cancelled":
    case "failed":
      return "destructive"
    default:
      return "outline"
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
//   const [adminData, setAdminData] = useState<IAdmin | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalOrders, setTotalOrders] = useState(0)
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  })

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const response = await adminApi.getProfileData()
//         setAdminData(response.admin)
//         setLoading(false)
//       } catch (error) {
//         const err = error as AxiosError<{ message: string }>
//         toast.error(err.response?.data.message || "Error fetching profile data")
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true)
        const response = await adminApi.getAllOrders({
          search: debouncedSearchTerm,
          page: currentPage,
          limit: itemsPerPage,
          status: statusFilter,
          dateFilter,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        })
        setOrders(response.orders)
        setTotalPages(response.totalPages)
        setTotalOrders(response.totalOrders)
        setOrdersLoading(false)
        setLoading(false);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>
        toast.error(err.response?.data.message || "Error fetching orders")
        setOrdersLoading(false)
      }
    }
    fetchOrders()
  }, [debouncedSearchTerm, currentPage, itemsPerPage, statusFilter, dateFilter, dateRange])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value)
    setCurrentPage(1)

    // Reset custom date range when switching to preset filters
    if (value !== "custom") {
      setDateRange({ startDate: "", endDate: "" })
    }
  }

  const viewOrderDetails = (orderId: string) => {
    // Navigate to order details page
    window.location.href = `/admin/orders/${orderId}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 md:ml-64 transition-all duration-200 ease-in-out overflow-y-auto">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Orders Management</h2>
            <p className="text-sm text-slate-500">Monitor and manage all platform orders</p>
          </div>
        </div>
      </header>

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
                  placeholder="Search orders..."
                  className="pl-10 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="placed">Placed</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={handleDateFilterChange}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="thismonth">This Month</SelectItem>
                  <SelectItem value="lastmonth">Last Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setDebouncedSearchTerm("")
                  setStatusFilter("all")
                  setDateFilter("all")
                  setCurrentPage(1)
                  setDateRange({ startDate: "", endDate: "" })
                }}
                variant="outline"
                className="text-sm"
              >
                Reset Filters
              </Button>
            </div>

            {dateFilter === "custom" && (
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full md:w-[150px] text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">to</span>
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="w-full md:w-[150px] text-sm"
                  />
                </div>
              </div>
            )}

            <div className="text-xs lg:text-sm text-gray-600 flex items-center justify-center lg:justify-start mt-3">
              Total: {totalOrders} orders
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Order Management</CardTitle>
            <CardDescription>{orders.length} orders found</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
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
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                    ? "Try adjusting your filters to see more orders."
                    : "No orders have been placed yet. Orders will appear here once customers start booking services."}
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {orders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="transition-all hover:shadow-lg border-gray-200 hover:border-indigo-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-full ${getOrderStatusColor(order.orderStatus)}`}>
                            <ShoppingCart className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-medium text-gray-900">Order #{order._id.slice(-8)}</h3>
                                  <Badge variant={getBadgeVariant(order.orderStatus)} className="text-xs">
                                    {order.orderStatus}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span>{order.user.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4 text-gray-400" />
                                    <span>
                                      {order.vehicle.brandName} {order.vehicle.modelName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-emerald-600">
                                      {formatCurrency(order.finalAmount)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    {/* <span>{formatDate(order.createdAt)}</span> */}
                                  </div>
                                  {order.serviceDate && (
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-gray-400" />
                                      <span>Service: {order.serviceDate}</span>
                                    </div>
                                  )}
                                  {order.address && (
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-gray-400" />
                                      <span>
                                        {order.address.city}, {order.address.state}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-3">
                                  <p className="text-xs text-gray-500 mb-1">Services:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {order.services.slice(0, 2).map((service) => (
                                      <Badge key={service._id} variant="outline" className="text-xs border-gray-300">
                                        {service.title}
                                      </Badge>
                                    ))}
                                    {order.services.length > 2 && (
                                      <Badge variant="outline" className="text-xs border-gray-300">
                                        +{order.services.length - 2} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => viewOrderDetails(order._id)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
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
            onClick={() => handlePageChange(currentPage + 1)}
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
    </div>
  )
}
