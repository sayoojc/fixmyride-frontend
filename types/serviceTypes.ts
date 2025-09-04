export interface ServiceType {
  id: string
  name: string
  duration: number // in minutes
  color: string
  icon: string
  category: "maintenance" | "repair" | "emergency"
}

export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  duration: number
  serviceType?: ServiceType
  status: "available" | "booked" | "blocked"
  bookingDetails?: any
}

export type HourStatus = "available" | "unavailable";
export interface DaySchedule {
  date: string;
  dayName: string;
  employees: number;
  hours: { [hour: number]: HourStatus };
}