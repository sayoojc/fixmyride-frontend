import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFrontendCart, IFrontendServiceDetails } from "../../types/cart";

interface CartState {
  cart: IFrontendCart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<IFrontendCart>) => {
      state.cart = action.payload;
      state.error = null;
    },
    clearCart: (state) => {
      state.cart = null;
    },
    addServiceToCart: (
      state,
      action: PayloadAction<IFrontendServiceDetails>
    ) => {
      if (state.cart) {
        state.cart.services.push({ serviceId: action.payload });
      }
    },
    removeServiceFromCart: (state, action: PayloadAction<string>) => {
      if (state.cart) {
        state.cart.services = state.cart.services.filter(
          (s) => s.serviceId._id !== action.payload
        );
      }
    },
    clearServicesFromCart: (state) => {
      if (state.cart) {
        state.cart.services = [];
      }
    },
  },
});

export const { setCart, clearCart, addServiceToCart, removeServiceFromCart,clearServicesFromCart } =
  cartSlice.actions;

export default cartSlice.reducer;
