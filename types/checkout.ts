import { IFrontendCart } from "./cart"
import { Address } from "./user"
export interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export interface AvailableDate {
  date: string
  available: boolean
  timeSlots: TimeSlot[]
}


export interface CheckoutData {
  selectedSlot: TimeSlot | null
  selectedAddress: Address | null
  paymentMethod: "online" |"cash"
  selectedDate:AvailableDate
}

export interface CheckoutStepProps {
  data: CheckoutData
  onUpdate: (data: Partial<CheckoutData>) => void
  onNext: () => void
  onBack: () => void
}
export interface CheckoutPaymentStepProps {
   data: CheckoutData
  onUpdate: (data: Partial<CheckoutData>) => void
  onNext: () => void
  onBack: () => void
  cart:IFrontendCart
}
export interface CheckoutAddressStepProps {
   data: CheckoutData
  onUpdate: (data: Partial<CheckoutData>) => void
  onNext: () => void
  onBack: () => void
  addresses:Address[]
}