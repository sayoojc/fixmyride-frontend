export interface Model {
  brand: string;
  fuelTypes: [string];
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
export type ModelType = {
  name: string;
  imageUrl: string;
  _id: string;
  brand: string;
  fuelTypes: string[];
};
