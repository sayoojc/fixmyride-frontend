"use client"

import { useState, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

import createAuthApi from "@/services/authApi"
import { axiosPrivate } from "@/api/axios"
const authApi = createAuthApi(axiosPrivate);
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter()
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormErrors({})
    setIsSubmitting(true)
  
    const result = loginSchema.safeParse(loginData)
  
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      setFormErrors({
        email: errors.email?.[0],
        password: errors.password?.[0],
      })
      setIsSubmitting(false)
      return
    }
  
    try {
      let response = await authApi.providerLoginApi(loginData.email, loginData.password)
      console.log('response',response);
    
        toast.success("Login successful!")
        onClose()
        router.push("/provider/dashboard")
    
     
    } catch (error) {
      toast.error("Login failed")
    } finally {
      setIsSubmitting(false)
    }
  }
  

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={modalVariants}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <h2 className="text-xl font-bold">Login to Your Account</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-blue-700/50">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <div className="space-y-2">
  <label className="text-sm font-medium text-gray-700">Email</label>
  <Input
    type="email"
    value={loginData.email}
    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
    placeholder="your@email.com"
    className={`border-gray-300 focus:border-blue-500 ${formErrors.email ? "border-red-500" : ""}`}
  />
  {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
</div>

<div className="space-y-2">
  <label className="text-sm font-medium text-gray-700">Password</label>
  <div className="relative">
    <Input
      type={showPassword ? "text" : "password"}
      value={loginData.password}
      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
      placeholder="Enter your password"
      className={`border-gray-300 focus:border-blue-500 pr-10 ${formErrors.password ? "border-red-500" : ""}`}
    />
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  </div>
  {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
</div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <Button variant="link" className="p-0 text-blue-600">
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Button variant="link" className="p-0 text-blue-600">
                  Sign up
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
