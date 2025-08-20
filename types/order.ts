export type Order = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  vehicle: {
    _id: string;
    brandId: string;
    modelId: string;
    year: number;
    fuel: string;
    brandName: string;
    modelName: string;
  };
  services: {
    _id: string;
    title: string;
    description: string;
    fuelType: string;
    servicePackageCategory: string;
  }[];
  totalAmount: number;
  finalAmount: number;
  paymentMethod: "cash" | "online";
  paymentStatus: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  serviceDate?: string;
  selectedSlot?: string;
  orderStatus: "placed" | "confirmed" | "in-progress" | "completed" | "cancelled" | "failed";
  statusReason?: string;
  address: {
    _id?: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    location: {
      type: "Point";
      coordinates: [number, number];
    };
  };
    createdAt: string;
  updatedAt: string;
};



export interface IOrderResponse {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  vehicle: {
    _id: string;
    brandId: string;
    modelId: string;
    brandName: string;
    modelName: string;
    year?: number;
    fuel: string;
  };
  services: Array<{
    _id: string;
    title: string;
    description: string;
    fuelType: string;
    servicePackageCategory: string;
    priceBreakup: {
      parts: Array<{
        name: string;
        price: number;
        quantity: number;
      }>;
      laborCharge: number;
      discount?: number;
      tax?: number;
      total: number;
    };
  }>;
  coupon?: {
    code?: string;
    discountType?: "percentage" | "flat";
    discountValue: number;
    discountAmount: number;
    applied: boolean;
  };
  totalAmount: number;
  finalAmount: number;
  paymentMethod: "cash" | "online";
  paymentStatus: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  serviceDate?: string;
  selectedSlot?: string;
  orderStatus:
    | "placed"
    | "confirmed"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "failed";
  statusReason?: string;
  address: {
    _id?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    location: {
      type: "Point";
      coordinates: [number, number];
    };
  };
  createdAt: string;
  updatedAt: string;
  __v?: number;
}


export interface OrderHistory {
  _id: string
  user: {
    _id: string
    name: string
    email: string
    phone?: string
  }
  vehicle: {
    _id: string
    brandId: string
    modelId: string
    brandName: string
    modelName: string
    fuel: string
  }
  services: Array<{
    _id: string
    title: string
    description: string
    fuelType: string
    servicePackageCategory: string
    priceBreakup: {
      parts: Array<{
        name: string
        price: number
        quantity: number
      }>
      laborCharge: number
      discount: number
      tax: number
      total: number
    }
  }>
  coupon?: {
    code?: string
    discountType?: "percentage" | "flat"
    discountValue: number
    discountAmount: number
    applied: boolean
  }
  totalAmount: number
  finalAmount: number
  paymentMethod: "cash" | "online"
  paymentStatus: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  serviceDate?: string
  selectedSlot?: string
  orderStatus: "placed" | "confirmed" | "in-progress" | "completed" | "cancelled" | "failed"
  statusReason?: string
  address: {
    _id?: string
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    zipCode?: string
    location: {
      type: "Point"
      coordinates: [number, number]
    }
  }
  createdAt: string
  updatedAt: string
}
