"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  MapPin,
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { axiosPrivate } from "@/api/axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import createProviderApi from "@/services/providerApi";
import type { Order } from "@/types/order";
import GoogleMapDirections from "@/components/GoogleMapDirections";
import { getSocket } from "@/lib/socket";

const providerApi = createProviderApi(axiosPrivate);
const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "in-progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "confirmed":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "placed":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "cancelled":
    case "failed":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    case "in-progress":
      return <Truck className="h-4 w-4" />;
    case "confirmed":
      return <Package className="h-4 w-4" />;
    case "placed":
      return <Clock className="h-4 w-4" />;
    case "cancelled":
    case "failed":
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const formatAddress = (address: Order["address"]) => {
  return `${address.addressLine1}, ${
    address.addressLine2 ? address.addressLine2 + ", " : ""
  }${address.city}, ${address.state} ${address.zipCode}`;
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientLocation, setClientLocation] = useState<{
    lat: number;
    lng: number;
  }>();
  const [providerLocation, setProviderLocation] = useState<{
    lat: number;
    lng: number;
  }>();
  useEffect(() => {
    const socket = getSocket();
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setProviderLocation(newLocation);
        socket.emit("provider:location:update", {
          id,
          location: newLocation,
          clientId: order?.user._id,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!id) {
      console.log("no order id got in the page");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await providerApi.getOrderDetails(id);
        const order = response.order;
        setOrder(order);
        setClientLocation({
          lat: order.address.location.coordinates[0],
          lng: order.address.location.coordinates[1],
        });
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center py-12">
          <CardContent>
            <XCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
            <p className="text-muted-foreground mb-4">
              {error ||
                "The order you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const destination = {
    address: formatAddress(order.address),
    lat: order.address.location.coordinates[1],
    lng: order.address.location.coordinates[0],
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
            <p className="text-muted-foreground mt-2">Order ID: {order._id}</p>
          </div>
          <Badge
            variant="secondary"
            className={getStatusColor(order.orderStatus)}
          >
            <div className="flex items-center space-x-1">
              {getStatusIcon(order.orderStatus)}
              <span className="capitalize">
                {order.orderStatus.replace("-", " ")}
              </span>
            </div>
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Amount
                  </div>
                  <div className="text-lg font-semibold">
                    ₹{order.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Payment Method
                  </div>
                  <div className="capitalize">{order.paymentMethod}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Payment Status
                  </div>
                  <div className="capitalize">{order.paymentStatus}</div>
                </div>
              </div>

              {order.serviceDate && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Service Date
                      </div>
                      <div>
                        {new Date(order.serviceDate).toLocaleDateString()}
                      </div>
                    </div>
                    {order.selectedSlot && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Time Slot
                        </div>
                        <div>{order.selectedSlot}</div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {order.statusReason && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Status Reason
                    </div>
                    <div className="text-sm">{order.statusReason}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Name
                </div>
                <div>{order.user.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Email
                </div>
                <div>{order.user.email}</div>
              </div>
              {order.user.phone && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Phone
                  </div>
                  <div>{order.user.phone}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Vehicle
                </div>
                <div>
                  {order.vehicle.brandName} {order.vehicle.modelName} (
                  {order.vehicle.year})
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Fuel Type
                </div>
                <div className="capitalize">{order.vehicle.fuel}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services and Location */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.services.map((service, index) => (
                  <div
                    key={service._id}
                    className="border-b border-muted pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="font-medium">{service.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {service.description}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline" className="text-xs">
                        {service.servicePackageCategory}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        Fuel: {service.fuelType}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium mb-2">Address</div>
                <div className="text-sm text-muted-foreground flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{formatAddress(order.address)}</span>
                </div>
              </div>
              {providerLocation && clientLocation && (
                <GoogleMapDirections
                  providerLocation={providerLocation}
                  clientLocation={clientLocation}
                />
              )}
            </CardContent>
          </Card>

          {order.razorpayOrderId && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Razorpay Order ID
                  </div>
                  <div className="text-sm font-mono">
                    {order.razorpayOrderId}
                  </div>
                </div>
                {order.razorpayPaymentId && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Payment ID
                    </div>
                    <div className="text-sm font-mono">
                      {order.razorpayPaymentId}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
