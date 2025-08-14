export interface IServiceProvider {
  name: string
  ownerName: string
  email: string
  phone?: string
  googleId?: string
  provider?: string
  address?: string
  addressToSend?:{
     street:string,
    city:string,
    state:string,
    pinCode:string,
  }
  location?: {
type:string,
coordinates:[number,number]
  }
  isListed: boolean
  verificationStatus?: "pending" | "approved" | "rejected"
  password?: string
  createdAt: Date
  updatedAt: Date
  license?: string
  ownerIdProof?: string
  profilePicture?: string
  coverPhoto?: string
  bankDetails?: {
    accountHolderName: string
    accountNumber: string
    ifscCode: string
    bankName: string
  }
  startedYear?: number
  description?: string
}