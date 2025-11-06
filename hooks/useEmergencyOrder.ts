"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { Socket } from "socket.io-client"
import { getSocket } from "@/lib/socket"

export type EmergencyOrderStatus = "waiting" | "provider_committed" | "en_route" | "arrived" | "completed" | "cancelled"

export interface ProviderInfo {
  id?: string
  name: string
  phone: string
  location?: { lat: number; lng: number }
}

export interface EmergencyOrderState {
  orderId: string | null
  status: EmergencyOrderStatus
  provider?: ProviderInfo | null
  lastLocation?: { lat: number; lng: number; updatedAt?: string } | null
  etaMinutes?: number | null
}

const LOCAL_KEY = "activeEmergencyOrderId"

function getSocketUrl() {
  if (typeof window === "undefined") return undefined
  // Prefer explicit environment var; fallback to current origin.
  return process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin
}

export function useEmergencyOrder(initialOrderId?: string | null) {
  const [orderId, setOrderId] = useState<string | null>(() => {
    if (initialOrderId !== undefined) return initialOrderId
    if (typeof window === "undefined") return null
    return localStorage.getItem(LOCAL_KEY)
  })

  const [status, setStatus] = useState<EmergencyOrderStatus>("waiting")
  const [provider, setProvider] = useState<ProviderInfo | null>(null)
  const [lastLocation, setLastLocation] = useState<{
    lat: number
    lng: number
    updatedAt?: string
  } | null>(null)
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null)

  const socketRef = useRef<Socket | null>(null)

  // Write-through to localStorage for persistence
  const persistOrderId = useCallback((id: string | null) => {
    if (typeof window === "undefined") return
    if (id) {
      localStorage.setItem(LOCAL_KEY, id)
    } else {
      localStorage.removeItem(LOCAL_KEY)
    }
  }, [])

  const clearOrder = useCallback(() => {
    setOrderId(null)
    setStatus("waiting")
    setProvider(null)
    setLastLocation(null)
    setEtaMinutes(null)
    persistOrderId(null)
    // Inform other tabs
    if (typeof window !== "undefined") {
      window.dispatchEvent(new StorageEvent("storage", { key: LOCAL_KEY }))
    }
  }, [persistOrderId])

  // Allow other parts of the app to set/clear the active order via a window event
  useEffect(() => {
    if (typeof window === "undefined") return
    const onSetOrder = (e: Event) => {
      const ce = e as CustomEvent<{ orderId: string }>
      if (ce?.detail?.orderId) {
        setOrderId(ce.detail.orderId)
        persistOrderId(ce.detail.orderId)
        console.log("[v0] Emergency order set via event:", ce.detail.orderId)
      }
    }
    const onClearOrder = () => clearOrder()

    window.addEventListener("emergency:set-order", onSetOrder as EventListener)
    window.addEventListener("emergency:clear-order", onClearOrder as EventListener)

    return () => {
      window.removeEventListener("emergency:set-order", onSetOrder as EventListener)
      window.removeEventListener("emergency:clear-order", onClearOrder as EventListener)
    }
  }, [clearOrder, persistOrderId])

  // Keep in sync when localStorage changes (e.g., other tabs)
  useEffect(() => {
    if (typeof window === "undefined") return
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_KEY) {
        const id = localStorage.getItem(LOCAL_KEY)
        setOrderId(id)
        if (!id) {
          setStatus("waiting")
          setProvider(null)
          setLastLocation(null)
          setEtaMinutes(null)
        }
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  // Attach listeners to the shared socket when orderId exists (no new connections)
  useEffect(() => {
    if (!orderId) {
      // Detach listeners if we had any for a previous order
      if (socketRef.current) {
        try {
          socketRef.current.emit("order:leave", { orderId: "" })
        } catch {}
        socketRef.current = null
      }
      return
    }

    const socket = getSocket()
    socketRef.current = socket

    // Always (re)join the order room when we mount for this orderId
    console.log("[v0] Joining order room:", orderId)
    socket.emit("order:join", { orderId })

    // Expected server-emitted events (adjust to your backend as needed)
    const onStatus = (payload: { orderId: string; status: EmergencyOrderStatus; etaMinutes?: number }) => {
      if (payload.orderId !== orderId) return
      setStatus(payload.status)
      if (typeof payload.etaMinutes === "number") setEtaMinutes(payload.etaMinutes)
    }
    socket.on("order:status", onStatus)

    const onCommitted = (payload: { orderId: string; provider: ProviderInfo }) => {
      if (payload.orderId !== orderId) return
      setStatus("provider_committed")
      setProvider(payload.provider)
      if (payload.provider?.location) {
        setLastLocation({ ...payload.provider.location, updatedAt: new Date().toISOString() })
      }
    }
    socket.on("order:committed", onCommitted)

    const onLocation = (payload: { orderId: string; lat: number; lng: number; updatedAt?: string }) => {
      if (payload.orderId !== orderId) return
      setStatus((prev) => (prev === "waiting" ? "en_route" : prev))
      setLastLocation({ lat: payload.lat, lng: payload.lng, updatedAt: payload.updatedAt || new Date().toISOString() })
    }
    socket.on("order:location", onLocation)

    const onCompleted = (payload: { orderId: string }) => {
      if (payload.orderId !== orderId) return
      setStatus("completed")
    }
    socket.on("order:completed", onCompleted)

    const onCancelled = (payload: { orderId: string }) => {
      if (payload.orderId !== orderId) return
      setStatus("cancelled")
    }
    socket.on("order:cancelled", onCancelled)

    const onOrderUpdate = (data: any) => {
      // Expected shapes can vary; try to map common fields
      if (data?.orderId && data.orderId !== orderId) return
      if (data?.status) setStatus(data.status as any)
      if (data?.etaMinutes !== undefined) setEtaMinutes(data.etaMinutes)
      if (data?.provider) setProvider(data.provider as any)
      if (data?.location || (typeof data?.lat === "number" && typeof data?.lng === "number")) {
        const lat = data.location?.lat ?? data.lat
        const lng = data.location?.lng ?? data.lng
        if (typeof lat === "number" && typeof lng === "number") {
          setStatus((prev) => (prev === "waiting" ? "en_route" : prev))
          setLastLocation({ lat, lng, updatedAt: data.updatedAt || new Date().toISOString() })
        }
      }
    }
    socket.on("order:update", onOrderUpdate)

    return () => {
      console.log("[v0] Leaving order room and detaching listeners for order:", orderId)
      try {
        socket.emit("order:leave", { orderId })
      } catch {}
      socket.off("order:status", onStatus)
      socket.off("order:committed", onCommitted)
      socket.off("order:location", onLocation)
      socket.off("order:completed", onCompleted)
      socket.off("order:cancelled", onCancelled)
      socket.off("order:update", onOrderUpdate)
      // Keep the shared socket alive for other parts of the app
      socketRef.current = null
    }
  }, [orderId])

  const openInMapsUrl = useMemo(() => {
    if (!lastLocation) return null
    return `https://www.google.com/maps?q=${lastLocation.lat},${lastLocation.lng}`
  }, [lastLocation])

  return {
    state: {
      orderId,
      status,
      provider,
      lastLocation,
      etaMinutes,
    } as EmergencyOrderState,
    setOrderId: (id: string | null) => {
      setOrderId(id)
      persistOrderId(id)
    },
    clearOrder,
    openInMapsUrl,
  }
}

export function setActiveEmergencyOrder(orderId: string) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent("emergency:set-order", { detail: { orderId } }))
}

export function clearActiveEmergencyOrder() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event("emergency:clear-order"))
}
