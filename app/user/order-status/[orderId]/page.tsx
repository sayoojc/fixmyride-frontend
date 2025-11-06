"use client"

import { Package, CheckCircle, Clock, Wrench, Car, MapPin, Calendar, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { axiosPrivate } from "@/api/axios"
import createUserApi from "@/services/userApi"
import type { IOrderResponse } from "@/types/order"
import { generateReceiptPDF } from "@/utils/generateOrderRecieptPdf"

const userApi = createUserApi(axiosPrivate)

export default function OrderStatusPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId
  const [orderData, setOrderData] = useState<IOrderResponse>()

  useEffect(() => {
    const fetchOrderData = async (id: string) => {
      try {
        const response = await userApi.getOrderdetails(id)
        setOrderData(response.order)
      } catch (error) {
        toast.error("Failed to fetch order status")
      }
    }
    if (orderId) {
      fetchOrderData(orderId as string)
    }
  }, [orderId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
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

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      {
        id: "placed",
        label: "Order Placed",
        icon: Package,
        description: "Your order has been received",
      },
      {
        id: "confirmed",
        label: "Confirmed",
        icon: CheckCircle,
        description: "Order confirmed and scheduled",
      },
      {
        id: "in-progress",
        label: "In Progress",
        icon: Wrench,
        description: "Service is being performed",
      },
      {
        id: "completed",
        label: "Completed",
        icon: Car,
        description: "Service completed successfully",
      },
    ]

    const statusOrder = ["placed", "confirmed", "in-progress", "completed"]
    const currentIndex = statusOrder.indexOf(currentStatus)

    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "placed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const statusSteps = getStatusSteps(orderData?.orderStatus || "placed")

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Status</h1>
              <p className="text-gray-600 mt-1">Order ID: #{orderData?._id}</p>
            </div>
            <Badge className={`${getStatusColor(orderData?.orderStatus || "")} text-sm px-4 py-2`}>
              {orderData?.orderStatus?.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Status Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200">
                <div
                  className="bg-green-500 transition-all duration-500"
                  style={{
                    height: `${(statusSteps.findIndex((s) => s.isCurrent) / (statusSteps.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {/* Status Steps */}
              <div className="space-y-8 relative">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={step.id} className="flex items-start gap-4">
                      <div
                        className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                          step.isCompleted
                            ? "bg-green-500 border-green-500"
                            : step.isCurrent
                              ? "bg-blue-500 border-blue-500"
                              : "bg-white border-gray-300"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${step.isCompleted || step.isCurrent ? "text-white" : "text-gray-400"}`}
                        />
                      </div>
                      <div className="flex-1 pt-2">
                        <h3
                          className={`font-semibold ${
                            step.isCompleted || step.isCurrent ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        {step.isCurrent && (
                          <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200">
                            Current Status
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Vehicle</p>
                <p className="font-medium">
                  {orderData?.vehicle.year} {orderData?.vehicle.brandName} {orderData?.vehicle.modelName}
                </p>
                <p className="text-sm text-gray-600 capitalize">{orderData?.vehicle.fuel} Engine</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Services</p>
                {orderData?.services.map((service) => (
                  <div key={service._id} className="mt-2">
                    <p className="font-medium text-sm">{service.title}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {service.servicePackageCategory}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Schedule & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Service Date</p>
                <p className="font-medium">{orderData?.serviceDate ? formatDate(orderData.serviceDate) : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Time Slot</p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {orderData?.selectedSlot}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Service Location
                </p>
                <div className="text-sm">
                  <p>{orderData?.address.addressLine1}</p>
                  {orderData?.address.addressLine2 && <p>{orderData?.address.addressLine2}</p>}
                  <p>
                    {orderData?.address.city}, {orderData?.address.state} {orderData?.address.zipCode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card className="mt-6">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1">Contact Support</Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Reschedule Service
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent"
               onClick={() => generateReceiptPDF(orderData)}>
                Download Invoice
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="py-6">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-800 mb-4">
              If you have any questions about your order or need to make changes, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-900">Email</p>
                <p className="text-blue-700">support@fixmyride.com</p>
              </div>
              <div>
                <p className="font-medium text-blue-900">Phone</p>
                <p className="text-blue-700">(555) 123-RIDE</p>
              </div>
              <div>
                <p className="font-medium text-blue-900">Hours</p>
                <p className="text-blue-700">Mon-Sat: 8AM - 8PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
