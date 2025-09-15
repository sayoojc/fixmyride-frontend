
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authState {
  user: {
    id: string | null;
    name: string | null;
    role: string | null;
    email:string | null;
    location:{lat:number,lng:number} | null;
  };
  persist:boolean
}

const initialState: authState = {
  user: {
    id: null,
    name: null,
    role: null,
    email:null,
    location:null
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
        location:{lat:number,lng:number} | null
      }>
    ) => {
      const { id, name, role,email,location } = action.payload;
      state.user = { id, name:name, role,email,location};
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
        location:null
      };
    },
  },
});

export const { login, logout,setPersist } = authSlice.actions;
export default authSlice.reducer;