"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import type { IFrontendCart } from "@/types/cart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X, ChevronRight, Info, Wallet } from "lucide-react";
import createUserApi from "@/services/userApi";
import { axiosPrivate } from "@/api/axios";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
const userApi = createUserApi(axiosPrivate);

interface CartSummaryProps {
  cart: IFrontendCart;
  setCart: (state: IFrontendCart) => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ cart, setCart }) => {
  const vehicle = useSelector((state: RootState) => state.vehicle);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<{
    cartId: string;
    packageId: string;
    serviceName: string;
  } | null>(null);
  const [useWallet, setUseWallet] = useState(false);
  const walletBalance = 500;
  useEffect(() => {
    console.log("the fornt end cart", cart);
  }, [cart]);
  const calculateSubtotal = () => {
    if (!cart.services || !Array.isArray(cart.services)) return 0;

    return cart.services.reduce((total, item) => {
      if (
        item &&
        item.serviceId.priceBreakup &&
        item.serviceId.priceBreakup.total
      ) {
        return total + item.serviceId.priceBreakup.total;
      }
      return total;
    }, 0);
  };

  const calculateOriginalPrice = (service: any) => {
    if (!service.serviceId || !service.serviceId.priceBreakup) return 0;

    const priceBreakup = service.serviceId.priceBreakup;
    if (priceBreakup) {
      return priceBreakup.total + (priceBreakup.discount || 0);
    }
    return priceBreakup?.total || 0;
  };

  const subtotal = calculateSubtotal();
  const discountAmount = cart.coupon?.discountAmount || 0;
  const walletAmount = useWallet
    ? Math.min(walletBalance, subtotal - discountAmount)
    : 0;
  const finalAmount = subtotal - discountAmount - walletAmount;

  const handleRemoveFromCart = async (cartId: string, packageId: string) => {
    try {
      const response = await userApi.removeFromCart(cartId, packageId);
      setCart(response.cart);
    } catch (error) {
      throw error;
    }
  };

  const handleRemoveClick = (
    cartId: string,
    packageId: string,
    serviceName: string
  ) => {
    setItemToRemove({ cartId, packageId, serviceName });
    setShowRemoveDialog(true);
  };

  const confirmRemove = async () => {
    if (itemToRemove) {
      try {
        await handleRemoveFromCart(itemToRemove.cartId, itemToRemove.packageId);
        setShowRemoveDialog(false);
        setItemToRemove(null);
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  const cancelRemove = () => {
    setShowRemoveDialog(false);
    setItemToRemove(null);
  };

  const toggleWallet = () => {
    setUseWallet(!useWallet);
  };

  const vehicleBrand =
    cart.vehicleId?.brandId.brandName || vehicle.brand?.name || "";
  const vehicleModel =
    cart.vehicleId?.modelId?.name || vehicle.model?.name || "";
  const vehicleImage =
    cart.vehicleId?.modelId.imageUrl ||
    vehicle.model?.imageUrl ||
    "/placeholder.svg?height=96&width=128";
  const fuelType =
    cart.vehicleId?.fuel || vehicle.model?.fuelType || "fuel type";

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="relative h-24 w-32">
              <img
                src={vehicleImage || "/placeholder.svg"}
                alt={`${vehicleBrand} ${vehicleModel}`}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold">
                {vehicleBrand + " " + vehicleModel}
              </h3>
              <p className="text-gray-600 capitalize">{fuelType}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-red-500 font-medium hover:text-red-600"
          >
            CHANGE
          </Button>
        </div>

        {/* Services List */}
        {cart.services &&
          Array.isArray(cart.services) &&
          cart.services.map((item, index) => (
            <div
              key={item.serviceId._id || index}
              className="border p-3 rounded-lg mb-4 relative"
            >
              <div className="flex justify-between items-start pr-8">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {item.serviceId.title || "Service Package"}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {Array.isArray(item.serviceId.servicesIncluded)
                      ? item.serviceId.servicesIncluded.join(", ")
                      : item.serviceId.servicesIncluded || "Services included"}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  {item.serviceId.priceBreakup &&
                    typeof item.serviceId.priceBreakup.discount === "number" &&
                    item.serviceId.priceBreakup.discount > 0 && (
                      <span className="text-gray-400 line-through text-sm">
                        ₹{calculateOriginalPrice(item).toLocaleString()}
                      </span>
                    )}{" "}
                  <span className="font-semibold text-lg">
                    ₹
                    {(item.serviceId.priceBreakup?.total || 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 h-auto"
                onClick={() =>
                  handleRemoveClick(
                    cart._id || "",
                    item.serviceId._id || "",
                    item.serviceId.title || "Service Package"
                  )
                }
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

        {/* Membership Section */}
        {/* <div className="bg-gray-800 text-white p-4 rounded flex justify-between items-center mb-6">
          <div>
            <div className="font-semibold">Membership</div>
            <div className="mt-2 text-sm">• ₹20,000 Annual Savings</div>
          </div>
          <div className="text-sm">
            <div>Free SOS and much more</div>
            <div className="flex justify-end mt-2">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div> */}

        {/* Wallet Section */}
        {/* <div className="border rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-green-600" />
              <div>
                <p className="font-medium">Wallet Balance</p>
                <p className="text-sm text-gray-600">
                  Available: ₹{walletBalance.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="use-wallet"
                checked={useWallet}
                onCheckedChange={toggleWallet}
              />
              <Label htmlFor="use-wallet">Use Wallet</Label>
            </div>
          </div>
        </div> */}

        {/* Price Breakdown */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">₹{subtotal.toLocaleString()}</span>
          </div>

          {cart.coupon?.applied && cart.coupon.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Coupon Discount</span>
              <span>-₹{cart.coupon.discountAmount.toLocaleString()}</span>
            </div>
          )}

          {useWallet && walletAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Wallet Credit</span>
              <span>-₹{walletAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between border-t pt-2">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold">
              ₹{finalAmount.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-600">Extra charges may apply</p>
        </div>

        {/* Coupon Section */}
        {/* <div className="border border-dashed p-3 rounded-lg flex justify-between items-center mb-6 cursor-pointer hover:bg-gray-50">
          <div className="flex items-center">
            <Info className="w-6 h-6 text-blue-500 mr-2" />
            <span className="font-medium">
              {cart.coupon?.applied ? "Coupon Applied" : "Apply Coupon"}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div> */}

        {/* Checkout Button */}
        {cart?.services?.length > 0 && (
          <Link href={`/user/checkout?cartId=${cart._id}`} passHref>
            <Button
              className="w-full bg-red-500 text-white py-3 text-lg font-semibold hover:bg-red-600"
              size="lg"
            >
              CHECKOUT
            </Button>
          </Link>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{itemToRemove?.serviceName}" from
              your cart? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRemove}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              className="bg-red-500 hover:bg-red-600"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
