"use client"

import type React from "react"
import { useCallback } from "react"
import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string
  confirmText: string
  variant?: "default" | "destructive"
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  variant = "default",
}) => {
  const handleConfirm = useCallback(async (): Promise<void> => {
    try {
      await onConfirm()
    } catch (error) {
      console.error("Error in confirmation action:", error)
    }
  }, [onConfirm])

  const handleClose = useCallback((): void => {
    onClose()
  }, [onClose])

  const iconColorClass: string = variant === "destructive" ? "text-red-600" : "text-blue-600"
  const backgroundColorClass: string = variant === "destructive" ? "bg-red-100" : "bg-blue-100"

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${backgroundColorClass}`}>
              <AlertTriangle className={`h-5 w-5 ${iconColorClass}`} />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </motion.div>
        </DialogHeader>
        <DialogDescription className="text-gray-600">{message}</DialogDescription>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant={variant} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog
