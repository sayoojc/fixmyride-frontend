"use client"

import { motion } from "framer-motion"
import { Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CheckoutStepProps, TimeSlot, AvailableDate } from "../../../../types/checkout"

// Mock data for available dates with their respective time slots
const availableDates: AvailableDate[] = [
  {
    date: "2024-12-15",
    available: true,
    timeSlots: [
      { id: "1", time: "10:00 - 11:00", available: true },
      { id: "2", time: "11:00 - 12:00", available: true },
      { id: "3", time: "12:00 - 01:00", available: false },
      { id: "4", time: "01:00 - 02:00", available: true },
      { id: "5", time: "02:00 - 03:00", available: true },
      { id: "6", time: "03:00 - 04:00", available: true },
      { id: "7", time: "04:00 - 05:00", available: true },
    ],
  },
  {
    date: "2024-12-16",
    available: true,
    timeSlots: [
      { id: "1", time: "10:00 - 11:00", available: false },
      { id: "2", time: "11:00 - 12:00", available: true },
      { id: "3", time: "12:00 - 01:00", available: true },
      { id: "4", time: "01:00 - 02:00", available: false },
      { id: "5", time: "02:00 - 03:00", available: true },
      { id: "6", time: "03:00 - 04:00", available: true },
      { id: "7", time: "04:00 - 05:00", available: false },
    ],
  },
  {
    date: "2024-12-17",
    available: true,
    timeSlots: [
      { id: "1", time: "10:00 - 11:00", available: true },
      { id: "2", time: "11:00 - 12:00", available: true },
      { id: "3", time: "12:00 - 01:00", available: true },
      { id: "4", time: "01:00 - 02:00", available: true },
      { id: "5", time: "02:00 - 03:00", available: false },
      { id: "6", time: "03:00 - 04:00", available: true },
      { id: "7", time: "04:00 - 05:00", available: true },
    ],
  },
  {
    date: "2024-12-18",
    available: false,
    timeSlots: [],
  },
  {
    date: "2024-12-19",
    available: true,
    timeSlots: [
      { id: "1", time: "10:00 - 11:00", available: true },
      { id: "2", time: "11:00 - 12:00", available: false },
      { id: "3", time: "12:00 - 01:00", available: true },
      { id: "4", time: "01:00 - 02:00", available: true },
      { id: "5", time: "02:00 - 03:00", available: true },
      { id: "6", time: "03:00 - 04:00", available: false },
      { id: "7", time: "04:00 - 05:00", available: true },
    ],
  },
  {
    date: "2024-12-20",
    available: true,
    timeSlots: [
      { id: "1", time: "10:00 - 11:00", available: true },
      { id: "2", time: "11:00 - 12:00", available: true },
      { id: "3", time: "12:00 - 01:00", available: true },
      { id: "4", time: "01:00 - 02:00", available: true },
      { id: "5", time: "02:00 - 03:00", available: true },
      { id: "6", time: "03:00 - 04:00", available: true },
      { id: "7", time: "04:00 - 05:00", available: true },
    ],
  },
  {
    date: "2024-12-21",
    available: true,
    timeSlots: [
      { id: "1", time: "10:00 - 11:00", available: false },
      { id: "2", time: "11:00 - 12:00", available: false },
      { id: "3", time: "12:00 - 01:00", available: true },
      { id: "4", time: "01:00 - 02:00", available: true },
      { id: "5", time: "02:00 - 03:00", available: true },
      { id: "6", time: "03:00 - 04:00", available: true },
      { id: "7", time: "04:00 - 05:00", available: true },
    ],
  },
]

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return "Today"
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow"
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }
}

export function TimeSlotSelection({ data, onUpdate, onNext }: CheckoutStepProps) {
  const handleDateSelect = (selectedDate: AvailableDate) => {
    if (selectedDate.available) {
      onUpdate({
        selectedDate: selectedDate,
        selectedSlot: undefined, // Reset time slot when date changes
      })
    }
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.available && data.selectedDate) {
      onUpdate({ selectedSlot: slot })
    }
  }

  const currentTimeSlots = data.selectedDate?.timeSlots || []

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
            <Calendar className="h-5 w-5" />
            Select Date & Time
          </CardTitle>
          <CardDescription>Choose your preferred date and time slot for the service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Available Dates</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableDates.map((dateOption) => (
                <motion.div
                  key={dateOption.date}
                  whileHover={{ scale: dateOption.available ? 1.02 : 1 }}
                  whileTap={{ scale: dateOption.available ? 0.98 : 1 }}
                >
                  <Button
                    variant={data.selectedDate?.date === dateOption.date ? "default" : "outline"}
                    className={`w-full h-16 flex flex-col items-center justify-center text-xs ${
                      !dateOption.available
                        ? "opacity-50 cursor-not-allowed"
                        : data.selectedDate?.date === dateOption.date
                          ? "bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-500 ring-offset-2"
                          : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleDateSelect(dateOption)}
                    disabled={!dateOption.available}
                  >
                    <span className="font-medium">{formatDate(dateOption.date)}</span>
                    <span className="text-xs opacity-75">{new Date(dateOption.date).getDate()}</span>
                    {!dateOption.available && <span className="text-xs text-red-400">Unavailable</span>}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          {data.selectedDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3"
            >
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Available Time Slots for {formatDate(data.selectedDate.date)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentTimeSlots.map((slot) => (
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
            </motion.div>
          )}

          {/* Selection Summary */}
          {data.selectedDate && data.selectedSlot && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 p-4 bg-gray-50 rounded-lg border"
            >
              <h4 className="text-sm font-medium text-gray-900 mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  Date: <span className="font-semibold text-gray-900">{formatDate(data.selectedDate.date)}</span>
                </p>
                <p>
                  Time: <span className="font-semibold text-gray-900">{data.selectedSlot.time}</span>
                </p>
              </div>
            </motion.div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={onNext}
              disabled={!data.selectedDate || !data.selectedSlot}
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
