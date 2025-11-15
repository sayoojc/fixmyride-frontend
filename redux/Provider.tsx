'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { makeStore, AppStore, makePersistor } from './store'
let globalPersistor: any = null;
let globalStore: AppStore | null = null;

export function getPersistor() {
  return globalPersistor;
}

export function getStore() {
  return globalStore;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<{ store: AppStore; persistor: any }>(null)

  if (!storeRef.current) {
    const store = makeStore()
    const persistor = makePersistor(store)
    globalStore = store
    globalPersistor = persistor

    storeRef.current = { store, persistor }
  }

  return (
    <Provider store={storeRef.current.store}>
      <PersistGate loading={null} persistor={storeRef.current.persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
