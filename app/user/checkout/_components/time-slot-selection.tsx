"use client"

import { motion } from "framer-motion"
import { Clock, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as DayCalendar } from "@/components/ui/calendar"
import { useEffect } from "react"

type TimeSlot = { id: string; time: string; available: boolean }
type AvailableDate = { date: string; available: boolean; timeSlots: TimeSlot[]; isEmergency?: boolean }
type CheckoutStepData = { selectedDate?: AvailableDate; selectedSlot?: TimeSlot }
type CheckoutStepProps = {
  data: CheckoutStepData
  onUpdate: (partial: Partial<CheckoutStepData>) => void
  onNext: () => void
}

const SLOT_RANGES = [
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 01:00",
  "01:00 - 02:00",
  "02:00 - 03:00",
  "03:00 - 04:00",
  "04:00 - 05:00",
]

const generateAvailableDates = (): AvailableDate[] => {
  const today = new Date()
  const availableDates: AvailableDate[] = []

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today)
    currentDate.setDate(today.getDate() + i)

    const formattedDate = currentDate.toISOString().split("T")[0]

    const timeSlots: TimeSlot[] = SLOT_RANGES.map((time, index) => ({
      id: `${index + 1}`,
      time,
      available: isFutureSlot(formattedDate, time),
    }))

    availableDates.push({
      date: formattedDate,
      available: true,
      timeSlots,
      isEmergency: false,
    })
  }

  return availableDates
}

// Helper to build the next N days that actually have available slots
function buildNextNDaysWithSlots(targetCount: number): AvailableDate[] {
  const now = new Date()
  const results: AvailableDate[] = []
  let i = 0

  // Safety cap to avoid infinite loops; adjust horizon as needed
  while (results.length < targetCount && i < 60) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    const dateStr = d.toISOString().split("T")[0]

    // Build base slots and compute availability per slot
    const slots: TimeSlot[] = SLOT_RANGES.map((time, idx) => ({
      id: `${dateStr}-${idx + 1}`,
      time,
      available: isFutureSlot(dateStr, time),
    }))

    // Filter out past slots for today; keep all true-available for future days
    const filtered = isSameDay(dateStr, now)
      ? slots.filter((s) => isFutureSlot(dateStr, s.time))
      : slots.filter((s) => s.available)

    if (filtered.length > 0) {
      results.push({
        date: dateStr,
        available: true,
        timeSlots: filtered,
        isEmergency: false,
      })
    }

    i++
  }
  return results
}

const availableDates = generateAvailableDates()

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

// Time parsing and filtering helpers
function isSameDay(dateStr: string, ref: Date) {
  const refKey = toISO(ref)
  return dateStr === refKey
}

function parseStartToLocalDate(dateStr: string, timeRange: string) {
  // Expect formats like "10:00 - 11:00", "12:00 - 01:00", "01:00 - 02:00"
  // Business hours assumption: 10:00-17:00; interpret 01:00-05:00 as 13:00-17:00
  const start = timeRange.split(" - ")[0]?.trim() ?? "00:00"
  const [hStr, mStr] = start.split(":")
  let h = Number(hStr || 0)
  const m = Number(mStr || 0)
  if (h >= 1 && h <= 5) h += 12 // map 01:00-05:00 to 13:00-17:00
  // 12:00 stays 12 (noon), 10,11 remain morning
  const d = new Date(`${dateStr}T00:00:00`)
  d.setHours(h, m, 0, 0)
  return d
}

function isFutureSlot(dateStr: string, timeRange: string) {
  const now = new Date()
  const start = parseStartToLocalDate(dateStr, timeRange)
  // If selected date is today, ensure start is after now; else for future days allow
  if (isSameDay(dateStr, now)) {
    return start.getTime() > now.getTime()
  }
  return start.getTime() > now.getTime() // future days remain available
}

// Build availability across a longer horizon (e.g., 90 days) and ISO helpers
function toISO(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}` // local date key (YYYY-MM-DD)
}

function parseLocalDate(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map((s) => Number(s))
  return new Date(y, (m || 1) - 1, d || 1)
}

function buildAvailableWithinHorizon(daysAhead: number): AvailableDate[] {
  const now = new Date()
  const results: AvailableDate[] = []
  for (let i = 0; i <= daysAhead; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    const dateStr = toISO(d) // local-safe key

    const slots: TimeSlot[] = SLOT_RANGES.map((time, idx) => ({
      id: `${dateStr}-${idx + 1}`,
      time,
      available: isFutureSlot(dateStr, time),
    }))

    const filtered = isSameDay(dateStr, now)
      ? slots.filter((s) => isFutureSlot(dateStr, s.time))
      : slots.filter((s) => s.available)

    if (filtered.length > 0) {
      results.push({
        date: dateStr,
        available: true,
        timeSlots: filtered,
        isEmergency: false,
      })
    }
  }
  return results
}

export function TimeSlotSelection({ data, onUpdate, onNext }: CheckoutStepProps) {
  // Show a calendar spanning ~3 months (90 days) and only include days with remaining slots
  const availableDays = buildAvailableWithinHorizon(90)
  const availableMap = new Map(availableDays.map((d) => [d.date, d]))

  useEffect(() => {
    const hasSelection = Boolean(data.selectedDate)
    if (!hasSelection) return

    const selectionStillValid = hasSelection && availableDays.some((d) => d.date === data.selectedDate!.date)

    const selectedHasSlots =
      hasSelection &&
      (isSameDay(data.selectedDate!.date, new Date())
        ? (data.selectedDate!.timeSlots || []).some((s) => isFutureSlot(data.selectedDate!.date, s.time))
        : (data.selectedDate!.timeSlots || []).length > 0)

    if (!selectionStillValid || !selectedHasSlots) {
      onUpdate({ selectedDate: undefined, selectedSlot: undefined })
    }
  }, [data.selectedDate])

  const handleDateSelect = (selectedDate: AvailableDate) => {
    if (selectedDate.available) {
      onUpdate({
        selectedDate: selectedDate,
        selectedSlot: undefined,
      })
    }
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.available && data.selectedDate) {
      onUpdate({ selectedSlot: slot })
    }
  }

  const currentTimeSlots = data.selectedDate
    ? isSameDay(data.selectedDate.date, new Date())
      ? (data.selectedDate.timeSlots || []).filter((s) => isFutureSlot(data.selectedDate?.date ?? "", s.time))
      : data.selectedDate.timeSlots || []
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          {/* Use CalendarIcon alias since DayCalendar is the UI component */}
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Select Date & Time
          </CardTitle>
          <CardDescription>Choose your preferred date and time slot for the service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
          {/* Left: Calendar */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Calendar</h3>
            <DayCalendar
              mode="single"
              numberOfMonths={1}
              fromDate={new Date()}
              toDate={(() => {
                const d = new Date()
                d.setMonth(d.getMonth() + 3)
                return d
              })()}
              selected={data.selectedDate ? parseLocalDate(data.selectedDate.date) : undefined}
              onSelect={(date) => {
                if (!date) return
                const iso = toISO(date) // local key
                const chosen = availableMap.get(iso)
                if (chosen?.available) {
                  onUpdate({ selectedDate: chosen, selectedSlot: undefined })
                }
              }}
              disabled={(date) => !availableMap.has(toISO(date))}
              className="rounded-md border"
            />
          </div>

          {/* Right: Time slots + summary + sticky button */}
          <div className="flex flex-col md:min-h-80">
            {/* Header */}
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {data.selectedDate ? (
                <>Available Time Slots for {formatDate(data.selectedDate.date)}</>
              ) : (
                <>Select a date to see available time slots</>
              )}
            </h3>

            {/* Scrollable time slots area */}
            {data.selectedDate ? (
              <>
                {(() => {
                  const currentTimeSlots = data.selectedDate
                    ? isSameDay(data.selectedDate.date, new Date())
                      ? (data.selectedDate.timeSlots || []).filter((s) => isFutureSlot(data.selectedDate!.date, s.time))
                      : data.selectedDate.timeSlots || []
                    : []

                  return currentTimeSlots.length === 0 ? (
                    <div className="text-sm text-gray-500 border rounded-md p-3">
                      No remaining time slots available for{" "}
                      <span className="font-medium text-gray-700">{formatDate(data.selectedDate!.date)}</span>. Please
                      choose another date.
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto pr-1 mt-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {currentTimeSlots.map((slot) => (
                          <motion.div
                            key={slot.id}
                            whileHover={{ scale: slot.available ? 1.02 : 1 }}
                            whileTap={{ scale: slot.available ? 0.98 : 1 }}
                          >
                            <Button
                              variant={data.selectedSlot?.id === slot.id ? "default" : "outline"}
                              className={`w-full h-9 px-3 py-2 text-sm ${
                                !slot.available
                                  ? "opacity-50 cursor-not-allowed"
                                  : data.selectedSlot?.id === slot.id
                                    ? "bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-500 ring-offset-2"
                                    : "hover:bg-gray-50"
                              }`}
                              onClick={() => handleSlotSelect(slot)}
                              disabled={!slot.available}
                              aria-pressed={data.selectedSlot?.id === slot.id}
                            >
                              {slot.time}
                              {!slot.available && <span className="ml-2 text-xs">(Unavailable)</span>}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </>
            ) : (
              <div className="text-sm text-gray-500 border rounded-md p-3 mt-2">
                Choose a date from the calendar to see available time slots.
              </div>
            )}

            {/* Summary (non-scrolling area) */}
            {data.selectedDate && data.selectedSlot && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-4 bg-gray-50 rounded-lg border"
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

            {/* Bottom-aligned Continue button */}
            <div className="flex justify-end mt-4 md:mt-auto pt-4">
              <Button
                onClick={onNext}
                disabled={!data.selectedDate || !data.selectedSlot}
                className="min-w-24 bg-red-500 hover:bg-red-600 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default TimeSlotSelection
