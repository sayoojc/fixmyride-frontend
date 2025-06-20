export interface IServiceProvider {
    _id:string;
    name: string;
    ownerName: string;
    email: string;
    phone?: string;
    googleId?: string;
    provider?: string;
    address?:string;
    addressToSend:{
    street:string,
    city:string,
    state:string,
    pinCode:string,
    }
    location?: {
      latitude: number;
      longitude: number;
    };
    isListed: boolean;
    verificationStatus?: 'pending' | 'approved' | 'rejected';
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    license?: string;
    ownerIdProof?: string;
    profilePicture?: string;
    coverPhoto?: string;
    bankDetails?: {
      accountHolderName: string;
      accountNumber: string;
      ifscCode: string;
      bankName: string;
    };
    startedYear?: number;
    description?: string;
  }
 export  interface VerificationFormData {
    licenseImage: string
    idProofImage: string
    accountHolderName: string
    ifscCode: string
    accountNumber: string
    startedYear: string
    description: string
  }
  export  interface IVerification{
    providerId: string;
    licenseImage: string;
    idProofImage: string;
    accountHolderName: string;
    bankName:string;
    ifscCode: string;
    accountNumber: string;
    startedYear: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
  }
  