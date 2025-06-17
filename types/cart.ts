export interface IFrontendServiceDetails {
  _id: string;
  title: string;
  description: string;
  brandId: string;
  modelId: string;
  fuelType: "petrol" | "diesel" | "lpg" | "cng";
  servicesIncluded: string[];
  priceBreakup: {
    parts: {
      name: string;
      price: number;
      quantity: number;
    }[];
    laborCharge: number;
    discount?: number;
    tax?: number;
    total: number;
  };
  isBlocked: boolean;
  createdAt: string;
}



export interface IFrontendCoupon {
  code?: string;
  discountType?: "percentage" | "flat";
  discountValue: number;
  discountAmount: number;
  applied: boolean;
}

export interface IFrontendVehicle {
  _id: string;
  userId: string;
  brandId: {
    _id: string;
    brandName: string;
    imageUrl: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  modelId: {
    _id: string;
    name: string;
    imageUrl: string;
    brandId: string;
    fuelTypes: string[];
    createdAt: string;
    updatedAt: string;
  };
  fuel: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IFrontendCart {
  _id: string;
  userId: string;
  vehicleId: IFrontendVehicle;
  services: Array<{
    serviceId: IFrontendServiceDetails;
  }>;
  coupon?: IFrontendCoupon;
  totalAmount?: number;
  finalAmount?: number;
  isCheckedOut: boolean;
  createdAt: string;
  updatedAt: string;
}
