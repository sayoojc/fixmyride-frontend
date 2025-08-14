"use client"

import { useState, useEffect, useRef, type KeyboardEvent, type ClipboardEvent } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Clock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify"
import createAuthApi from "@/services/authApi"
import { axiosPrivate } from "@/api/axios"
import { AxiosError } from "axios"
const authApi = createAuthApi(axiosPrivate);

export default function OtpVerificationPage() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [activeInput, setActiveInput] = useState<number>(0)
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(120)
  const [isResending, setIsResending] = useState<boolean>(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter();

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus()
    }, 100)
  }, [])


  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    if (!/^\d*$/.test(value)) return
    const digit = value.slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    if (digit && index < 5) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          setActiveInput(index - 1)
          inputRefs.current[index - 1]?.focus()
          const newOtp = [...otp]
          newOtp[index - 1] = ""
          setOtp(newOtp)
        }
      } else {
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      }
    }
  }
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtp(digits)
      setActiveInput(5)
      inputRefs.current[5]?.focus()
    }
  }

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
      if(!phone){
        throw new Error("phone is missing");
      }
      const result = await authApi.providerRegisterApi(otpString,email,phone)
      toast.success('Signup successful');
      router.push('/provider');
    } catch (err) {
       const error  = err as AxiosError<{message:string}>
       toast.error(error.response?.data.message);
    } finally {
      setIsVerifying(false)
    }
  }
  const handleResend = async () => {
    if (timeLeft > 0) return
    setIsResending(true)
    setError(null)
    try { 
      setTimeLeft(120)
      setOtp(Array(6).fill(""))
      setActiveInput(0)
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    } catch (err) {
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <h1 className="text-2xl font-bold">Verification Required</h1>
          <p className="text-blue-100 mt-2">
            Enter the 6-digit code sent to {email}
          </p>
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
      </div>
    </div>
  );
}