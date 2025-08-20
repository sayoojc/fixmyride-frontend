"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { axiosPrivate } from "@/api/axios"
import createAdminApi from "@/services/adminApi"
import type { AxiosError } from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ShoppingCart,
  ArrowLeft,
  User,
  Car,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  Package,
  CreditCard,
} from "lucide-react"
import type { Order } from "@/types/order"
import { toast } from "react-toastify"
import { FaRupeeSign } from "react-icons/fa"
import { useRouter, useParams } from "next/navigation"

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
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function OrderDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId as string

  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        const response = await adminApi.getOrderById(orderId);
        console.log("Order details:", response)
        setOrder(response.order)
      } catch (error) {
        const err = error as AxiosError<{ message: string }>
        toast.error(err.response?.data.message || "Error fetching order details")
        router.push("/admin/orders")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
          <Button onClick={() => router.push("/admin/dashboard/booking-history")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 md:ml-64 transition-all duration-200 ease-in-out overflow-y-auto">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/orders")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Button>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Order #{order._id.slice(-8)}</h2>
              <p className="text-sm text-slate-500">Order details and information</p>
            </div>
          </div>
          <Badge variant={getBadgeVariant(order.orderStatus)} className="text-sm">
            {order.orderStatus}
          </Badge>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Order Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Order ID</p>
                  <p className="text-lg font-semibold">#{order._id.slice(-8)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold text-emerald-600 flex items-center gap-1">
                    <FaRupeeSign className="h-4 w-4" />
                    {order.totalAmount}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Order Date</p>
                  <p className="text-lg font-semibold">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Name</p>
                    <p className="text-base">{order.user.name}</p>
                  </div>
                  {order.user.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-base">{order.user.email}</span>
                    </div>
                  )}
                  {order.user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-base">{order.user.phone}</span>
                    </div>
                  )}
                </div>
                {order.address && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Service Address</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <div className="text-base">
                        <p>{order.address.addressLine1}</p>
                        <p>
                          {order.address.city}, {order.address.state}
                        </p>
                        <p>{order.address.zipCode}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Vehicle</p>
                  <p className="text-lg font-semibold">
                    {order.vehicle.brandName} {order.vehicle.modelName}
                  </p>
                </div>
                {order.vehicle.year && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Year</p>
                    <p className="text-base">{order.vehicle.year}</p>
                  </div>
                )}
                {order.vehicle && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">License Plate</p>
                    <p className="text-base">licence plate</p>
                  </div>
                )}
                {order.vehicle && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Color</p>
                    <p className="text-base">order.vehicle.color</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Services Ordered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.services.map((service, index) => (
                  <div key={service._id}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{service.fuelType}</p>
                        {service.description && <p className="text-sm text-gray-600">{service.description}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold flex items-center gap-1">
                          <FaRupeeSign className="h-3 w-3" />
                          service.price
                        </p>
                      </div>
                    </div>
                    {index < order.services.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Schedule */}
          {order.serviceDate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Service Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-base">Scheduled for: {order.serviceDate}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base">Subtotal</span>
                  <span className="font-semibold flex items-center gap-1">
                    <FaRupeeSign className="h-3 w-3" />
                    {order.totalAmount}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-emerald-600 flex items-center gap-1">
                    <FaRupeeSign className="h-4 w-4" />
                    {order.totalAmount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
