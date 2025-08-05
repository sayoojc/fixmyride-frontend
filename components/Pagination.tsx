"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  maxVisiblePages?: number
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
}: PaginationProps) {
  const [hoveredPage, setHoveredPage] = useState<number | null>(null)

  // Calculate which pages to show
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const half = Math.floor(maxVisiblePages / 2)
    let start = Math.max(currentPage - half, 1)
    const end = Math.min(start + maxVisiblePages - 1, totalPages)

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const visiblePages = getVisiblePages()
  const showStartEllipsis = visiblePages[0] > 2
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1

  const buttonVariants = {
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.95 },
  }

  const pageVariants = {
    hover: { scale: 1.1, y: -3 },
    tap: { scale: 0.9 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex items-center justify-center space-x-1 p-4"
    >
      {/* Previous Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.button>

      {/* First Page */}
      {showFirstLast && visiblePages[0] > 1 && (
        <>
          <motion.button
            variants={pageVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onPageChange(1)}
            onMouseEnter={() => setHoveredPage(1)}
            onMouseLeave={() => setHoveredPage(null)}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            1
          </motion.button>
          {showStartEllipsis && (
            <div className="flex items-center justify-center w-10 h-10">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </>
      )}

      {/* Visible Pages */}
      {visiblePages.map((page) => (
        <motion.button
          key={page}
          variants={pageVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => onPageChange(page)}
          onMouseEnter={() => setHoveredPage(page)}
          onMouseLeave={() => setHoveredPage(null)}
          className={`flex items-center justify-center w-10 h-10 rounded-lg border font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
            currentPage === page
              ? "bg-blue-600 border-blue-600 text-white shadow-lg"
              : "border-gray-200 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
          }`}
        >
          <motion.span
            animate={{
              scale: hoveredPage === page && currentPage !== page ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {page}
          </motion.span>
        </motion.button>
      ))}

      {/* Last Page */}
      {showFirstLast && visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {showEndEllipsis && (
            <div className="flex items-center justify-center w-10 h-10">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <motion.button
            variants={pageVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onPageChange(totalPages)}
            onMouseEnter={() => setHoveredPage(totalPages)}
            onMouseLeave={() => setHoveredPage(null)}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            {totalPages}
          </motion.button>
        </>
      )}

      {/* Next Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>

      {/* Page Info */}
      <div className="ml-4 text-sm text-gray-500 font-medium">
        Page {currentPage} of {totalPages}
      </div>
    </motion.div>
  )
}
