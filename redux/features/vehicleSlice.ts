import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VehicleState {
  id:string,
  brand: {
    name: string;
    imageUrl: string;
  } | null;
  model: {
    name: string;
    imageUrl: string;
    fuelType:string;
  } | null;
}

const initialState: VehicleState = {
  id:'',
  brand: null,
  model: null,
};

export const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    setVehicleData: (
      state,
      action: PayloadAction<{
        id:string,
        brand: { name: string; imageUrl: string };
        model: { name: string; imageUrl: string,fuelType:string };
      }>
    ) => {
      state.id = action.payload.id;
      state.brand = action.payload.brand;
      state.model = action.payload.model;
    },
    clearVehicleData: (state) => {
      state.id = "";
      state.brand = null;
      state.model = null;
    },
  },
});

export const { setVehicleData, clearVehicleData } = vehicleSlice.actions;
export default vehicleSlice.reducer;
