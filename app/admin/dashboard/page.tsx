"use client"

import React, { useState,useEffect } from 'react';
import { Calendar, BarChart, ChevronDown, Settings, Users, Wrench, Clock, Car, DollarSign, Bell, Menu, X, LogOut } from 'lucide-react';
import createAuthApi from '@/services/authApi';
import { axiosPrivate } from '@/api/axios';
import DashboardSidebar from '../../../components/admin/DashboardSidebar'

const authApi = createAuthApi(axiosPrivate);

// Define TypeScript interfaces
interface StatItem {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  color: string;
}

interface Appointment {
  id: string;
  customer: string;
  vehicle: string;
  service: string;
  time: string;
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Waiting';
}

interface ServiceItem {
  service: string;
  count: number;
}
type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isListed:boolean;
};


const AdminDashboard: React.FC = () => {
  const fetchUsers = async () => {
    try {
      const response = await authApi.getUsersApi();
      console.log(response.data.users)
      setUsers(response.data.users);
   
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  const toggleListing = async (email:string) => {
    try {
       const response = await authApi.toggleListing(email);
       const updatedUser = response?.data.user;
       console.log("🚀 Updated user from API:", updatedUser);
       console.log("👥 Previous users:", users);
       setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.email === email) {
            return { ...user, isListed: updatedUser.isListed };
          }
          return user;
        })
      );
    } catch (error) {
      console.log('Toggle listing status is failed',error);
    }
  }
    const [users,setUsers] = useState<User[]>([]);

  useEffect(() => {

  fetchUsers();
 
   },[]);
  
  // Sample data for dashboard widgets
  const stats: StatItem[] = [
    { title: 'Total Appointments', value: '124', icon: <Calendar size={20} />, change: '+12%', color: 'bg-blue-100 text-blue-600' },
    { title: 'Pending Services', value: '28', icon: <Clock size={20} />, change: '-3%', color: 'bg-orange-100 text-orange-600' },
    { title: 'Completed Today', value: '16', icon: <Wrench size={20} />, change: '+5%', color: 'bg-green-100 text-green-600' },
    { title: 'Revenue (Month)', value: '$14,385', icon: <DollarSign size={20} />, change: '+18%', color: 'bg-purple-100 text-purple-600' },
  ];
  
  const recentAppointments: Appointment[] = [
    { id: 'APT-5623', customer: 'John Smith', vehicle: 'Toyota Camry 2020', service: 'Oil Change + Inspection', time: '09:30 AM', status: 'In Progress' },
    { id: 'APT-5622', customer: 'Sarah Johnson', vehicle: 'Honda Civic 2022', service: 'Brake Replacement', time: '11:00 AM', status: 'Scheduled' },
    { id: 'APT-5621', customer: 'Michael Brown', vehicle: 'Ford F-150 2019', service: 'Full Service', time: '01:15 PM', status: 'Completed' },
    { id: 'APT-5620', customer: 'Emily Davis', vehicle: 'Tesla Model 3', service: 'Tire Rotation', time: '03:30 PM', status: 'Scheduled' },
    { id: 'APT-5619', customer: 'Robert Wilson', vehicle: 'BMW X5 2021', service: 'AC Repair', time: '10:45 AM', status: 'Waiting' },
  ];
  
  const upcomingServices: ServiceItem[] = [
    { service: 'Oil Change', count: 12 },
    { service: 'Brake Service', count: 8 },
    { service: 'Tire Replacement', count: 6 },
    { service: 'Engine Diagnostics', count: 5 },
    { service: 'AC Service', count: 4 },
    { service: 'Other', count: 9 },
  ];
  
  // Status color mapping
  const getStatusColor = (status: Appointment['status']): string => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-600';
      case 'In Progress': return 'bg-blue-100 text-blue-600';
      case 'Scheduled': return 'bg-gray-100 text-gray-600';
      case 'Waiting': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
     <DashboardSidebar/>
      
      {/* Main content */}
      <div className={`flex-1 md:ml-64 transition-all duration-200 ease-in-out`}>
        {/* Top header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
              <p className="text-sm text-gray-500">Welcome back, Admin</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 bg-gray-100 rounded-full hover:text-gray-500 focus:outline-none">
                <Bell size={20} />
              </button>
              <div className="flex items-center">
                <img 
                  className="w-8 h-8 rounded-full" 
                  src="/api/placeholder/32/32" 
                  alt="Admin profile" 
                />
                <button className="ml-2 flex items-center text-sm text-gray-700 focus:outline-none">
                  <span className="hidden md:block">Admin User</span>
                  <ChevronDown size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Dashboard content */}
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Stats cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-800 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">from last week</span>
                </div>
              </div>
            ))}
          </div>


          
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
  <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Users</h3>
  <ul className="divide-y divide-gray-100">
    {users.map((user) => (
       

      <li key={user._id} className="py-2">
        <p className="text-sm font-semibold text-gray-700">{user.name}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
        <button
      onClick={() =>toggleListing(user.email)}
      className={`px-4 py-2 rounded text-white font-medium transition duration-200
        ${user.isListed ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
    >
      {user.isListed ? 'Block' : 'Unblock'}
    </button>
      </li>
    ))}
  </ul>
</div>
          
          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointments list */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">Today's Appointments</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentAppointments.map((appointment,index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{appointment.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{appointment.customer}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{appointment.vehicle}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{appointment.service}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{appointment.time}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-gray-100 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800">Load more</button>
              </div>
            </div>
            
            {/* Right column */}
            <div className="space-y-6">
              {/* Upcoming services */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800">Upcoming Services</h3>
                </div>
                <div className="p-4">
                  {upcomingServices.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">{item.service}</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-800">{item.count}</span>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(item.count / 12) * 100}%` }} 
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800">Quick Actions</h3>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  <button className="p-3 text-sm text-center text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                    New Appointment
                  </button>
                  <button className="p-3 text-sm text-center text-green-600 bg-green-50 rounded-lg hover:bg-green-100">
                    Add Customer
                  </button>
                  <button className="p-3 text-sm text-center text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100">
                    Create Invoice
                  </button>
                  <button className="p-3 text-sm text-center text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100">
                    Service Report
                  </button>
                </div>
              </div>
              
              {/* Calendar preview */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">Calendar</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800">Full View</button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <ChevronDown className="transform rotate-90" size={20} />
                    </button>
                    <h4 className="text-sm font-medium text-gray-800">March 2025</h4>
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <ChevronDown className="transform -rotate-90" size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
                      <div key={i} className="text-xs font-medium text-gray-500 py-1">{day}</div>
                    ))}
                    
                    {/* Sample calendar days */}
                    {[...Array(31)].map((_, i) => {
                      const day = i + 1;
                      const isToday = day === 18; // Today is March 18
                      const hasAppointments = [3, 7, 12, 18, 22, 25, 28].includes(day);
                      
                      return (
                        <div 
                          key={i} 
                          className={`text-xs p-2 rounded-full ${
                            isToday 
                              ? 'bg-blue-600 text-white' 
                              : hasAppointments 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'hover:bg-gray-100'
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>


        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;