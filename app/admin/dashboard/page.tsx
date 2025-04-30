"use client"

import React, { useState, useEffect } from 'react';
import { Calendar, BarChart, ChevronDown, Settings, Users, Wrench, Clock, Car, DollarSign, Bell, Menu, X, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
import createAuthApi from '@/services/authApi';
import { axiosPrivate } from '@/api/axios';
import createAdminApi from '@/services/adminApi';
import DashboardSidebar from '../../../components/admin/DashboardSidebar';

// Import shadcn components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const authApi = createAuthApi(axiosPrivate);
const adminApi = createAdminApi(axiosPrivate);

// Define TypeScript interfaces
interface StatItem {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  color: string;
  bgColor: string;
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
  isListed: boolean;
};

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsersApi();
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }

  const toggleListing = async (email: string) => {
    try {
      const response = await adminApi.toggleListing(email);
      const updatedUser = response?.data.user;
      
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.email === email) {
            return { ...user, isListed: updatedUser.isListed };
          }
          return user;
        })
      );
    } catch (error) {
      console.log('Toggle listing status failed', error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Sample data for dashboard widgets
  const stats: StatItem[] = [
    { 
      title: 'Total Appointments', 
      value: '124', 
      icon: <Calendar size={20} />, 
      change: '+12%', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100'
    },
    { 
      title: 'Pending Services', 
      value: '28', 
      icon: <Clock size={20} />, 
      change: '-3%', 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-100'
    },
    { 
      title: 'Completed Today', 
      value: '16', 
      icon: <Wrench size={20} />, 
      change: '+5%', 
      color: 'text-green-600', 
      bgColor: 'bg-green-100'
    },
    { 
      title: 'Revenue (Month)', 
      value: '$14,385', 
      icon: <DollarSign size={20} />, 
      change: '+18%', 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-100'
    },
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
  
  // Status badge variants
  const getStatusBadgeVariant = (status: Appointment['status']): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
    switch(status) {
      case 'Completed': return "success";
      case 'In Progress': return "default";
      case 'Scheduled': return "secondary";
      case 'Waiting': return "warning";
      default: return "outline";
    }
  };

  // Custom Badge component with shadcn styling but custom colors
  const StatusBadge = ({ status }: { status: Appointment['status'] }) => {
    let className = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ";
    
    switch(status) {
      case 'Completed':
        className += "bg-green-100 text-green-800";
        break;
      case 'In Progress':
        className += "bg-blue-100 text-blue-800";
        break;
      case 'Scheduled':
        className += "bg-slate-100 text-slate-800";
        break;
      case 'Waiting':
        className += "bg-amber-100 text-amber-800";
        break;
      default:
        className += "bg-gray-100 text-gray-800";
    }
    
    return <span className={className}>{status}</span>;
  };

  return (
    <div className="flex h-screen bg-slate-50">
     
      
      {/* Main content */}
      <div className="flex-1 md:ml-64 transition-all duration-200 ease-in-out overflow-y-auto">
        {/* Top header */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Dashboard Overview</h2>
              <p className="text-sm text-slate-500">Welcome back, Admin</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Bell size={18} className="text-slate-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/api/placeholder/32/32" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium">Admin User</span>
                    <ChevronDown size={16} className="text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Dashboard content */}
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Stats cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                      <p className="text-2xl font-semibold text-slate-800 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">from last week</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Tabs for main dashboard sections */}
          <Tabs defaultValue="appointments" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments" className="space-y-6">
              {/* Main content grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Appointments table */}
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Today's Appointments</CardTitle>
                      <CardDescription>Manage your scheduled services</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Vehicle</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentAppointments.map((appointment, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{appointment.id}</TableCell>
                            <TableCell>{appointment.customer}</TableCell>
                            <TableCell>{appointment.vehicle}</TableCell>
                            <TableCell>{appointment.service}</TableCell>
                            <TableCell>{appointment.time}</TableCell>
                            <TableCell>
                              <StatusBadge status={appointment.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-center border-t pt-4">
                    <Button variant="ghost" size="sm">Load more</Button>
                  </CardFooter>
                </Card>
                
                {/* Right column */}
                <div className="space-y-6">
                  {/* Upcoming services */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Services</CardTitle>
                      <CardDescription>Service distribution for this week</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {upcomingServices.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">{item.service}</span>
                            <span className="text-sm font-medium text-slate-700">{item.count}</span>
                          </div>
                          <Progress value={(item.count / 12) * 100} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  {/* Quick actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Frequently used functions</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        New Appointment
                      </Button>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Add Customer
                      </Button>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Create Invoice
                      </Button>
                      <Button className="w-full bg-amber-600 hover:bg-amber-700">
                        Service Report
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Calendar preview */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle>Calendar</CardTitle>
                      <Button variant="ghost" size="sm">
                        Full View
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <Button variant="outline" size="icon">
                          <ChevronLeft size={16} />
                        </Button>
                        <h4 className="text-sm font-medium text-slate-800">March 2025</h4>
                        <Button variant="outline" size="icon">
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
                          <div key={i} className="text-xs font-medium text-slate-500 py-1">{day}</div>
                        ))}
                        
                        {/* Sample calendar days */}
                        {[...Array(31)].map((_, i) => {
                          const day = i + 1;
                          const isToday = day === 18; // Today is March 18
                          const hasAppointments = [3, 7, 12, 18, 22, 25, 28].includes(day);
                          
                          return (
                            <Button
                              key={i}
                              variant={isToday ? "default" : hasAppointments ? "outline" : "ghost"}
                              className={`h-8 w-8 p-0 ${
                                isToday 
                                  ? 'bg-blue-600 hover:bg-blue-700' 
                                  : hasAppointments 
                                    ? 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100'
                                    : ''
                              }`}
                            >
                              {day}
                            </Button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage system users and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-6">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                        <div className="flex-1 space-y-4 py-1">
                          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-slate-200 rounded"></div>
                            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                            <Badge variant={user.isListed ? "default" : "destructive"}>
  {user.isListed ? "Active" : "Blocked"}
</Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant={user.isListed ? "destructive" : "outline"}
                                size="sm"
                                onClick={() => toggleListing(user.email)}
                              >
                                {user.isListed ? "Block" : "Unblock"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>Track performance metrics and insights</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-16">
                  <div className="text-center">
                    <BarChart className="mx-auto h-16 w-16 text-slate-400" />
                    <h3 className="mt-4 text-lg font-medium">Analytics Module</h3>
                    <p className="mt-2 text-sm text-slate-500">Analytics features coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Separator className="my-6" />
          
          <div className="mb-6">
            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertTitle>Monthly Revenue Update</AlertTitle>
              <AlertDescription>
                Revenue has increased by 18% compared to last month. View the detailed finance report.
              </AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;