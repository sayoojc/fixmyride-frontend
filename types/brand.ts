export interface Model {
  _id: string;
  name: string;
  imageUrl: string;
  fuelTypes: string[];
  status: string;
  brandId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Brand {
  _id: string;
  brandName: string;
  imageUrl: string;
  status: string;
  models: Model[];
}

export interface BrandResponse {
  success: boolean;
  message: string;
  brand: Brand[];
}
