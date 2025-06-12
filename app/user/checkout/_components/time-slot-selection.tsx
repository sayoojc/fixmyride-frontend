"use client"

import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CheckoutStepProps, TimeSlot } from "../../../../types/checkout"

const timeSlots: TimeSlot[] = [
  { id: "1", time: "10:00 - 11:00", available: true },
  { id: "2", time: "11:00 - 12:00", available: true },
  { id: "3", time: "12:00 - 01:00", available: false },
  { id: "4", time: "01:00 - 02:00", available: true },
  { id: "5", time: "02:00 - 03:00", available: true },
  { id: "6", time: "03:00 - 04:00", available: true },
  { id: "7", time: "04:00 - 05:00", available: false },
]

export function TimeSlotSelection({ data, onUpdate, onNext }: CheckoutStepProps) {
  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      onUpdate({ selectedSlot: slot })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Select Time Slot
          </CardTitle>
          <CardDescription>Choose your preferred time slot for the service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {timeSlots.map((slot) => (
              <motion.div
                key={slot.id}
                whileHover={{ scale: slot.available ? 1.02 : 1 }}
                whileTap={{ scale: slot.available ? 0.98 : 1 }}
              >
                <Button
                  variant={data.selectedSlot?.id === slot.id ? "default" : "outline"}
                  className={`w-full h-12 ${
                    !slot.available
                      ? "opacity-50 cursor-not-allowed"
                      : data.selectedSlot?.id === slot.id
                        ? "bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-500 ring-offset-2"
                        : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleSlotSelect(slot)}
                  disabled={!slot.available}
                >
                  {slot.time}
                  {!slot.available && <span className="ml-2 text-xs">(Unavailable)</span>}
                </Button>
              </motion.div>
            ))}
          </div>

          {data.selectedSlot && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 p-4 bg-gray-50 rounded-lg border"
            >
              <p className="text-sm text-gray-600">
                Selected time slot: <span className="font-semibold text-gray-900">{data.selectedSlot.time}</span>
              </p>
            </motion.div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={onNext}
              disabled={!data.selectedSlot}
              className="min-w-24 bg-red-500 hover:bg-red-600 text-white"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
