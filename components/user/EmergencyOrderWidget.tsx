"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, Car, MapPin, Phone, X, ChevronLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEmergencyOrder } from "../../hooks/useEmergencyOrder"

function StatusBadge({ status }: { status: string }) {
  const text = useMemo(() => {
    switch (status) {
      case "waiting":
        return "Waiting for provider"
      case "provider_committed":
        return "Provider committed"
      case "en_route":
        return "Provider en route"
      case "arrived":
        return "Provider arrived"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return "Updating..."
    }
  }, [status])

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        status === "waiting" && "bg-muted text-muted-foreground",
        status === "provider_committed" && "bg-primary text-primary-foreground",
        status === "en_route" && "bg-accent text-accent-foreground",
        status === "arrived" && "bg-secondary text-secondary-foreground",
        status === "completed" && "bg-secondary text-secondary-foreground",
        status === "cancelled" && "bg-destructive text-destructive-foreground",
      )}
      aria-label={`Status: ${text}`}
    >
      {text}
    </span>
  )
}

export default function EmergencyOrderWidget() {
  const { state, openInMapsUrl } = useEmergencyOrder()
  const [expanded, setExpanded] = useState(false)

  // Only show the widget if there's an active order
  if (!state.orderId) return null

  const smallPanel = (
    <button
      type="button"
      onClick={() => setExpanded(true)}
      aria-expanded={expanded}
      aria-label="Open emergency order updates"
      className={cn("group", "fixed right-3 top-1/2 -translate-y-1/2 z-50", "shadow-lg")}
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-l-lg rounded-r-lg border bg-card text-card-foreground",
          "px-3 py-2 pr-3 border-border",
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            "bg-destructive text-destructive-foreground",
          )}
        >
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-sm font-semibold">Emergency Order</span>
          <StatusBadge status={state.status} />
        </div>
      </div>
    </button>
  )

  const expandedPanel = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Emergency order live updates"
      className={cn("fixed right-3 bottom-3 md:top-3 md:bottom-auto z-50", "w-[92vw] max-w-md")}
    >
      <Card className="border-border shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full",
                "bg-destructive text-destructive-foreground",
              )}
            >
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base">Emergency Order</CardTitle>
              <div className="mt-1">
                <StatusBadge status={state.status} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Collapse" onClick={() => setExpanded(false)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Close" onClick={() => setExpanded(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Order summary */}
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Order ID</div>
              <div className="text-sm font-medium">{state.orderId}</div>
            </div>
            {typeof state.etaMinutes === "number" && (
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">ETA</div>
                <div className="text-sm font-medium">{state.etaMinutes} min</div>
              </div>
            )}
          </div>

          {/* Provider info (when committed or beyond) */}
          {(state.status === "provider_committed" ||
            state.status === "en_route" ||
            state.status === "arrived" ||
            state.status === "completed") && (
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm font-semibold">Assigned Provider</div>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{state.provider?.name || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  {state.provider?.phone ? (
                    <a className="font-medium underline underline-offset-4" href={`tel:${state.provider.phone}`}>
                      {state.provider.phone}
                    </a>
                  ) : (
                    <span className="font-medium">—</span>
                  )}
                </div>
                {state.provider?.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Start Location</span>
                    <span className="font-medium">
                      {state.provider.location.lat.toFixed(5)}, {state.provider.location.lng.toFixed(5)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Live location */}
          {(state.status === "en_route" || state.lastLocation) && (
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm font-semibold">Live Location</div>
              </div>
              {state.lastLocation ? (
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Coordinates</span>
                    <span className="font-medium">
                      {state.lastLocation.lat.toFixed(5)}, {state.lastLocation.lng.toFixed(5)}
                    </span>
                  </div>
                  {openInMapsUrl && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Map</span>
                      <a
                        className="font-medium underline underline-offset-4"
                        href={openInMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open in Google Maps
                      </a>
                    </div>
                  )}
                  {state.lastLocation.updatedAt && (
                    <div className="text-xs text-muted-foreground">
                      Updated at {new Date(state.lastLocation.updatedAt).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-2 text-sm text-muted-foreground">Waiting for live location updates...</div>
              )}
            </div>
          )}

          {/* Quick actions */}
          <div className="flex items-center justify-end gap-2">
            {state.provider?.phone && (
              <Button asChild variant="default">
                <a href={`tel:${state.provider.phone}`} aria-label="Call provider">
                  <Phone className="mr-2 h-4 w-4" />
                  Call provider
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return <>{!expanded ? smallPanel : expandedPanel}</>
}
