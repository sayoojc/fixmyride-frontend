"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Animated 404 Number */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
        </motion.div>

        {/* Animated Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600 text-lg">Oops! The page you're looking for doesn't exist.</p>
        </motion.div>

        {/* Animated Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => window.history.back()}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-all duration-300"
            >
              <ArrowLeft className="mr-2" size={20} />
              Go Back
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Animation Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-300 rounded-full opacity-60"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/3 w-3 h-3 bg-indigo-300 rounded-full opacity-50"
            animate={{
              y: [0, 15, 0],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full opacity-70"
            animate={{
              y: [0, -10, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute top-1/6 right-1/4 w-5 h-5 bg-purple-300 rounded-full opacity-40"
            animate={{
              y: [0, -25, 0],
              x: [0, -8, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/6 w-3 h-3 bg-cyan-300 rounded-full opacity-55"
            animate={{
              y: [0, 18, 0],
              x: [0, 12, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />
          <motion.div
            className="absolute top-2/3 left-1/6 w-6 h-6 bg-rose-300 rounded-full opacity-35"
            animate={{
              y: [0, -30, 0],
              x: [0, 25, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />
          <motion.div
            className="absolute top-1/2 right-1/5 w-2 h-2 bg-emerald-300 rounded-full opacity-65"
            animate={{
              y: [0, -12, 0],
              x: [0, -18, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.5,
            }}
          />
          <motion.div
            className="absolute bottom-1/5 left-1/5 w-4 h-4 bg-amber-300 rounded-full opacity-45"
            animate={{
              y: [0, 22, 0],
              x: [0, -14, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          />
          <motion.div
            className="absolute top-1/5 left-2/3 w-3 h-3 bg-teal-300 rounded-full opacity-50"
            animate={{
              y: [0, -16, 0],
              x: [0, 8, 0],
              rotate: [0, -180],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.8,
            }}
          />
        </div>
      </div>
    </div>
  )
}