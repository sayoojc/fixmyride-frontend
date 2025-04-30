"use client"

import { useState, useEffect } from "react"
import { IServiceProvider } from "@/types/provider"
import { motion } from "framer-motion"
import { axiosPrivate } from "@/api/axios"
import createProviderApi from "@/services/providerApi"
import Navbar from "@/components/provider/Navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import {
  Calendar,
  Car,
  DollarSign,
  Users,
  Bell,
  Settings,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Filter,
} from "lucide-react"

const providerApi = createProviderApi(axiosPrivate)

// Animation variants
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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
}

// Mock data
const revenueData = [
  { month: "Jan", revenue: 4500, target: 4000 },
  { month: "Feb", revenue: 5200, target: 4500 },
  { month: "Mar", revenue: 4800, target: 5000 },
  { month: "Apr", revenue: 6000, target: 5500 },
  { month: "May", revenue: 5700, target: 6000 },
  { month: "Jun", revenue: 6500, target: 6000 },
  { month: "Jul", revenue: 7000, target: 6500 },
]

const serviceTypeData = [
  { name: "Oil Change", value: 35 },
  { name: "Brake Service", value: 20 },
  { name: "Tire Rotation", value: 15 },
  { name: "Engine Repair", value: 10 },
  { name: "Diagnostics", value: 12 },
  { name: "Other", value: 8 },
]

const recentAppointments = [
  {
    id: "APT-1234",
    customer: "John Smith",
    vehicle: "2019 Toyota Camry",
    service: "Oil Change & Inspection",
    date: "2025-04-28",
    time: "10:00 AM",
    status: "completed",
  },
  {
    id: "APT-1235",
    customer: "Sarah Johnson",
    vehicle: "2021 Honda Civic",
    service: "Brake Pad Replacement",
    date: "2025-04-28",
    time: "2:30 PM",
    status: "in-progress",
  },
  {
    id: "APT-1236",
    customer: "Michael Brown",
    vehicle: "2018 Ford F-150",
    service: "Transmission Service",
    date: "2025-04-29",
    time: "9:15 AM",
    status: "scheduled",
  },
  {
    id: "APT-1237",
    customer: "Emily Davis",
    vehicle: "2022 Tesla Model 3",
    service: "Battery Inspection",
    date: "2025-04-29",
    time: "11:45 AM",
    status: "scheduled",
  },
  {
    id: "APT-1238",
    customer: "Robert Wilson",
    vehicle: "2020 BMW X5",
    service: "Full Service & Detailing",
    date: "2025-04-30",
    time: "1:00 PM",
    status: "scheduled",
  },
]

const notifications = [
  {
    id: 1,
    title: "New appointment request",
    message: "Jessica Lee requested an appointment for tomorrow at 3:00 PM",
    time: "10 minutes ago",
    type: "info",
  },
  {
    id: 2,
    title: "Service completed",
    message: "Oil change for Toyota Camry (John Smith) has been completed",
    time: "1 hour ago",
    type: "success",
  },
  {
    id: 3,
    title: "Inventory alert",
    message: "Low stock on brake pads (Honda models). Please reorder.",
    time: "3 hours ago",
    type: "warning",
  },
  {
    id: 4,
    title: "Customer feedback",
    message: "New 5-star review from Michael Brown",
    time: "1 day ago",
    type: "success",
  },
]

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState("week")
  const [loading, setLoading] = useState(true)
  const [providerData, setProviderData] = useState<IServiceProvider | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await providerApi.getProfileData()
        setProviderData(response.provider)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setLoading(false)
      }
    }
      fetchData();
  }, []);

  // Stats data
  const stats = [
    {
      title: "Total Appointments",
      value: "128",
      change: "+12%",
      trend: "up",
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Vehicles Serviced",
      value: "87",
      change: "+8%",
      trend: "up",
      icon: <Car className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Revenue",
      value: "$24,500",
      change: "+15%",
      trend: "up",
      icon: <DollarSign className="h-5 w-5 text-emerald-500" />,
    },
    {
      title: "New Customers",
      value: "32",
      change: "-3%",
      trend: "down",
      icon: <Users className="h-5 w-5 text-purple-500" />,
    },
  ]

  const getStatusColor = (status:string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "scheduled":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status:string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
      case "scheduled":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Scheduled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getNotificationIcon = (type:string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Bell className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-500 mt-1">Welcome back, {providerData?.name || "Service Provider"}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                <span className="relative">
                  Notifications
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                </span>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full p-2 bg-slate-100">{stat.icon}</div>
                    <div className="flex items-center">
                      <span
                        className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
                      >
                        {stat.change}
                      </span>
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500 ml-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500 ml-1" />
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Revenue Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue and targets</CardDescription>
                </div>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "hsl(var(--chart-1))",
                      },
                      target: {
                        label: "Target",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tickMargin={10}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="var(--color-revenue)"
                          strokeWidth={2}
                          dot={{ fill: "var(--color-revenue)", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="target"
                          stroke="var(--color-target)"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: "var(--color-target)", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Appointments Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Recent Appointments</CardTitle>
                  <CardDescription>Latest service appointments and their status</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden md:table-cell">Vehicle</TableHead>
                      <TableHead className="hidden md:table-cell">Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.id}</TableCell>
                        <TableCell>{appointment.customer}</TableCell>
                        <TableCell className="hidden md:table-cell">{appointment.vehicle}</TableCell>
                        <TableCell className="hidden md:table-cell">{appointment.service}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                            <span className="text-xs text-slate-500">{appointment.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-center mt-4">
                  <Button variant="outline" className="w-full">
                    View All Appointments
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - 1/3 width */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Service Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Service Distribution</CardTitle>
                <CardDescription>Breakdown of service types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceTypeData.map((service, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{service.name}</span>
                        <span className="text-sm text-slate-500">{service.value}%</span>
                      </div>
                      <Progress value={service.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Latest updates and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-slate-500">{notification.message}</p>
                        <p className="text-xs text-slate-400">{notification.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <Calendar className="h-5 w-5 mb-2" />
                    <span className="text-xs">Schedule</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <FileText className="h-5 w-5 mb-2" />
                    <span className="text-xs">Invoices</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <Users className="h-5 w-5 mb-2" />
                    <span className="text-xs">Customers</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <Settings className="h-5 w-5 mb-2" />
                    <span className="text-xs">Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <footer className="p-4 text-center bg-slate-900 text-white mt-8">
        <p>© 2025 Car Service Provider. All Rights Reserved.</p>
      </footer>
    </div>
  )
}
