"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { axiosPrivate } from "@/api/axios";
import createProviderApi from "@/services/providerApi";
import type { IServiceProvider } from "@/types/provider";
import { ProviderSidebar } from "@/components/provider/ProviderSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Wrench, AlertTriangle, CheckCircle, XCircle, Save, RotateCcw, Zap } from 'lucide-react';
import { toast } from "react-toastify";

// Types for vehicle service slot management
interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  displayTime: string;
}

interface WeeklySlot {
  date: string;
  dayName: string;
  slots: {
    [slotId: string]: {
      isAvailable: boolean;
      isBooked: boolean;
      bookingDetails?: {
        clientName: string;
        serviceType: string;
        vehicleInfo: string;
      };
    };
  };
}

const providerApi = createProviderApi(axiosPrivate);

// Define the specific time slots
const TIME_SLOTS: TimeSlot[] = [
  { id: "slot1", startTime: "10:00", endTime: "11:00", displayTime: "10:00 - 11:00" },
  { id: "slot2", startTime: "11:00", endTime: "12:00", displayTime: "11:00 - 12:00" },
  { id: "slot3", startTime: "12:00", endTime: "13:00", displayTime: "12:00 - 01:00" },
  { id: "slot4", startTime: "13:00", endTime: "14:00", displayTime: "01:00 - 02:00" },
  { id: "slot5", startTime: "14:00", endTime: "15:00", displayTime: "02:00 - 03:00" },
  { id: "slot6", startTime: "15:00", endTime: "16:00", displayTime: "03:00 - 04:00" },
  { id: "slot7", startTime: "16:00", endTime: "17:00", displayTime: "04:00 - 05:00" },
];

// Generate upcoming week dates
const generateUpcomingWeek = (): WeeklySlot[] => {
  const week: WeeklySlot[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateString = date.toISOString().split('T')[0];
    
    const slots: { [slotId: string]: any } = {};
    TIME_SLOTS.forEach(slot => {
      slots[slot.id] = {
        isAvailable: false,
        isBooked: Math.random() < 0.2, // 20% chance of being booked (mock data)
        bookingDetails: Math.random() < 0.2 ? {
          clientName: "John Doe",
          serviceType: "Oil Change",
          vehicleInfo: "Toyota Camry 2020"
        } : undefined
      };
    });
    
    week.push({
      date: dateString,
      dayName,
      slots
    });
  }
  
  return week;
};

export default function VehicleServiceSlotManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [providerData, setProviderData] = useState<IServiceProvider | null>(null);
  const [weeklySlots, setWeeklySlots] = useState<WeeklySlot[]>([]);
  const [rsaEnabled, setRsaEnabled] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [stats, setStats] = useState({
    totalAvailable: 0,
    totalBooked: 0,
    totalSlots: TIME_SLOTS.length * 7
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await providerApi.getProfileData();
        setProviderData(response.provider);
        
        // Initialize weekly slots
        const initialWeeklySlots = generateUpcomingWeek();
        setWeeklySlots(initialWeeklySlots);
        
        // Calculate initial stats
        calculateStats(initialWeeklySlots);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateStats = (slots: WeeklySlot[]) => {
    let available = 0;
    let booked = 0;
    
    slots.forEach(day => {
      Object.values(day.slots).forEach(slot => {
        if (slot.isBooked) booked++;
        else if (slot.isAvailable) available++;
      });
    });
    
    setStats({
      totalAvailable: available,
      totalBooked: booked,
      totalSlots: TIME_SLOTS.length * 7
    });
  };

  const toggleSlotAvailability = (dateIndex: number, slotId: string) => {
    const updatedSlots = [...weeklySlots];
    const slot = updatedSlots[dateIndex].slots[slotId];
    
    // Don't allow toggling if slot is booked
    if (slot.isBooked) {
      toast.error("Cannot modify booked slots");
      return;
    }
    
    slot.isAvailable = !slot.isAvailable;
    setWeeklySlots(updatedSlots);
    setHasChanges(true);
    calculateStats(updatedSlots);
  };

  const toggleRSA = () => {
    setRsaEnabled(!rsaEnabled);
    setHasChanges(true);
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      // Mock API call to save changes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make actual API calls to save the slot availability and RSA status
      // await providerApi.updateSlotAvailability(weeklySlots);
      // await providerApi.updateRSAStatus(rsaEnabled);
      
      setHasChanges(false);
      setSaving(false);
      toast.success("Slot availability updated successfully!");
    } catch (error) {
      setSaving(false);
      toast.error("Failed to save changes");
    }
  };

  const resetChanges = () => {
    const initialWeeklySlots = generateUpcomingWeek();
    setWeeklySlots(initialWeeklySlots);
    setRsaEnabled(false);
    setHasChanges(false);
    calculateStats(initialWeeklySlots);
    toast.info("Changes reset");
  };

  const getSlotStatusColor = (slot: any) => {
    if (slot.isBooked) return "bg-red-100 border-red-300 text-red-800";
    if (slot.isAvailable) return "bg-green-100 border-green-300 text-green-800";
    return "bg-gray-100 border-gray-300 text-gray-600";
  };

  const getSlotIcon = (slot: any) => {
    if (slot.isBooked) return XCircle;
    if (slot.isAvailable) return CheckCircle;
    return Clock;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading slot management...</p>
        </div>
      </div>
    );
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
                  <BreadcrumbPage>Slot Management</BreadcrumbPage>
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
                  <Wrench className="h-8 w-8" />
                  Vehicle Service Slots
                </h1>
                <p className="text-slate-500 mt-1">
                  Manage your weekly availability for vehicle services
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Available: {stats.totalAvailable}
                  </Badge>
                  <Badge variant="destructive" className="bg-red-100 text-red-800">
                    Booked: {stats.totalBooked}
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    Total: {stats.totalSlots}
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Emergency RSA Toggle */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className={`border-2 ${rsaEnabled ? 'border-orange-300 bg-orange-50' : 'border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${rsaEnabled ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Emergency Roadside Assistance (RSA)</h3>
                        <p className="text-sm text-slate-600">
                          {rsaEnabled 
                            ? "You are currently available for emergency services" 
                            : "Enable to accept emergency roadside assistance calls"
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {rsaEnabled && <Zap className="h-5 w-5 text-orange-500" />}
                      <Switch
                        checked={rsaEnabled}
                        onCheckedChange={toggleRSA}
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Slot Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Weekly Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                      {/* Header Row */}
                      <div className="grid grid-cols-8 gap-2 mb-4">
                        <div className="font-semibold text-slate-700 p-2">Time Slots</div>
                        {weeklySlots.map((day, index) => (
                          <div key={index} className="text-center">
                            <div className="font-semibold text-slate-900">{day.dayName}</div>
                            <div className="text-sm text-slate-600">
                              {new Date(day.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Time Slot Rows */}
                      {TIME_SLOTS.map((timeSlot) => (
                        <div key={timeSlot.id} className="grid grid-cols-8 gap-2 mb-2">
                          <div className="flex items-center p-2 font-medium text-slate-700 bg-slate-50 rounded">
                            <Clock className="h-4 w-4 mr-2" />
                            {timeSlot.displayTime}
                          </div>
                          {weeklySlots.map((day, dayIndex) => {
                            const slot = day.slots[timeSlot.id];
                            const IconComponent = getSlotIcon(slot);
                            
                            return (
                              <motion.div
                                key={`${dayIndex}-${timeSlot.id}`}
                                whileHover={{ scale: slot.isBooked ? 1 : 1.02 }}
                                whileTap={{ scale: slot.isBooked ? 1 : 0.98 }}
                              >
                                <Button
                                  variant="outline"
                                  className={`w-full h-16 p-2 border-2 transition-all ${getSlotStatusColor(slot)} ${
                                    slot.isBooked 
                                      ? 'cursor-not-allowed opacity-75' 
                                      : 'cursor-pointer hover:shadow-md'
                                  }`}
                                  onClick={() => !slot.isBooked && toggleSlotAvailability(dayIndex, timeSlot.id)}
                                  disabled={slot.isBooked}
                                >
                                  <div className="flex flex-col items-center gap-1">
                                    <IconComponent className="h-4 w-4" />
                                    <span className="text-xs font-medium">
                                      {slot.isBooked 
                                        ? 'Booked' 
                                        : slot.isAvailable 
                                          ? 'Available' 
                                          : 'Unavailable'
                                      }
                                    </span>
                                    {slot.isBooked && slot.bookingDetails && (
                                      <span className="text-xs opacity-75 truncate w-full">
                                        {slot.bookingDetails.serviceType}
                                      </span>
                                    )}
                                  </div>
                                </Button>
                              </motion.div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">Legend</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
                      <span className="text-sm text-slate-700">Available for booking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
                      <span className="text-sm text-slate-700">Already booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
                      <span className="text-sm text-slate-700">Unavailable</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-end gap-3 sticky bottom-4"
              >
                <Button
                  variant="outline"
                  onClick={resetChanges}
                  disabled={saving}
                  className="bg-white"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Changes
                </Button>
                <Button
                  onClick={saveChanges}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
