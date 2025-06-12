"use client"

import { motion } from "framer-motion"
import { Check, Clock, MapPin, CreditCard } from "lucide-react"

interface ProgressIndicatorProps {
  currentStep: number
}

const steps = [
  { id: 1, name: "Time Slot", icon: Clock },
  { id: 2, name: "Address", icon: MapPin },
  { id: 3, name: "Payment", icon: CreditCard },
]

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted
                      ? "bg-red-500 border-red-500 text-white"
                      : isCurrent
                        ? "border-red-500 text-red-500 bg-red-50"
                        : "border-gray-300 text-gray-400"
                  }`}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted ? "rgb(239 68 68)" : isCurrent ? "rgb(254 242 242)" : "transparent",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </motion.div>
                <span className={`mt-2 text-xs font-medium ${isCurrent ? "text-red-500" : "text-gray-500"}`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className="h-0.5 bg-gray-200">
                    <motion.div
                      className="h-full bg-red-500"
                      initial={{ width: "0%" }}
                      animate={{ width: isCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
