"use client"

import type React from "react"

import { useState, useEffect, useRef, type KeyboardEvent, type ClipboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Clock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify"

interface OtpVerificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerify: (otp: string) => Promise<void>
  onResend: () => Promise<void>
  email?: string
  phone?: string

}

export default function OtpVerificationModal({
  open,
  onOpenChange,
  onVerify,
  onResend,
  email,
  phone,
}: OtpVerificationModalProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [activeInput, setActiveInput] = useState<number>(0)
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(120) // 2 minutes in seconds
  const [isResending, setIsResending] = useState<boolean>(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter();

  // Timer effect
  useEffect(() => {
    if (!open) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [open])

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setOtp(Array(6).fill(""))
      setActiveInput(0)
      setError(null)
      setSuccess(false)
      setTimeLeft(120)
      setIsVerifying(false)
      setIsResending(false)

      // Focus the first input when modal opens
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }, [open])

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value

    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    // Take only the last character if multiple are entered
    const digit = value.slice(-1)

    // Update OTP array
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    // If a digit was entered and we're not at the last input, move to next
    if (digit && index < 5) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle key down events (for backspace navigation)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        // If current input is empty and we're not at the first input, go back
        if (index > 0) {
          setActiveInput(index - 1)
          inputRefs.current[index - 1]?.focus()

          // Clear the previous input
          const newOtp = [...otp]
          newOtp[index - 1] = ""
          setOtp(newOtp)
        }
      } else {
        // Clear current input
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      }
    }
  }

  // Handle paste event
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtp(digits)
      setActiveInput(5) // Focus the last input after paste
      inputRefs.current[5]?.focus()
    }
  }

  // Handle verification
  const handleVerify = async () => {
    const otpString = otp.join("")
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }
    setIsVerifying(true)
    setError(null)
     try {
      if(!email){
        throw new Error('Email is missing');
      }
      const result = await onVerify(otpString);
      toast.success('Signup successfull');
      router.push('/provider');
    } catch (err) {
      setError("An error occurred during verification. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  // Handle resend
  const handleResend = async () => {
    if (timeLeft > 0) return

    setIsResending(true)
    setError(null)

    try {
      await onResend()
      setTimeLeft(120) // Reset timer
      setOtp(Array(6).fill("")) // Clear OTP fields
      setActiveInput(0) // Focus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    } catch (err) {
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  const inputVariants = {
    idle: { scale: 1 },
    focus: { scale: 1.05, borderColor: "rgb(37, 99, 235)" },
    filled: { backgroundColor: "rgb(239, 246, 255)", borderColor: "rgb(37, 99, 235)" },
    error: { borderColor: "rgb(239, 68, 68)", x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } },
  }

  return (
<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white rounded-t-lg">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-bold">Verification Required</DialogTitle>
            <DialogDescription className="text-blue-100 mt-2">
              Enter the 6-digit code sent to {email || phone || "your device"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>Verification successful!</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants} className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <span className={cn("text-sm font-medium", timeLeft <= 30 ? "text-red-500" : "text-gray-600")}>
                Code expires in {formatTime(timeLeft)}
              </span>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex justify-center gap-2 sm:gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <motion.div
                    key={index}
                    variants={inputVariants}
                    initial="idle"
                    animate={error ? "error" : activeInput === index ? "focus" : otp[index] ? "filled" : "idle"}
                    whileTap={{ scale: 0.98 }}
                    className="w-10 sm:w-12"
                  >
                   <Input
  ref={(el: HTMLInputElement | null) => {
    if (el) {
      inputRefs.current[index] = el;
    }
  }}
  type="text"
  inputMode="numeric"
  maxLength={1}
  value={otp[index]}
  onChange={(e) => handleChange(e, index)}
  onKeyDown={(e) => handleKeyDown(e, index)}
  onPaste={index === 0 ? handlePaste : undefined}
  onFocus={() => setActiveInput(index)}
  disabled={isVerifying || success}
  className={cn(
    "h-12 sm:h-14 text-center text-lg font-bold border-2 focus:ring-2 focus:ring-blue-200",
    otp[index] ? "border-blue-500 bg-blue-50" : "border-gray-300",
    error ? "border-red-500 focus:ring-red-200" : "",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  )}
/>

                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <Button
                onClick={handleVerify}
                disabled={otp.join("").length !== 6 || isVerifying || success}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-md"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Verify Code
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <Button
                  variant="link"
                  onClick={handleResend}
                  disabled={timeLeft > 0 || isResending || isVerifying}
                  className={cn(
                    "p-0 h-auto font-medium",
                    timeLeft > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600",
                  )}
                >
                  {isResending ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Resending...
                    </span>
                  ) : (
                    "Resend Code"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
