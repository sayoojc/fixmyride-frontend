import type { ServiceType, TimeSlot } from "@/types/serviceTypes"

export const generateTimeSlots = (
  startHour = 0,
  endHour = 24,
  slotInterval = 15, // minimum slot interval in minutes
): string[] => {
  const slots: string[] = []

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotInterval) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      slots.push(timeString)
    }
  }

  return slots
}

export const createServiceSlot = (startTime: string, serviceType: ServiceType, date: string): TimeSlot => {
  const [hours, minutes] = startTime.split(":").map(Number)
  const startDate = new Date()
  startDate.setHours(hours, minutes, 0, 0)

  const endDate = new Date(startDate.getTime() + serviceType.duration * 60000)
  const endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`

  return {
    id: `${date}-${startTime}-${serviceType.id}`,
    startTime,
    endTime,
    duration: serviceType.duration,
    serviceType,
    status: "available",
  }
}

export const checkSlotConflict = (newSlot: TimeSlot, existingSlots: TimeSlot[]): boolean => {
  const newStart = timeToMinutes(newSlot.startTime)
  const newEnd = timeToMinutes(newSlot.endTime)

  return existingSlots.some((slot) => {
    const existingStart = timeToMinutes(slot.startTime)
    const existingEnd = timeToMinutes(slot.endTime)

    return newStart < existingEnd && newEnd > existingStart
  })
}

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}
