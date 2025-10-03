import { IFrontendCart } from "./cart"
export interface TimeSlot {
  id: string
  time: string
  available: boolean
}
export interface Address {
  id?:string,
  userId: string | undefined;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  addressType: string;
  latitude:number;
  longitude:number;
}
export interface AvailableDate {
  date: string
  available: boolean
  timeSlots: TimeSlot[]
}


export interface CheckoutData {
  selectedSlot?: TimeSlot 
  selectedAddress: Address
  paymentMethod: "online" |"cash"
  selectedDate?:AvailableDate
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