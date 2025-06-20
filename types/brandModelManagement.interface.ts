export interface Model {
  _id: string;
  name: string;
  imageUrl: string;
  status: "active" | "blocked";
}

export interface Brand {
  _id: string;
  brandName: string;
  status: "active" | "blocked";
  imageUrl: string;
  models: Model[];
}



export interface BrandModelManagementProps {
  brands: Brand[];
  totalPages: number;
  currentPage: number;
  searchTerm: string;
  statusFilter:string;
}