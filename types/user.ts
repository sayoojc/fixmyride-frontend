export interface Address {
  _id?:string,
  userId: string | undefined;
  addressLine1: string;
  addressLine2?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  addressType: string;
}

export type User = {
  name:string,
  id:string,
  email:string,
  phone:string,
  role:string,
  isListed:boolean
  addresses:Address[],
  defaultAddress:string
}