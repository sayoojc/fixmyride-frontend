"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { axiosPrivate } from "@/api/axios"
import createUserApi from "@/services/userApi"
import type { AxiosError } from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  BellRing,
  Package,
  Info,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Search,
  MoreVertical,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "react-toastify"
import type { INotification } from "@/types/notification"
import { ConfirmationModal, type ConfirmationConfig } from "../../../components/ConfirmationModal"

const userApi = createUserApi(axiosPrivate)

interface PaginatedNotificationResponse {
  notifications: INotification[]
  pagination: {
    currentPage: number
    totalPages: number
    totalNotifications: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "service_request":
      return <Package className="h-5 w-5 text-blue-600" />
    case "order":
      return <Package className="h-5 w-5 text-green-600" />
    case "info":
      return <Info className="h-5 w-5 text-blue-600" />
    case "admin_announcement":
      return <AlertCircle className="h-5 w-5 text-red-600" />
    default:
      return <Bell className="h-5 w-5 text-slate-600" />
  }
}

const getNotificationTypeColor = (type: string) => {
  switch (type) {
    case "service_request":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "order":
      return "bg-green-100 text-green-800 border-green-200"
    case "info":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "admin_announcement":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

const getRelativeTime = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return formatDate(dateString)
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalNotifications, setTotalNotifications] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPrevPage, setHasPrevPage] = useState(false)
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    config: ConfirmationConfig | null
    isLoading: boolean
  }>({
    isOpen: false,
    config: null,
    isLoading: false,
  })

  const fetchNotifications = async (
    page: number = currentPage,
    limit: number = itemsPerPage,
    filterType: string = filter,
    search: string = searchQuery,
  ) => {
    try {
      setLoading(true)
      const response = await userApi.getNotifications(search, page, limit, filterType === "all" ? "" : filterType);
      console.log('Fetched notifications:', response);
      setNotifications(response.notifications || [])
      setTotalPages(response.totalPages)
      setTotalNotifications(response.totalCount)
      setHasNextPage(response.hasNextPage)
      setHasPrevPage(response.hasPrevPage)
      setCurrentPage(response.currentPage)
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      console.log('the error in the catch block of the fetchNotifications',err.message)
      toast.error(err.response?.data.message || "Failed to fetch notifications")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await userApi.markNotificationAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id.toString() === notificationId ? { ...notification, isRead: true } : notification,
        ),
      )
      toast.success("Notification marked as read")
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      toast.error(err.response?.data.message || "Failed to mark notification as read")
    }
  }

  const markAsUnread = async (notificationId: string) => {
    try {
      await userApi.markNotificationAsUnread(notificationId)
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id.toString() === notificationId ? { ...notification, isRead: false } : notification,
        ),
      )
      toast.success("Notification marked as unread")
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      toast.error(err.response?.data.message || "Failed to mark notification as unread")
    }
  }

  const handleDeleteNotification = (notificationId: string, message: string) => {
    setConfirmationModal({
      isOpen: true,
      isLoading: false,
      config: {
        title: "Delete Notification",
        description: (
          <div>
            <p>Are you sure you want to delete this notification?</p>
            <div className="mt-2 p-2 bg-slate-50 rounded text-sm text-slate-600">
              "{message.length > 100 ? message.substring(0, 100) + "..." : message}"
            </div>
          </div>
        ),
        confirmText: "Delete",
        cancelText: "Cancel",
        variant: "destructive",
        onConfirm: async () => {
          try {
            setConfirmationModal((prev) => ({ ...prev, isLoading: true }))
            await userApi.deleteNotification(notificationId)
            setNotifications((prev) => prev.filter((notification) => notification._id.toString() !== notificationId))
            toast.success("Notification deleted successfully")
            setConfirmationModal({ isOpen: false, config: null, isLoading: false })
          } catch (error) {
            const err = error as AxiosError<{ message: string }>
            toast.error(err.response?.data.message || "Failed to delete notification")
            setConfirmationModal((prev) => ({ ...prev, isLoading: false }))
          }
        },
      },
    })
  }

  const markAllAsRead = async () => {
    try {
      await userApi.markAllAsRead()
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
      toast.success("All notifications marked as read")
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      toast.error(err.response?.data.message || "Failed to mark all notifications as read")
    }
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value))
  }

  const handleFilterChange = (value: string) => {
    setFilter(value)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1)
      fetchNotifications(1, itemsPerPage, filter, searchQuery)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  useEffect(() => {
    fetchNotifications(currentPage, itemsPerPage, filter, searchQuery)
  }, [itemsPerPage, currentPage, filter])

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (loading && notifications.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your notifications...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div className="container mx-auto py-6" initial="hidden" animate="visible" variants={fadeIn}>
      <Card className="border shadow-lg overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center relative">
                <BellRing className="h-6 w-6 text-red-600" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{unreadCount}</span>
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">Notifications</CardTitle>
                <p className="text-slate-600 mt-1">Stay updated with your latest activities</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                >
                  Mark all as read
                </Button>
              )}

              {totalNotifications > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Show:</span>
                  <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-slate-600">per page</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Filter:</span>
                <Select value={filter} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="service_request">Service Requests</SelectItem>
                    <SelectItem value="order">Orders</SelectItem>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="admin_announcement">Announcements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {totalNotifications > 0 && (
              <div className="text-sm text-slate-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalNotifications)} of {totalNotifications} notifications
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="relative">
            {loading && notifications.length > 0 && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            )}

            {notifications.length === 0 && !loading ? (
              <motion.div className="text-center py-12" variants={fadeIn}>
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No Notifications</h3>
                <p className="text-slate-600 mb-6">
                  {searchQuery
                    ? "No notifications found matching your search."
                    : "You're all caught up! New notifications will appear here when you have updates."}
                </p>
              </motion.div>
            ) : (
              <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" animate="visible">
                {notifications.map((notification) => (
                  <motion.div key={notification._id.toString()} variants={fadeIn}>
                    <Card
                      className={`border transition-all duration-300 hover:shadow-md ${
                        !notification.isRead
                          ? "border-red-200 bg-red-50/30 shadow-sm"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          {/* Notification Icon */}
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                          {/* Notification Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Badge className={getNotificationTypeColor(notification.type)}>
                                  {notification.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                </Badge>
                                {!notification.isRead && <div className="h-2 w-2 bg-red-600 rounded-full"></div>}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-slate-500">
                                  {getRelativeTime(notification.createdAt.toString())}
                                </span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {notification.isRead ? (
                                      <DropdownMenuItem onClick={() => markAsUnread(notification._id.toString())}>
                                        <EyeOff className="h-4 w-4 mr-2" />
                                        Mark as unread
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => markAsRead(notification._id.toString())}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        Mark as read
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteNotification(notification._id.toString(), notification.message)
                                      }
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                            <p
                              className={`text-sm leading-relaxed ${
                                !notification.isRead ? "text-slate-800 font-medium" : "text-slate-600"
                              }`}
                            >
                              {notification.message}
                            </p>

                            {notification.link && (
                              <div className="mt-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                                  onClick={() => window.open(notification.link, "_blank")}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            )}

                            <div className="mt-2 text-xs text-slate-500">
                              {formatDate(notification.createdAt.toString())} at{" "}
                              {formatTime(notification.createdAt.toString())}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Page info */}
              <div className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </div>

              {/* Pagination controls */}
              <div className="flex items-center space-x-2">
                {/* Previous button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrevPage || loading}
                  className="flex items-center space-x-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === "..." ? (
                        <span className="px-2 py-1 text-slate-400">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page as number)}
                          disabled={loading}
                          className={`min-w-[40px] ${
                            currentPage === page ? "bg-red-600 hover:bg-red-700 text-white" : "hover:bg-slate-50"
                          }`}
                        >
                          {page}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Next button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNextPage || loading}
                  className="flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, config: null, isLoading: false })}
        config={confirmationModal.config}
        isLoading={confirmationModal.isLoading}
      />
    </motion.div>
  )
}
