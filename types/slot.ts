export interface IFrontendSlot {
  _id: string;
  providerId: string;
  date: string;
  timeSlots: {
    startTime: string;
    endTime: string;
    bookedBy?: string;
    status:"active" | "inactive" | "booked"
  }[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  displayTime: string;
}

export interface WeeklySlot {
  date: string;
  dayName: string;
  slots: {
    [slotId: string]: {
      status:"active" | "inactive" | "booked"
      bookingDetails?:string
    };
  };
}