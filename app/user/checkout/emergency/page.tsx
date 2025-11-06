"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Lock,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";
import { useJsApiLoader } from "@react-google-maps/api";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import createUserApi from "@/services/userApi";
import { axiosPrivate } from "@/api/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
const MapPicker = dynamic(() => import("@/components/user/MapPicker"), {
  ssr: false,
});

const userApi = createUserApi(axiosPrivate);

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Address {
  id?: string;
  userId: string;
  addressType: string;
  isDefault: boolean;
  latitude: number;
  longitude: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
}

interface ServicePackage {
  _id: string;
  title: string;
  priceBreakup: {
    total: number;
  };
}

export default function EmergencyBookingPage() {
  const vehicle = useSelector((state: RootState) => state.vehicle);
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [servicePackage, setServicePackage] = useState<ServicePackage | null>(
    null
  );
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places", "marker"],
  });
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (isLoaded && !geocoder) {
      setGeocoder(new window.google.maps.Geocoder());
    }
  }, [isLoaded, geocoder]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          if (geocoder) {
            geocoder.geocode(
              {
                location: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
              },
              (results, status) => {
                if (status === "OK" && results && results[0]) {
                  updateAddressFromGeocode(results[0]);
                }
              }
            );
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setCurrentLocation({ lat: 28.6139, lng: 77.209 });
        }
      );
    }
  }, [geocoder]);

  useEffect(() => {
    const fetchServicePackage = async () => {
      try {
        if (!packageId) {
          return;
        }
        const response = await userApi.getServicePackageById(packageId);
        setServicePackage(response.servicePackage);
      } catch (error) {}
    };
    fetchServicePackage();
  }, [packageId]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await userApi.getAddresses();
        setAddresses(response.address);
      } catch (error) {}
    };
    fetchAddresses();
  }, []);

  const updateAddressFromGeocode = (result: google.maps.GeocoderResult) => {
    let street = "";
    let city = "";
    let state = "";
    let zipCode = "";
    const addressLine1 = result.formatted_address.split(",")[0];

    for (const component of result.address_components) {
      if (
        component.types.includes("street_number") ||
        component.types.includes("route")
      ) {
        street = result.formatted_address.split(",")[1] || "";
      }
      if (component.types.includes("locality")) {
        city = component.long_name;
      }
      if (component.types.includes("administrative_area_level_1")) {
        state = component.long_name;
      }
      if (component.types.includes("postal_code")) {
        zipCode = component.long_name;
      }
    }

    if (currentLocation?.lat && currentLocation.lng) {
      setSelectedAddress({
        userId: "",
        addressType: "Current Location",
        isDefault: false,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        addressLine1,
        addressLine2: street,
        city,
        state,
        zipCode,
      });
    }
  };

  const handleMarkerDrag = useCallback(
    (lat: number, lng: number) => {
      if (geocoder) {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            updateAddressFromGeocode(results[0]);
          }
        });
      }
    },
    [geocoder, currentLocation]
  );

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = process.env.NEXT_PUBLIC_RAZORPAY_CHECKOUT_URL!;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    if (!servicePackage || !selectedAddress) return;

    setIsProcessing(true);
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay SDK");
      setIsProcessing(false);
      return;
    }

    try {
      if (!packageId) return;
      const response = await userApi.createRazorPayOrder(
        servicePackage.priceBreakup.total
      );
      const orderData = response.order;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Emergency Service",
        description: "Emergency Service Payment",
        order_id: orderData.id,
        handler: async (response: any) => {
          const verifyRes = await userApi.verifyRazorpayPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            paymentMethod,
            selectedAddress,
            {
              date: new Date().toISOString().split("T")[0],
              available: true,
              timeSlots: [],
            },
            { id: "emergency", time: "ASAP", available: true },
            undefined,
            packageId
          );
          if (verifyRes.success) {
            router.push(`/user/checkout/success/${verifyRes.orderId}`);
            toast.success("Emergency service booked successfully!");
          } else {
            toast.error("Payment verification failed!");
          }
          setIsProcessing(false);
        },
        prefill: {
          name: "Emergency User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#ef4444",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Payment failed. Try again.");
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleCashPayment = async () => {
    if (!servicePackage || !selectedAddress) return;

    setIsProcessing(true);
    try {
      if (!packageId) return;
      const response = await userApi.placeEmergencyCashOrder(
        packageId,
        vehicle.id,
        selectedAddress
      );
      console.log('teh response after emergency cash order',response);

      if (response.success) {
        toast.success("Emergency service booked successfully!");
        router.push(`/user/checkout/success/${response.orderId._id}`);
      } else {
        toast.error("Failed to book emergency service. Try again");
      }
    } catch (error) {
      toast.error("Failed to book emergency service. Try again");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBooking = () => {
    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }

    if (paymentMethod === "online") {
      handleRazorpayPayment();
    } else {
      handleCashPayment();
    }
  };

  if (!packageId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invalid Request</h2>
            <p className="text-muted-foreground">
              No service package specified for emergency booking.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Emergency Service Booking
            </h1>
          </div>
          <p className="text-red-600 font-medium">
            Fast-track booking for urgent service needs
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Address Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Service Location
                </CardTitle>
                <CardDescription>
                  Select where you need the emergency service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-600 text-sm font-medium">
                    Current Location (Drag to adjust)
                  </Label>
                  <div className="h-64 w-full rounded-lg overflow-hidden border">
                    {!isLoaded || !currentLocation ? (
                      <div className="flex items-center justify-center h-full bg-gray-50">
                        <div className="flex items-center gap-2 text-gray-500">
                          <div className="animate-spin h-6 w-6 border-4 border-red-500 border-t-transparent rounded-full"></div>
                          <span>Loading map...</span>
                        </div>
                      </div>
                    ) : (
                      <MapPicker
                        initialLocation={currentLocation}
                        onMarkerDrag={handleMarkerDrag}
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedAddress && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200"
                    >
                      <p className="text-sm text-green-700">
                        Selected location:{" "}
                        <span className="font-semibold">
                          {selectedAddress.addressLine1}
                        </span>
                      </p>
                    </motion.div>
                  )}
                  <Label className="text-gray-600 text-sm font-medium">
                    Or select a saved address
                  </Label>
                  <AnimatePresence>
                    {addresses?.map((address) => (
                      <motion.div
                        key={address.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all ${
                            selectedAddress?.id === address.id
                              ? "ring-2 ring-red-500 ring-offset-2 bg-red-50 border-red-200"
                              : "hover:shadow-md hover:bg-gray-50"
                          }`}
                          onClick={() => handleAddressSelect(address)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">
                                    {address.addressLine1}
                                  </h4>
                                  {address.isDefault && (
                                    <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {address.addressLine2}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {address.city}, {address.state}{" "}
                                  {address.zipCode}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Service Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Service Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium">{servicePackage?.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Priority</span>
                    <span className="font-medium text-red-600">
                      Emergency (ASAP)
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Initial Emergency Fees</span>
                    <span>
                      ₹{servicePackage?.priceBreakup.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>
                  Choose how you want to pay for the emergency service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value: "online" | "cash") =>
                    setPaymentMethod(value)
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="cash"
                      id="cash"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="cash"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-50 cursor-pointer"
                    >
                      <DollarSign className="mb-3 h-6 w-6" />
                      Cash on Service
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="online"
                      id="online"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="online"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-50 cursor-pointer"
                    >
                      <CreditCard className="mb-3 h-6 w-6" />
                      Pay Online
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "online" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="flex items-center space-x-2">
                        <Image
                          src="/razorpay-logo.jpg"
                          alt="Razorpay"
                          width={100}
                          height={30}
                          className="object-contain"
                        />
                        <span className="text-sm font-medium">
                          Secure payment via Razorpay
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        Pay securely online for faster service confirmation
                      </p>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === "cash" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 bg-gray-50 rounded-lg border text-center"
                  >
                    <p className="text-sm text-gray-600">
                      Pay with cash when the service provider arrives at your
                      location.
                    </p>
                  </motion.div>
                )}

                <Button
                  onClick={handleBooking}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold"
                  disabled={isProcessing || !selectedAddress}
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Processing...
                    </div>
                  ) : (
                    `Book Emergency Service - ₹${servicePackage?.priceBreakup.total.toLocaleString()}`
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
