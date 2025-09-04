"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Users, Car, Wrench, LogOut, Menu, X, Bell } from "lucide-react"
import {toast} from "react-toastify"
import { useRouter } from "next/navigation";
import createAuthApi from "@/services/authApi"
import { axiosPrivate } from "@/api/axios"
const authApi = createAuthApi(axiosPrivate);

const DashboardSidebar = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
const adminLogout = async () => {
    try {
       await authApi.adminLogoutApi();   
        toast.success("Logged out successfully.");
        router.push("/admin");       
    } catch (error) {
      toast.error("Error logging out.");
    }
  };
  const isActive = (path: string) => pathname === path

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200" // Enhanced mobile toggle button styling
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition duration-300 ease-in-out z-30 w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-xl`} // Enhanced sidebar background with gradient and shadow
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-8 border-b border-gray-200 bg-white">
            {" "}
            {/* Increased padding and added white background */}
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {" "}
              {/* Larger font size and darker color */}
              VehicleService Pro
            </h1>
            <p className="text-sm text-gray-600 font-medium">Admin Dashboard</p>{" "}
            {/* Slightly darker and added font-medium */}
          </div>

          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {" "}
            {/* Adjusted padding and spacing */}
            <Link
              href="/admin/dashboard"
              className={`group flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isActive("/admin/dashboard")
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]" // Enhanced active state with gradient, shadow, and scale
                  : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-md hover:scale-[1.01] hover:border-gray-200 border border-transparent" // Enhanced hover state
              }`}
            >
              <Calendar
                className={`mr-3 h-5 w-5 ${isActive("/admin/dashboard") ? "text-white" : "text-gray-500 group-hover:text-blue-500"}`}
              />{" "}
              {/* Dynamic icon colors */}
              Dashboard
            </Link>
            <Link
              href="/admin/dashboard/notifications"
              className={`group flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isActive("/admin/dashboard/notifications")
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
                  : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-md hover:scale-[1.01] hover:border-gray-200 border border-transparent"
              }`}
            >
              <div className="relative mr-3">
                <Bell
                  className={`h-5 w-5 ${isActive("/admin/dashboard/notifications") ? "text-white" : "text-gray-500 group-hover:text-blue-500"}`}
                />
                <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  3
                </span>
              </div>
              Notifications
            </Link>
            <Link
              href="/admin/dashboard/customer-management"
              className={`group flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isActive("/admin/dashboard/customer-management")
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
                  : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-md hover:scale-[1.01] hover:border-gray-200 border border-transparent"
              }`}
            >
              <Users
                className={`mr-3 h-5 w-5 ${isActive("/admin/dashboard/customer-management") ? "text-white" : "text-gray-500 group-hover:text-blue-500"}`}
              />
              Customers
            </Link>
            <Link
              href="/admin/dashboard/provider-management"
              className={`group flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isActive("/admin/dashboard/provider-management")
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
                  : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-md hover:scale-[1.01] hover:border-gray-200 border border-transparent"
              }`}
            >
              <Users
                className={`mr-3 h-5 w-5 ${isActive("/admin/dashboard/provider-management") ? "text-white" : "text-gray-500 group-hover:text-blue-500"}`}
              />
              Provider Management
            </Link>
            <Link
              href="/admin/dashboard/make&model-management"
              className={`group flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isActive("/admin/dashboard/make&model-management")
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
                  : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-md hover:scale-[1.01] hover:border-gray-200 border border-transparent"
              }`}
            >
              <Car
                className={`mr-3 h-5 w-5 ${isActive("/admin/dashboard/make&model-management") ? "text-white" : "text-gray-500 group-hover:text-blue-500"}`}
              />
              Make&Model Management
            </Link>
            <Link
              href="/admin/dashboard/service-plan-management"
              className={`group flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isActive("/admin/dashboard/service-plan-management")
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
                  : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-md hover:scale-[1.01] hover:border-gray-200 border border-transparent"
              }`}
            >
              <Wrench
                className={`mr-3 h-5 w-5 ${isActive("/admin/dashboard/service-plan-management") ? "text-white" : "text-gray-500 group-hover:text-blue-500"}`}
              />
              Service Plan Management
            </Link>
            <Link
              href="/admin/dashboard/booking-history"
              className={`group flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isActive("/admin/dashboard/booking-history")
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
                  : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-md hover:scale-[1.01] hover:border-gray-200 border border-transparent"
              }`}
            >
              <Calendar
                className={`mr-3 h-5 w-5 ${isActive("/admin/dashboard/booking-history") ? "text-white" : "text-gray-500 group-hover:text-blue-500"}`}
              />
              Booking History
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-200 bg-white">
            {" "}
            {/* Added white background to footer */}
            <button
              onClick={adminLogout}
              className="group flex items-center px-4 py-3 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 w-full rounded-xl transition-all duration-200 border border-transparent hover:border-red-200" // Enhanced logout button styling
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500 group-hover:text-red-500" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardSidebar
