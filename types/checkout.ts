export interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

export interface CheckoutData {
  selectedSlot: TimeSlot | null
  selectedAddress: Address | null
  paymentMethod: "card" | "wallet" | "cash"
}

export interface CheckoutStepProps {
  data: CheckoutData
  onUpdate: (data: Partial<CheckoutData>) => void
  onNext: () => void
  onBack: () => void
}
