"use client"

import type React from "react"
import { useRouter, useParams } from "next/navigation"
import { useState } from "react"
import { AxiosError } from "axios"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"
import createAuthApi from "@/services/authApi"
import { axiosPrivate } from "@/api/axios"
const authApi = createAuthApi(axiosPrivate);


const ResetPasswordPage = () => {
  const router = useRouter()
  const params = useParams();
const token = params.token as string;

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
      setIsLoading(false)
      return
    }
    try {
      const response = await authApi.resetPasswordApi(
        token,
        password,
      )
      setMessage("Password reset successful! Redirecting to login...")
      toast.success("Password reset successful! Redirecting to login...")
      setTimeout(() => router.push("/"), 3000)
    } catch (err) {
      
      const error = err as AxiosError<{message:string}>
      setMessage(error.response?.data?.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-violet-950 to-black p-4">
      <div className="relative w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-2xl border border-violet-500/20">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-violet-600/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-violet-600/20 rounded-full blur-xl"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-violet-900/50 flex items-center justify-center">
              <span className="text-3xl">🔒</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-2">Reset Password</h1>
          <p className="text-violet-300 text-center mb-6">Enter your new password below</p>

          {message && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-violet-200">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-violet-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white transition-all duration-200"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-violet-200">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-violet-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white transition-all duration-200"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-violet-700 hover:bg-violet-600 text-white rounded-lg font-semibold transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-violet-400 hover:text-violet-300 text-sm transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
