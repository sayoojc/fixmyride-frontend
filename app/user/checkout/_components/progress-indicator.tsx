"use client"

import { motion } from "framer-motion"
import { Check, Clock, MapPin, CreditCard } from "lucide-react"

interface ProgressIndicatorProps {
  currentStep: number
  size?: "sm" | "md"
  showLabels?: boolean
}

const steps = [
  { id: 1, name: "Time Slot", icon: Clock },
  { id: 2, name: "Address", icon: MapPin },
  { id: 3, name: "Payment", icon: CreditCard },
]

export function ProgressIndicator({ currentStep, size = "md", showLabels = true }: ProgressIndicatorProps) {
  const S =
    size === "sm"
      ? {
          pad: "py-3",
          circle: "w-8 h-8",
          icon: "h-4 w-4",
          label: "text-[11px]",
          connector: "h-px",
          gap: "mx-2",
        }
      : {
          pad: "py-6",
          circle: "w-10 h-10",
          icon: "h-5 w-5",
          label: "text-xs",
          connector: "h-0.5",
          gap: "mx-4",
        }

  return (
    <div className={`w-full ${S.pad}`} aria-label="Checkout progress">
      <div className="flex items-center justify-between" role="list">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id

          return (
            <div
              key={step.id}
              className="flex items-center"
              role="listitem"
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  className={`flex items-center justify-center rounded-full border-2 ${S.circle} ${
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
                  {isCompleted ? (
                    <Check className={S.icon} aria-hidden="true" />
                  ) : (
                    <Icon className={S.icon} aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {step.name} {isCompleted ? "(completed)" : isCurrent ? "(current)" : ""}
                  </span>
                </motion.div>

                {/* Hide labels on very small screens for compactness, allow toggling via showLabels */}
                {showLabels && (
                  <span
                    className={`mt-2 font-medium ${S.label} ${isCurrent ? "text-red-500" : "text-gray-500"} hidden sm:block`}
                  >
                    {step.name}
                  </span>
                )}
              </div>

              {index < steps.length - 1 && (
                <div className={`flex-1 ${S.gap}`}>
                  <div className={`${S.connector} bg-gray-200`}>
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
