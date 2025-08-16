"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { axiosPrivate } from "@/api/axios"
import createUserApi from "@/services/userApi"
import type { AxiosError } from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  MapPin,
  Car,
  Package,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Receipt,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { toast } from "react-toastify"
import type { OrderHistory } from "@/types/order"

const userApi = createUserApi(axiosPrivate)

interface PaginatedOrderResponse {
  orders: OrderHistory[]
  pagination: {
    currentPage: number
    totalPages: number
    totalOrders: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "placed":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200"
    case "in-progress":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    case "failed":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getPaymentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
    case "success":
      return "bg-green-100 text-green-800 border-green-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "failed":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const formatAddress = (address: OrderHistory["address"]) => {
  return [address.addressLine1, address.addressLine2, address.city, address.state, address.zipCode]
    .filter(Boolean)
    .join(", ")
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const fetchOrders = async (page: number = currentPage, limit: number = itemsPerPage) => {
    try {
      setLoading(true)
      const response = await userApi.fetchOrderHistory({ page, limit })
      setOrders(response.orders || [])
      setTotalPages(response.pagination.totalPages)
      setTotalOrders(response.pagination.totalOrders)
      setHasNextPage(response.pagination.hasNextPage)
      setHasPrevPage(response.pagination.hasPrevPage)
      setCurrentPage(response.pagination.currentPage)
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      toast.error(err.response?.data.message || "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchOrders(currentPage, itemsPerPage)
  }, [itemsPerPage,currentPage])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      fetchOrders(page, itemsPerPage)
      setExpandedOrders(new Set())
    }
  }

  const handleItemsPerPageChange = (value: string) => {
    const newLimit = Number.parseInt(value)
    setItemsPerPage(newLimit)
    setCurrentPage(1)
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div className="container mx-auto py-6" initial="hidden" animate="visible" variants={fadeIn}>
      <Card className="border shadow-lg overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Receipt className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">Order History</CardTitle>
                <p className="text-slate-600 mt-1">Track and manage all your service orders</p>
              </div>
            </div>

            {totalOrders > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Show:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-slate-600">per page</span>
              </div>
            )}
          </div>

          {totalOrders > 0 && (
            <div className="mt-4 text-sm text-slate-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalOrders)} of{" "}
              {totalOrders} orders
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6">
          <div className="relative">
            {loading && orders.length > 0 && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            )}

            {orders.length === 0 && !loading ? (
              <motion.div className="text-center py-12" variants={fadeIn}>
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No Orders Yet</h3>
                <p className="text-slate-600 mb-6">
                  You haven't placed any service orders yet. Book your first service to get started!
                </p>
                <Button className="bg-red-600 hover:bg-red-700 text-white">Book a Service</Button>
              </motion.div>
            ) : (
              <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="visible">
                {orders.map((order) => {
                  const isExpanded = expandedOrders.has(order._id)

                  return (
                    <motion.div key={order._id} variants={fadeIn}>
                      <Card className="border border-slate-200 hover:shadow-md transition-shadow duration-300">
                        <CardContent className="p-0">
                          {/* Order Header */}
                          <div className="p-4 border-b border-slate-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                                  <Truck className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-slate-800">
                                    Order #{order._id.slice(-8).toUpperCase()}
                                  </h3>
                                  <p className="text-sm text-slate-600">
                                    {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Badge className={getStatusColor(order.orderStatus)}>
                                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                </Badge>
                                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleOrderExpansion(order._id)}
                                  className="text-slate-600 hover:text-slate-800"
                                >
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Vehicle Info */}
                              <div className="flex items-center space-x-3">
                                <Car className="h-5 w-5 text-slate-400" />
                                <div>
                                  <p className="font-medium text-slate-800">
                                    {order.vehicle.brandName} {order.vehicle.modelName}
                                  </p>
                                  <p className="text-sm text-slate-600">Fuel: {order.vehicle.fuel}</p>
                                </div>
                              </div>

                              {/* Service Date */}
                              {order.serviceDate && (
                                <div className="flex items-center space-x-3">
                                  <Calendar className="h-5 w-5 text-slate-400" />
                                  <div>
                                    <p className="font-medium text-slate-800">{formatDate(order.serviceDate)}</p>
                                    {order.selectedSlot && (
                                      <p className="text-sm text-slate-600">{order.selectedSlot}</p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Total Amount */}
                              <div className="flex items-center space-x-3">
                                <CreditCard className="h-5 w-5 text-slate-400" />
                                <div>
                                  <p className="font-medium text-slate-800">₹{order.totalAmount.toLocaleString()}</p>
                                  <p className="text-sm text-slate-600">
                                    {order.paymentMethod === "online" ? "Online Payment" : "Cash Payment"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t border-slate-100"
                            >
                              <div className="p-4 space-y-6">
                                {/* Services */}
                                <div>
                                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                                    <Package className="h-4 w-4 mr-2" />
                                    Services Booked
                                  </h4>
                                  <div className="space-y-3">
                                    {order.services.map((service) => (
                                      <div key={service._id} className="bg-slate-50 rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <h5 className="font-medium text-slate-800">{service.title}</h5>
                                            <p className="text-sm text-slate-600">{service.description}</p>
                                            <Badge variant="outline" className="mt-1 text-xs">
                                              {service.servicePackageCategory}
                                            </Badge>
                                          </div>
                                          <p className="font-semibold text-slate-800">
                                            ₹{service.priceBreakup.total.toLocaleString()}
                                          </p>
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="text-xs text-slate-600 space-y-1">
                                          {service.priceBreakup.parts.map((part, index) => (
                                            <div key={index} className="flex justify-between">
                                              <span>
                                                {part.name} (x{part.quantity})
                                              </span>
                                              <span>₹{(part.price * part.quantity).toLocaleString()}</span>
                                            </div>
                                          ))}
                                          <div className="flex justify-between">
                                            <span>Labor Charge</span>
                                            <span>₹{service.priceBreakup.laborCharge.toLocaleString()}</span>
                                          </div>
                                          {service.priceBreakup.discount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                              <span>Discount</span>
                                              <span>-₹{service.priceBreakup.discount.toLocaleString()}</span>
                                            </div>
                                          )}
                                          {service.priceBreakup.tax > 0 && (
                                            <div className="flex justify-between">
                                              <span>Tax</span>
                                              <span>₹{service.priceBreakup.tax.toLocaleString()}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <Separator />

                                {/* Address */}
                                <div>
                                  <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Service Address
                                  </h4>
                                  <p className="text-slate-600">{formatAddress(order.address)}</p>
                                </div>

                                {/* Coupon */}
                                {order.coupon?.applied && (
                                  <>
                                    <Separator />
                                    <div>
                                      <h4 className="font-semibold text-slate-800 mb-2">Coupon Applied</h4>
                                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium text-green-800">{order.coupon.code}</span>
                                          <span className="text-green-600">
                                            -₹{order.coupon.discountAmount.toLocaleString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}

                                <Separator />

                                {/* Payment Summary */}
                                <div>
                                  <h4 className="font-semibold text-slate-800 mb-3">Payment Summary</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-slate-600">Subtotal</span>
                                      <span>₹{order.totalAmount.toLocaleString()}</span>
                                    </div>
                                    {order.coupon?.applied && (
                                      <div className="flex justify-between text-green-600">
                                        <span>Coupon Discount</span>
                                        <span>-₹{order.coupon.discountAmount.toLocaleString()}</span>
                                      </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between font-semibold text-lg">
                                      <span>Total Amount</span>
                                      <span>₹{order.totalAmount.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Status Reason */}
                                {order.statusReason && (
                                  <>
                                    <Separator />
                                    <div>
                                      <h4 className="font-semibold text-slate-800 mb-2">Status Note</h4>
                                      <p className="text-slate-600 text-sm">{order.statusReason}</p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Page info */}
              <div className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </div>

              {/*controls */}
              <div className="flex items-center space-x-2">
                {/* Previous button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrevPage || loading}
                  className="flex items-center space-x-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === "..." ? (
                        <span className="px-2 py-1 text-slate-400">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page as number)}
                          disabled={loading}
                          className={`min-w-[40px] ${
                            currentPage === page ? "bg-red-600 hover:bg-red-700 text-white" : "hover:bg-slate-50"
                          }`}
                        >
                          {page}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Next button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNextPage || loading}
                  className="flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
