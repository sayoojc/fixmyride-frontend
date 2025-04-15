
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authState {
  user: {
    id: string | null;
    name: string | null;
    role: string | null;
    email:string | null;
  };
  persist:boolean
}

const initialState: authState = {
  user: {
    id: null,
    name: null,
    role: null,
    email:null,
  },
  persist:false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        role: string;
        email:string
      }>
    ) => {
      const { id, name, role,email } = action.payload;
      state.user = { id, name:name, role,email};
    },
    setPersist(state){
      state.persist=!state.persist
    },
    logout: (state) => {
      state.user = {
        id: null,
        name: null,
        role: null,
        email:null,
      };
    },
  },
});

export const { login, logout,setPersist } = authSlice.actions;
export default authSlice.reducer;