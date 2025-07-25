"use client"

import { useState, useEffect } from "react"
import { IServiceProvider } from "@/types/provider"
import { motion } from "framer-motion"
import { axiosPrivate } from "@/api/axios"
import createProviderApi from "@/services/providerApi"
import Navbar from "@/components/provider/Navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Bell,
} from "lucide-react"
import { getSocket } from "../../../lib/socket";
import {NotificationListener} from "../../../components/provider/NotificationListner";

const providerApi = createProviderApi(axiosPrivate)
export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [providerData, setProviderData] = useState<IServiceProvider | null>(null)
  const [notifications, setNotifications] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await providerApi.getProfileData()
        console.log('the provider data from the provider page',providerData);
        setProviderData(response.provider)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setLoading(false)
      }
    }
      fetchData();
  }, []);
useEffect(() => {
  console.log('provider data',providerData);
},[providerData])

useEffect(() => {
  const socket = getSocket();
  socket.on("service:available", (data) => {
    setNotifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "New Emergency Order",
        message: data.message,
        type: "info",
        time: new Date().toLocaleString(),
      },
    ]);
  });

  return () => {
    socket.off("service:available");
  };
}, []);
  
useEffect(() => {
  console.log('the notifciacations',notifications)
},[notifications])
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
{providerData && providerData.location && (
  <NotificationListener
    providerId={providerData._id}
    providerLocation={{
      lat: providerData.location.coordinates[1], 
      lng: providerData.location.coordinates[0],
    }}
  />
)}
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


            {/* Appointments Table */}

          </motion.div>

          {/* Right Column - 1/3 width */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Service Type Distribution */}


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
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{notification}</p>
                        {/* <p className="text-xs text-slate-500">{notification.message}</p>
                        <p className="text-xs text-slate-400">{notification.time}</p> */}
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
          </motion.div>
        </div>
      </main>

      {/* <footer className="p-4 text-center bg-slate-900 text-white mt-8">
        <p>© 2025 Car Service Provider. All Rights Reserved.</p>
      </footer> */}
    </div>
  )
}
