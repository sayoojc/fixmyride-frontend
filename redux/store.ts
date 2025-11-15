import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'

import authReducer from "./features/authSlice"
import vehicleReducer from './features/vehicleSlice'
import cartReducer from './features/cartSlice'
import notificationReducer from './features/notificationSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'vehicle', 'notifications', 'cart'],
}

const appReducer = combineReducers({
  auth: authReducer,
  vehicle: vehicleReducer,
  notifications: notificationReducer,
  cart: cartReducer,
})
const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET_ALL") {
    state = undefined 
  }
  return appReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const makePersistor = (store: AppStore) => persistStore(store)
