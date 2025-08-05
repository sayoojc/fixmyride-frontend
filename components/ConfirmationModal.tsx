"use client"

import type { ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ConfirmationConfig {
  title: string
  description: string | ReactNode
  confirmText: string
  cancelText?: string
  variant?: "default" | "destructive" | "success" | "warning"
  onConfirm: () => void | Promise<void>
}

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  config: ConfirmationConfig | null
  isLoading?: boolean
}

const variantStyles = {
  default: "bg-primary hover:bg-primary/90",
  destructive: "bg-red-600 hover:bg-red-700",
  success: "bg-green-600 hover:bg-green-700",
  warning: "bg-yellow-600 hover:bg-yellow-700",
}

export function ConfirmationModal({ isOpen, onClose, config, isLoading = false }: ConfirmationModalProps) {
  if (!config) return null

  const handleConfirm = async () => {
    await config.onConfirm()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{config.title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            {typeof config.description === "string" ? <p>{config.description}</p> : config.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{config.cancelText || "Cancel"}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(variantStyles[config.variant || "default"])}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              config.confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
