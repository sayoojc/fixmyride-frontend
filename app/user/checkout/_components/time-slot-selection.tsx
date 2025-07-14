"use client";

import { motion } from "framer-motion";
import { Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  CheckoutStepProps,
  TimeSlot,
  AvailableDate,
} from "../../../../types/checkout";
import { useEffect } from "react";

const generateAvailableDates = (): AvailableDate[] => {
  const timeRanges = [
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 01:00",
    "01:00 - 02:00",
    "02:00 - 03:00",
    "03:00 - 04:00",
    "04:00 - 05:00",
  ];

  const today = new Date();
  const availableDates: AvailableDate[] = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    const formattedDate = currentDate.toISOString().split("T")[0];

    const timeSlots: TimeSlot[] = timeRanges.map((time, index) => ({
      id: `${index + 1}`,
      time,
      available: true,
    }));

    availableDates.push({
      date: formattedDate,
      available: true,
      timeSlots,
      isEmergency: false,
    });
  }

  return availableDates;
};

const availableDates = generateAvailableDates();

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
}

export function TimeSlotSelection({
  data,
  onUpdate,
  onNext,
}: CheckoutStepProps) {

useEffect(() => {
  console.log('the checkout data',data)
},[data]);

  const handleDateSelect = (selectedDate: AvailableDate) => {
    if (selectedDate.available) {
      onUpdate({
        selectedDate: selectedDate,
        selectedSlot: undefined, // Reset time slot when date changes
      });
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.available && data.selectedDate) {
      onUpdate({ selectedSlot: slot });
    }
  };

  const currentTimeSlots = data.selectedDate?.timeSlots || [];

  const handleEmergencySelect = () => {
    const currentDateTime = new Date();
    const emergencyAppointment = {
      date: currentDateTime.toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      time: currentDateTime.toTimeString().split(" ")[0].substring(0, 5), // Current time in HH:MM format
      isEmergency: true,
      available: true,
      type: "emergency",
    };

    onUpdate({
      selectedDate: {
        date: emergencyAppointment.date,
        available: true,
        isEmergency: true,
        timeSlots:[{
      id: `1`,
      time:emergencyAppointment.time,
      available: true,
    }]
      },
      selectedSlot: {
        id:'emergency',
        time:emergencyAppointment.time,
        available:true
      },
    });
    console.log("Emergency appointment selected:", emergencyAppointment);
  };

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
          <CardDescription>
            Choose your preferred date and time slot for the service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">
              Available Dates
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Emergency Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={
                    data.selectedDate?.isEmergency ? "default" : "outline"
                  }
                  className={`w-full h-16 flex flex-col items-center justify-center text-xs relative ${
                    data.selectedDate?.isEmergency
                      ? "bg-red-600 hover:bg-red-700 text-white ring-2 ring-red-500 ring-offset-2 shadow-lg"
                      : "border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600"
                  }`}
                  onClick={() => handleEmergencySelect()}
                >
                  {/* Emergency Icon */}
                  <div className="flex items-center gap-1 mb-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold">Emergency</span>
                  </div>
                  <span className="text-xs opacity-90">Immediate</span>

                  {/* Pulse animation for emergency */}
                  {data.selectedDate?.isEmergency && (
                    <div className="absolute inset-0 rounded-md">
                      <div className="absolute inset-0 rounded-md bg-red-400 animate-ping opacity-20"></div>
                    </div>
                  )}
                </Button>
              </motion.div>

              {/* Regular Date Buttons */}
              {availableDates.map((dateOption) => (
                <motion.div
                  key={dateOption.date}
                  whileHover={{ scale: dateOption.available ? 1.02 : 1 }}
                  whileTap={{ scale: dateOption.available ? 0.98 : 1 }}
                >
                  <Button
                    variant={
                      data.selectedDate?.date === dateOption.date &&
                      !data.selectedDate?.isEmergency
                        ? "default"
                        : "outline"
                    }
                    className={`w-full h-16 flex flex-col items-center justify-center text-xs ${
                      !dateOption.available
                        ? "opacity-50 cursor-not-allowed"
                        : data.selectedDate?.date === dateOption.date &&
                          !data.selectedDate?.isEmergency
                        ? "bg-blue-500 hover:bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleDateSelect(dateOption)}
                    disabled={!dateOption.available}
                  >
                    <span className="font-medium">
                      {formatDate(dateOption.date)}
                    </span>
                    <span className="text-xs opacity-75">
                      {new Date(dateOption.date).getDate()}
                    </span>
                    {!dateOption.available && (
                      <span className="text-xs text-red-400">Unavailable</span>
                    )}
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
                      variant={
                        data.selectedSlot?.id === slot.id
                          ? "default"
                          : "outline"
                      }
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
                      {!slot.available && (
                        <span className="ml-2 text-xs">(Unavailable)</span>
                      )}
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
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Booking Summary
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  Date:{" "}
                  <span className="font-semibold text-gray-900">
                    {formatDate(data.selectedDate.date)}
                  </span>
                </p>
                <p>
                  Time:{" "}
                  <span className="font-semibold text-gray-900">
                    {data.selectedSlot.time}
                  </span>
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
  );
}
