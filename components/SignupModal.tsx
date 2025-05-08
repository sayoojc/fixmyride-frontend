"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
import { X, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { login } from "@/redux/features/authSlice"
import type { AppDispatch } from "@/redux/store"

const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name must be less than 50 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^\+?[\d\s-]*$/, "Phone number must contain only digits, spaces, dashes, or optional +")
      .refine((val) => (val.match(/\d/g) || []).length === 10, {
        message: "Phone number must contain exactly 10 digits",
      }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


interface SignupModalProps {
  showSignupModal: boolean
  setShowSignupModal: (show: boolean) => void
  setShowLoginModal: (show: boolean) => void
  signupData: {
    fullName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    agreeTerms: boolean
  }
  handleSignupInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSignupSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

const SignupModal: React.FC<SignupModalProps> = ({
  showSignupModal,
  setShowSignupModal,
  setShowLoginModal,
  signupData,
  handleSignupInputChange,
  handleSignupSubmit,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  // Handle Google signup
  const handleGoogleSignup = () => {
    const receiveMessage = (event: MessageEvent) => {
      const data = event.data
      dispatch(
        login({
          id: data.id,
          name: data.name,
          role: data.role,
          email: data.email,
        }),
      )

      window.removeEventListener("message", receiveMessage)
      window.location.href = "/user"
    }

    window.addEventListener("message", receiveMessage)
    window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/google?state=user`, "_blank", "width=500,height=600")
  }

  const validateAndSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate signupData with Zod
    const validation = signupSchema.safeParse(signupData)

    if (!validation.success) {
      // Extract errors and map them to field names
      const fieldErrors: Record<string, string> = {}
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    // Clear errors if validation passes
    setErrors({})
    setIsLoading(true)

    try {
      await handleSignupSubmit(e)
    } catch (err) {
      console.error("Signup failed", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!showSignupModal) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md bg-gray-900 rounded-2xl p-6 shadow-2xl border border-violet-500/20 animate-fadeIn max-h-[90vh] "
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-violet-600/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-violet-600/20 rounded-full blur-xl"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-violet-900/50 flex items-center justify-center mr-3">
                <span className="text-lg">👤</span>
              </div>
              <h2 className="text-xl font-bold text-white">Sign Up</h2>
            </div>
            <button
              onClick={() => setShowSignupModal(false)}
              className="text-violet-300 hover:text-white transition-colors rounded-full p-1 hover:bg-violet-800/30"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={validateAndSubmit} className="space-y-3" noValidate>
            <div>
              <label className="block text-violet-200 mb-1 text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={signupData.fullName}
                onChange={handleSignupInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-violet-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white transition-all duration-200"
                required
              />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-violet-200 mb-1 text-sm font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-violet-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white transition-all duration-200"
                required
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-violet-200 mb-1 text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={signupData.phone}
                onChange={handleSignupInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-violet-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white transition-all duration-200"
                required
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-violet-200 mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={signupData.password}
                onChange={handleSignupInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-violet-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white transition-all duration-200"
                required
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-violet-200 mb-1 text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={signupData.confirmPassword}
                onChange={handleSignupInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-violet-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white transition-all duration-200"
                required
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-violet-700 hover:bg-violet-600 text-white rounded-lg font-semibold transition duration-200 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="flex items-center my-2">
              <div className="flex-grow border-t border-violet-500/20"></div>
              <span className="px-3 text-xs text-violet-300">or</span>
              <div className="flex-grow border-t border-violet-500/20"></div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="p-2 bg-white hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Sign up with Google"
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
                  onClick={() => {
                    setShowSignupModal(false)
                    setShowLoginModal(true)
                  }}
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default SignupModal
