"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ProgressIndicator } from "./_components/progress-indicator";
import { TimeSlotSelection } from "./_components/time-slot-selection";
import { AddressSelection } from "./_components/address-selection";
import { PaymentSection } from "./_components/payment-section";
import type { CheckoutData } from "../../../types/checkout";
import createUserApi from "@/services/userApi";
import { IFrontendCart } from "@/types/cart";
import {Address} from '../../../types/checkout'
import { axiosPrivate } from "@/api/axios";
const userApi = createUserApi(axiosPrivate);
import { useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    selectedSlot: null,
    selectedAddress: {
        id:'',
  userId:'',
  addressLine1: '',
  addressLine2:'',
  city:'',
  state:'',
  zipCode:'',
  isDefault:false,
  addressType:'',
  latitude:0,
  longitude:0,
    },
    paymentMethod: "online",
    selectedDate:{
      date:"",
      available:true,
      timeSlots:[],
      isEmergency:false
    },
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [cart, setCart] = useState<IFrontendCart>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartId = searchParams.get("cartId");
        if (cartId) {
          const cartResponse = await userApi.getCart(cartId);
          console.log("cart response", cartResponse);
          setCart(cartResponse.cart);
        }
        const addressResponse = await userApi.getAddresses();
        console.log("address response", addressResponse);
        setAddresses(addressResponse.address);
      } catch (error) {
        console.error("Error fetching checkout data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log('the addresses ',addresses);
  },[addresses])

  const updateCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    console.log('the checkout data',checkoutData);
  },[checkoutData])

  const renderStep = () => {
    const stepProps = {
      data: checkoutData,
      onUpdate: updateCheckoutData,
      onNext: nextStep,
      onBack: prevStep,
    };

    switch (currentStep) {
      case 1:
        return <TimeSlotSelection {...stepProps} />;
      case 2:
        return <AddressSelection {...stepProps} addresses={addresses} />;
      case 3:
        return cart ? (
          <PaymentSection {...stepProps} cart={cart} />
        ) : (
          <p>Loading cart...</p>
        );
      default:
        return <TimeSlotSelection {...stepProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
            Checkout
          </h1>
          <p className="text-gray-600 text-center">
            Complete your booking in just a few steps
          </p>
        </div>

        <ProgressIndicator currentStep={currentStep} />

        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
