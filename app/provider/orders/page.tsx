"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { axiosPrivate } from "@/api/axios"
import createProviderApi from "@/services/providerApi"
import type { IServiceProvider } from "@/types/provider"
import { ProviderSidebar } from "@/components/provider/ProviderSidebar"
import type { AxiosError } from "axios"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Pagination from "../../../components/Pagination"
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

const providerApi = createProviderApi(axiosPrivate)

const getOrderStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-600 bg-green-50"
    case "confirmed":
      return "text-blue-600 bg-blue-50"
    case "in-progress":
      return "text-yellow-600 bg-yellow-50"
    case "cancelled":
    case "failed":
      return "text-red-600 bg-red-50"
    case "placed":
      return "text-purple-600 bg-purple-50"
    default:
      return "text-gray-600 bg-gray-50"
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

export default function OrdersPage() {
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [providerData, setProviderData] = useState<IServiceProvider | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalOrders, setTotalOrders] = useState(0)
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await providerApi.getProfileData()
        setProviderData(response.provider)
        setLoading(false)
      } catch (error) {
        const err = error as AxiosError<{ message: string }>
        toast.error(err.response?.data.message || "Error fetching profile data")
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true)
        const response = await providerApi.getOrders({
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
      } catch (error) {
        const err = error as AxiosError<{ message: string }>
        setOrders([]);
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
    window.location.href = `/provider/orders/${orderId}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <ProviderSidebar providerData={providerData} />
      <SidebarInset>
        <div className="min-h-screen bg-slate-50">
          {/* Header with breadcrumb */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/provider">Provider</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Orders</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <main className="flex flex-1 flex-col gap-4 p-4">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="h-8 w-8" />
                  Orders
                  <Badge variant="secondary" className="ml-2">
                    {totalOrders}
                  </Badge>
                </h1>
                <p className="text-slate-500 mt-1">Manage and track your service orders</p>
              </div>
            </motion.div>

            {/* Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4">
                    {/* Search and Status Filter Row */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                          placeholder="Search by customer name, vehicle, or order ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
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
                      <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                        <SelectTrigger className="w-full md:w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 per page</SelectItem>
                          <SelectItem value="10">10 per page</SelectItem>
                          <SelectItem value="20">20 per page</SelectItem>
                          <SelectItem value="50">50 per page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date Filter Row */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <Select value={dateFilter} onValueChange={handleDateFilterChange}>
                        <SelectTrigger className="w-full md:w-[180px]">
                          <Filter className="h-4 w-4 mr-2" />
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

                      {dateFilter === "custom" && (
                        <>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
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
                              className="w-full md:w-[150px]"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">to</span>
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
                              className="w-full md:w-[150px]"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Orders List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              {ordersLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-full bg-slate-200">
                            <div className="h-5 w-5 rounded-full bg-slate-300 animate-pulse" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="h-4 w-24 bg-slate-300 rounded animate-pulse" />
                              <div className="h-4 w-12 bg-slate-300 rounded animate-pulse" />
                            </div>
                            <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
                            <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No orders found</h3>
                    <p className="text-slate-500">
                      {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                        ? "Try adjusting your filters to see more orders."
                        : "You haven't received any orders yet. Orders will appear here once customers book your services."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="transition-all hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-full ${getOrderStatusColor(order.orderStatus)}`}>
                            <ShoppingCart className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-medium text-slate-900">Order #{order._id.slice(-8)}</h3>
                                  <Badge variant={getBadgeVariant(order.orderStatus)} className="text-xs">
                                    {order.orderStatus}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>{order.user.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4" />
                                    <span>
                                      {order.vehicle.brandName} {order.vehicle.modelName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    <span className="font-medium">{formatCurrency(order.finalAmount)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {/* <span>{formatDate(order.createdAt)}</span> */}
                                  </div>
                                  {order.serviceDate && (
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>Service: {order.serviceDate}</span>
                                    </div>
                                  )}
                                  {order.address && (
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      <span>
                                        {order.address.city}, {order.address.state}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-3">
                                  <p className="text-xs text-slate-500 mb-1">Services:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {order.services.slice(0, 2).map((service) => (
                                      <Badge key={service._id} variant="outline" className="text-xs">
                                        {service.title}
                                      </Badge>
                                    ))}
                                    {order.services.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{order.services.length - 2} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                ))
              )}
            </motion.div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
