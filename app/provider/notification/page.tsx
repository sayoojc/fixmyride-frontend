"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { axiosPrivate } from "@/api/axios"
import createProviderApi from "@/services/providerApi"
import type { IServiceProvider } from "@/types/provider"
import { ProviderSidebar } from "@/components/provider/ProviderSidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Bell,
  Search,
  MoreVertical,
  Check,
  CheckCheck,
  Trash2,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  User,
} from "lucide-react"
import { getSocket } from "../../../lib/socket"

const providerApi = createProviderApi(axiosPrivate)

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  category: "order" | "payment" | "system" | "appointment" | "general"
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

// Mock notifications data - replace with your API call
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Emergency Order",
    message: "You have received a new emergency car service request in your area.",
    type: "info",
    category: "order",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    actionUrl: "/provider/orders/123",
  },
  {
    id: "2",
    title: "Payment Received",
    message: "Payment of $150.00 has been processed for order #ORD-456.",
    type: "success",
    category: "payment",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "3",
    title: "Appointment Reminder",
    message: "You have an upcoming appointment tomorrow at 2:00 PM.",
    type: "warning",
    category: "appointment",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "4",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 12:00 AM to 2:00 AM.",
    type: "warning",
    category: "system",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: "5",
    title: "Profile Update Required",
    message: "Please update your service area information to continue receiving orders.",
    type: "error",
    category: "general",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
]

const getNotificationIcon = (type: string, category: string) => {
  if (category === "order") return Bell
  if (category === "payment") return DollarSign
  if (category === "appointment") return Calendar
  if (category === "general") return User

  switch (type) {
    case "success":
      return CheckCircle
    case "warning":
      return AlertCircle
    case "error":
      return XCircle
    default:
      return Info
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "success":
      return "text-green-600 bg-green-50"
    case "warning":
      return "text-yellow-600 bg-yellow-50"
    case "error":
      return "text-red-600 bg-red-50"
    default:
      return "text-blue-600 bg-blue-50"
  }
}

const getBadgeVariant = (type: string) => {
  switch (type) {
    case "success":
      return "default"
    case "warning":
      return "secondary"
    case "error":
      return "destructive"
    default:
      return "outline"
  }
}

const formatTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return date.toLocaleDateString()
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true)
  const [providerData, setProviderData] = useState<IServiceProvider | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(mockNotifications)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await providerApi.getProfileData()
        setProviderData(response.provider)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Socket integration for real-time notifications
  useEffect(() => {
    const socket = getSocket()
    socket.on("service:available", (data) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: "New Emergency Order",
        message: data.message,
        type: "info",
        category: "order",
        isRead: false,
        createdAt: new Date().toISOString(),
      }
      setNotifications((prev) => [newNotification, ...prev])
    })

    return () => {
      socket.off("service:available")
    }
  }, [])

  // Filter notifications
  useEffect(() => {
    let filtered = notifications

    if (searchQuery) {
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.message.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter((notification) => notification.type === filterType)
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((notification) => notification.category === filterCategory)
    }

    if (showUnreadOnly) {
      filtered = filtered.filter((notification) => !notification.isRead)
    }

    setFilteredNotifications(filtered)
  }, [notifications, searchQuery, filterType, filterCategory, showUnreadOnly])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAsUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: false } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <ProviderSidebar providerData={providerData} />
      <SidebarInset>
        <div className="min-h-screen bg-slate-50">
          {/* Header with breadcrumb */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/provider">Provider</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Notifications</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <main className="flex flex-1 flex-col gap-4 p-4">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="h-8 w-8" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {unreadCount}
                    </Badge>
                  )}
                </h1>
                <p className="text-slate-500 mt-1">Stay updated with your latest activities</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                  className={showUnreadOnly ? "bg-blue-50 text-blue-600" : ""}
                >
                  {showUnreadOnly ? "Show All" : "Unread Only"}
                </Button>
                {unreadCount > 0 && (
                  <Button onClick={markAllAsRead} className="bg-blue-600 hover:bg-blue-700">
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="order">Orders</SelectItem>
                        <SelectItem value="payment">Payments</SelectItem>
                        <SelectItem value="appointment">Appointments</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No notifications found</h3>
                    <p className="text-slate-500">
                      {searchQuery || filterType !== "all" || filterCategory !== "all" || showUnreadOnly
                        ? "Try adjusting your filters to see more notifications."
                        : "You're all caught up! New notifications will appear here."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification, index) => {
                  const IconComponent = getNotificationIcon(notification.type, notification.category)
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card
                        className={`transition-all hover:shadow-md ${!notification.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3
                                      className={`font-medium ${!notification.isRead ? "text-slate-900" : "text-slate-700"}`}
                                    >
                                      {notification.title}
                                    </h3>
                                    <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                                      {notification.type}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {notification.category}
                                    </Badge>
                                    {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                  </div>
                                  <p className="text-slate-600 text-sm mb-2">{notification.message}</p>
                                  <p className="text-slate-400 text-xs">{formatTimeAgo(notification.createdAt)}</p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {notification.isRead ? (
                                      <DropdownMenuItem onClick={() => markAsUnread(notification.id)}>
                                        <Bell className="h-4 w-4 mr-2" />
                                        Mark as Unread
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                        <Check className="h-4 w-4 mr-2" />
                                        Mark as Read
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() => deleteNotification(notification.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              {notification.actionUrl && (
                                <div className="mt-3">
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={notification.actionUrl}>View Details</a>
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })
              )}
            </motion.div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
