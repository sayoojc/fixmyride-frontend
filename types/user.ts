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

export interface IVehicle {
  _id: string
  userId:string
  brandId: IBrand
  modelId: IModel
  year: number;
  isDefault:boolean;
  registrationNumber: string;
  fuel: string;
}
export interface IModel{
  _id: string;
  name: string;
  imageUrl: string;
  status:string,
  brandId:string; 
  fuelTypes:string[]
}
export interface IBrand {
  _id: string;
  brandName: string;
  imageUrl:string;
  status:string;
}

export interface User {
  name:string,
  id:string,
  email:string,
  phone:string,
  role:string,
  isListed:boolean
  addresses:Address[],
  defaultAddress:string,
  provider:string
  profileImage:string
  vehicles:Vehicle[]
}

export interface Brand {
  _id: string;
  brandName: string;
  imageUrl: string;
  status: string;
  createdAt?: string; // optional datetime
  updatedAt?: string; // optional datetime
}


export interface Model {
  _id: string;
  name: string;
  imageUrl: string;
  status: string;
  brandId: string;
  fuelTypes: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Vehicle {
  _id: string;
  userId: string;
  brandId: Brand;
  modelId: Model;
  fuel: string;
}
