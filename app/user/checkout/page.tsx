"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { ProgressIndicator } from "./_components/progress-indicator"
import { TimeSlotSelection } from "./_components/time-slot-selection"
import { AddressSelection } from "./_components/address-selection"
import { PaymentSection } from "./_components/payment-section"
import type { CheckoutData } from "../../../types/checkout"
import createUserApi from "@/services/userApi"
import type { IFrontendCart } from "@/types/cart"
import type { Address } from "../../../types/checkout"
import { axiosPrivate } from "@/api/axios"
const userApi = createUserApi(axiosPrivate)
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    selectedSlot: undefined,
    selectedAddress: {
      id: "",
      userId: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      isDefault: false,
      addressType: "",
      latitude: 0,
      longitude: 0,
    },
    paymentMethod: "online",
    selectedDate: {
      date: "",
      available: true,
      timeSlots: [],
    },
  })
  const [addresses, setAddresses] = useState<Address[]>([])
  const [cart, setCart] = useState<IFrontendCart>()
  const router = useRouter()

  useEffect(() => {
    const handlePopState = () => {
      router.push("/user");
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartId = searchParams.get("cartId")
        if (!cartId) {
          router.push("/user")
        }
        if (cartId) {
          const cartResponse = await userApi.getCart(cartId)
          setCart(cartResponse.cart)
        }
        const addressResponse = await userApi.getAddresses()
        setAddresses(addressResponse.address)
      } catch (error) {
        console.error("Error fetching checkout data", error)
      } finally {
       
      }
    }

    fetchData()
  }, [])
  const updateCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }
  const renderStep = () => {
    const stepProps = {
      data: checkoutData,
      onUpdate: updateCheckoutData,
      onNext: nextStep,
      onBack: prevStep,
    }

    switch (currentStep) {
      case 1:
        return <TimeSlotSelection {...stepProps} />
      case 2:
        return <AddressSelection {...stepProps} addresses={addresses} />
      case 3:
        return cart ? <PaymentSection {...stepProps} cart={cart} /> : <p>Loading cart...</p>
      default:
        return <TimeSlotSelection {...stepProps} />
    }
  }

  return (
    <div className="h-screen bg-gray-50">
      <div className="container mx-auto px-3 py-3 md:px-4 md:py-4 max-w-4xl grid grid-rows-[auto_auto_1fr] gap-3">
        <div className="mb-0">
          <h4 className="text-2xl md:text-3xl font-bold text-center mb-1 text-gray-900">checkout</h4>       
        </div>
        <div className="min-h-0">
          <ProgressIndicator currentStep={currentStep} size="sm" showLabels={false} />
        </div>
        <div className="min-h-0">
          <div className="bg-white rounded-lg shadow-md h-full overflow-auto p-4 md:p-5">
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
