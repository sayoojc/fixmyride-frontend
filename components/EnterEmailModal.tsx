"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import createAuthApi from "@/services/authApi"
import { axiosPrivate } from "@/api/axios"
import type { AxiosError } from "axios"
import Loader from "./Loader"
import { X } from "lucide-react"

const authApi = createAuthApi(axiosPrivate)

const EmailInputModal: React.FC<{ setShowEmailInputModal: (value: boolean) => void }> = ({
  setShowEmailInputModal,
}) => {
  const [email, setEmail] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!email) {
      setError("Email is required")
      setIsLoading(false)
      return
    }

    try {
      const response = await authApi.forgotPasswordApi(email)
      alert(response?.message || "OTP sent successfully!")
      setShowEmailInputModal(false)
    } catch (err) {
      const axiosError = err as AxiosError
      const errorMsg = (axiosError?.response?.data as any)?.message || "Something went wrong"
      setError(errorMsg)
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
                <span className="text-xl">✉️</span>
              </div>
              <h2 className="text-xl font-bold text-white">Password Recovery</h2>
            </div>
            <button
              onClick={() => setShowEmailInputModal(false)}
              className="text-violet-300 hover:text-white transition-colors rounded-full p-1 hover:bg-violet-800/30"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-violet-300 mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-violet-200">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                placeholder="example@email.com"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-violet-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-violet-700 hover:bg-violet-600 text-white rounded-lg font-semibold transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader />
                  <span className="ml-2">Sending...</span>
                </>
              ) : (
                "Send Recovery Link"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowEmailInputModal(false)}
              className="text-violet-400 hover:text-violet-300 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailInputModal
