"use client";

import {
  CheckCircle,
  Calendar,
  MapPin,
  Car,
  CreditCard,
  Tag,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { axiosPrivate } from "@/api/axios";
import createUserApi from "@/services/userApi";
import { IOrderResponse } from "@/types/order";
import { useState } from "react";
const userApi = createUserApi(axiosPrivate);

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.orderId;
  const [orderData, setOrderData] = useState<IOrderResponse>();
  useEffect(() => {
    const fetchOrderData = async(id: string) => {
      try {
        const response =await  userApi.getOrderdetails(id);
        setOrderData(response.order)
      } catch (error) {
        toast.error("Fetching the order data failed");
      }
    };
    if (orderId) {
      fetchOrderData(orderId as string);
    } else {
      toast.error("Order ID is missing");
    }

  }, [orderId]);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "placed":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for choosing FixMyRide, {orderData?.user.name}!
          </p>
          <p className="text-gray-500">
            Your order has been successfully placed and confirmed. We'll take
            great care of your vehicle.
          </p>
        </div>

        {/* Order Details Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <p className="text-lg text-gray-600 mb-4">
                      Thank you for choosing FixMyRide,{" "}
                      {orderData?.user?.name ?? "Valued Customer"}!
                    </p>
                    <span className="text-sm text-gray-500">
                      #{orderData?._id}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Vehicle Information */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Car className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">
                      {orderData?.vehicle.year} {orderData?.vehicle.brandName}{" "}
                      {orderData?.vehicle.modelName}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {orderData?.vehicle.fuel} Engine
                    </p>
                  </div>
                </div>

                {/* Services List */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    Services Ordered:
                  </h4>
                  {orderData?.services.map((service, index) => (
                    <div key={service._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">
                            {service.title}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">
                            {service.description}
                          </p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {service.servicePackageCategory}
                          </Badge>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-medium">
                            ₹{service.priceBreakup.total.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Base: ₹{service.priceBreakup.total.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Tax: ₹{service.priceBreakup.tax?.toFixed(2) ?? 0.0}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{orderData?.totalAmount.toFixed(2)}</span>
                  </div>
                  {orderData?.coupon?.applied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        Discount ({orderData.coupon.code})
                      </span>
                      <span>
                        -₹{orderData.coupon.discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total Paid</span>
                    <span>₹{orderData?.finalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Service Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Service Date</p>
                    <p className="font-medium">
                      {orderData?.serviceDate
                        ? formatDate(orderData.serviceDate)
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Time Slot</p>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {orderData?.selectedSlot}
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Estimated Service Duration:</strong> 2-3 hours
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Our technician will arrive at your location during the
                    selected time slot.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Contact & Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Service Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">{orderData?.user.name}</p>
                  <p className="text-sm text-gray-600">
                    {orderData?.user.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    {orderData?.user.email}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <div className="text-sm">
                    <p>{orderData?.address.addressLine1}</p>
                    {orderData?.address.addressLine2 && (
                      <p>{orderData?.address.addressLine2}</p>
                    )}
                    <p>
                      {orderData?.address.city}, {orderData?.address.state}{" "}
                      {orderData?.address.zipCode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Payment Method</span>
                  <span className="text-sm font-medium capitalize">
                    {orderData?.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Payment Status</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    {orderData?.paymentStatus}
                  </Badge>
                </div>
                {orderData?.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Transaction ID
                    </span>
                    <span className="text-xs font-mono">
                      {orderData.razorpayPaymentId}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full">Track Order Status</Button>
              <Button variant="outline" className="w-full bg-transparent">
                Download Receipt
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <Card className="mt-8">
          <CardContent className="text-center py-6">
            <h3 className="font-semibold text-lg mb-2">What happens next?</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <div className="font-medium mb-1">1. Preparation</div>
                <p>
                  Our team will prepare for your service and contact you if
                  needed.
                </p>
              </div>
              <div>
                <div className="font-medium mb-1">2. Service Day</div>
                <p>
                  Our technician will arrive at your location during the
                  scheduled time.
                </p>
              </div>
              <div>
                <div className="font-medium mb-1">3. Completion</div>
                <p>
                  You'll receive a completion notification and service report.
                </p>
              </div>
            </div>
            <p className="mt-4 text-gray-500">
              Questions? Contact us at support@fixmyride.com or call (555)
              123-RIDE
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
