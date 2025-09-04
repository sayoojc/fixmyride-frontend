"use client";

import { motion } from "framer-motion";
import { DollarSign, Lock, CreditCard } from "lucide-react";
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
import type { CheckoutPaymentStepProps } from "@/types/checkout";
import Image from "next/image";
import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import createUserApi from "@/services/userApi";
import { axiosPrivate } from "@/api/axios";
const userApi = createUserApi(axiosPrivate);
declare global {
  interface Window {
    Razorpay: any;
  }
}
export function PaymentSection({
  data,
  onUpdate,
  onBack,
  cart,
}: CheckoutPaymentStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const handlePaymentMethodChange = (method: "online" | "cash") => {
    onUpdate({ paymentMethod: method });
  };
   useEffect(() => {
    console.log("Cart data in PaymentSection:", cart);
    console.log("data",data)
   }, [cart,data]);
  const calculateSubtotal = () => {
    if (!cart?.services || !Array.isArray(cart.services)) return 0;

    return cart.services.reduce((total, item) => {
      if (
        item.serviceId &&
        item.serviceId.priceBreakup &&
        item.serviceId.priceBreakup.total
      ) {
        return total + item.serviceId.priceBreakup.total;
      }
      return total;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const discountAmount = cart?.coupon?.discountAmount || 0;
  const finalAmount = subtotal - discountAmount;
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
    setIsProcessing(true);
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay SDK");
      setIsProcessing(false);
      return;
    }
    try {
      const response = await userApi.createRazorPayOrder(finalAmount);
      const orderData = response.order;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "My Company",
        description: "Service Payment",
        order_id: orderData.id,
        handler: async (response: any) => {
          const verifyRes = await userApi.verifyRazorpayPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            cart._id,
            data.paymentMethod,
            {
              ...data.selectedAddress,
              userId: data.selectedAddress.userId || "",
            },
            data.selectedDate,
            data.selectedSlot || {
              id: "",
              time: "",
              available: false,
            }
          );
          if (verifyRes.success) {
            console.log("the response for the verify payment", verifyRes);
             router.push(`/user/checkout/success/${verifyRes.orderId}`);
            toast.success("Payment successful!");
          } else {
            toast.error("Payment verification failed!");
          }
          setIsProcessing(false);
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#6366F1",
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

  const handleCheckout = async() => {
    if (data.paymentMethod === "online") {
      handleRazorpayPayment();
    } else {
    const response = await userApi.placeCashOrder(cart._id,'cash', {
              ...data.selectedAddress,
              userId: data.selectedAddress.userId || "",
            },data.selectedDate,data.selectedSlot!);
      if(response.success){
        toast.success("Order placed successfully!");
        router.push(`/user/checkout/success/${response.orderId}`);
      } else {
          toast.error("Failed to place order.Try again")
      }      


    }
  };
  const serviceNames =
    cart?.services?.map((item) => item.serviceId.title).join(", ") ||
    "Vehicle Service";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Service</span>
                <span className="text-gray-900">{serviceNames}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Time Slot</span>
                <span className="text-gray-900">
                  {data.selectedSlot?.time || "Not selected"}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Address</span>
                <span className="text-gray-900">
                  {data.selectedAddress?.addressLine1 || "Not selected"}
                </span>
              </div>
              <Separator />

              {/* Price breakdown from cart */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="text-gray-900">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>

              {cart?.coupon?.applied && cart.coupon.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon Discount</span>
                  <span>-₹{cart.coupon.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  ₹{finalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Payment Method
            </CardTitle>
            <CardDescription>
              Choose your preferred payment method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={data.paymentMethod}
              onValueChange={handlePaymentMethodChange}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="online"
                  id="online"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="online"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-50 [&:has([data-state=checked])]:border-red-500 [&:has([data-state=checked])]:bg-red-50 cursor-pointer"
                >
                  <CreditCard className="mb-3 h-6 w-6" />
                  Online
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="cash"
                  id="cash"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="cash"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-50 [&:has([data-state=checked])]:border-red-500 [&:has([data-state=checked])]:bg-red-50 cursor-pointer"
                >
                  <DollarSign className="mb-3 h-6 w-6" />
                  Cash
                </Label>
              </div>
            </RadioGroup>

            {data.paymentMethod === "online" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4 p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/placeholder.svg?height=30&width=100"
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
                    You will be redirected to Razorpay's secure payment gateway
                    to complete your payment.
                  </p>
                </div>
              </motion.div>
            )}

            {data.paymentMethod === "cash" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 bg-gray-50 rounded-lg border text-center"
              >
                <p className="text-sm text-gray-600">
                  You can pay with cash when the service provider arrives.
                </p>
              </motion.div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="hover:bg-gray-50"
              >
                Back
              </Button>
              <Button
                onClick={handleCheckout}
                className="min-w-32 bg-red-500 hover:bg-red-600 text-white"
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : `Place Order - ₹${finalAmount.toLocaleString()}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
