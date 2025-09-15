import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./features/authSlice";
import vehicleReducer from './features/vehicleSlice'
import notificationReducer from './features/notificationSlice'
export const makeStore = () => {
  return configureStore({
    reducer: {
        auth: authReducer, 
        vehicle:vehicleReducer,
        notifications:notificationReducer,
      },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']