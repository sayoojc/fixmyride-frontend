export interface IVehicle {
  _id: string;
  userId: string;
  brandId: IBrand;
  modelId: IModel;
  isDefault:boolean;
  fuel: string;
}


export interface IBrand {
  _id: string;
  brandName: string;
  imageUrl: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;

}

export interface IModel {
  _id: string;
  name: string;
  imageUrl: string;
  status: string;
  brandId: string;
  fuelTypes: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface EditVehicleFormData {
  brandId: string
  modelId: string
  fuel: string
  isDefault: boolean
}