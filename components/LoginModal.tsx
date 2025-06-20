"use client"

import type React from "react"
import { useState } from "react"
import { z } from "zod"
import { X, Loader2 } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

interface LoginModalProps {
  showLoginModal: boolean
  setShowLoginModal: (show: boolean) => void
  setShowSignupModal: (show: boolean) => void
  loginData: {
    email: string
    password: string
    rememberMe: boolean
  }
  handleLoginInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleLoginSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  handleForgotPassword: (email: string) => void
}

const LoginModal: React.FC<LoginModalProps> = ({
  showLoginModal,
  setShowLoginModal,
  setShowSignupModal,
  loginData,
  handleLoginInputChange,
  handleLoginSubmit,
  handleForgotPassword,
}) => {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  if (!showLoginModal) return null

  const validateAndSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = loginSchema.safeParse(loginData)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      })
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      handleLoginSubmit(e) // Call parent submit logic
    } catch (err) {
      console.error("Login failed", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-2xl border border-violet-500/20 animate-fadeIn">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-violet-600/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-violet-600/20 rounded-full blur-xl"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-violet-900/50 flex items-center justify-center mr-3">
                <span className="text-xl">🔐</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Login</h2>
            </div>
            <button
              onClick={() => setShowLoginModal(false)}
              className="text-violet-300 hover:text-white transition-colors rounded-full p-1 hover:bg-violet-800/30"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={validateAndSubmit}>
            <div className="mb-4">
              <label className="block text-violet-200 mb-2 text-sm font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-violet-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white transition-all duration-200"
                required
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mb-5">
              <label className="block text-violet-200 mb-2 text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-violet-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white transition-all duration-200"
                required
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                name="rememberMe"
                id="rememberMe"
                checked={loginData.rememberMe}
                onChange={handleLoginInputChange}
                className="mr-2 h-4 w-4 rounded border-violet-500/50 text-violet-600 focus:ring-violet-500"
              />
              <label htmlFor="rememberMe" className="text-violet-200 text-sm">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-violet-700 hover:bg-violet-600 text-white rounded-lg font-semibold transition duration-200 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            <div className="mt-6 text-center space-y-3">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
                  onClick={() => {
                    setShowLoginModal(false)
                    setShowSignupModal(true)
                  }}
                >
                  Sign up
                </button>
              </p>
              <p>
                <button
                  type="button"
                  className="text-violet-400 hover:text-violet-300 transition-colors text-sm"
                  onClick={() => handleForgotPassword(loginData.email)}
                >
                  Forgot password?
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
