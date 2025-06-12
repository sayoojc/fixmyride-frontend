"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { ProgressIndicator } from "./_components/progress-indicator"
import { TimeSlotSelection } from "./_components/time-slot-selection"
import { AddressSelection } from "./_components/address-selection"
import { PaymentSection } from "./_components/payment-section"
import type { CheckoutData } from "../../../types/checkout"

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    selectedSlot: null,
    selectedAddress: null,
    paymentMethod: "card",
  })

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
        return <AddressSelection {...stepProps} />
      case 3:
        return <PaymentSection {...stepProps} />
      default:
        return <TimeSlotSelection {...stepProps} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Checkout</h1>
          <p className="text-gray-600 text-center">Complete your booking in just a few steps</p>
        </div>

        <ProgressIndicator currentStep={currentStep} />

        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
