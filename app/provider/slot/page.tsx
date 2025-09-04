"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Wrench,
  Save,
  RotateCcw,
  Zap,
  ChevronLeft,
  ChevronRight,
  Users,
  Edit3,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { SERVICE_TYPES } from "../../../constants/serviceTypes";
import { DaySchedule } from "@/types/serviceTypes";
import { HourStatus } from "@/types/serviceTypes";
import {toast} from "react-toastify" 
import createProviderApi from "@/services/providerApi";
import { axiosPrivate } from "@/api/axios";
import { set } from "date-fns";
const providerApi = createProviderApi(axiosPrivate);
interface ServiceAvailability {
  [serviceId: string]: boolean;
}

export default function SlotManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    return new Date();
  });
  const [weekSchedules, setWeekSchedules] = useState<DaySchedule[]>([]);
  const [changedSchedules, setChangedSchedules] = useState<DaySchedule[]>([]);
  const [serviceAvailability, setServiceAvailability] =
    useState<ServiceAvailability>({});
  const [stats, setStats] = useState({
    totalAvailable: 0,
    totalHours: 168,
  });
  const initializeWeekSchedules = useCallback(
    (weekStart: Date, existingSchedules: DaySchedule[]) => {
      const schedules: DaySchedule[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const dateString = date.toISOString().split("T")[0];
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        const existing = existingSchedules.find((s) => s.date === dateString);
        if (existing) {
          const hours: { [hour: number]: HourStatus } = {};
          for (let hour = 0; hour < 24; hour++) {
            hours[hour] = existing.hours?.[hour] ?? "unavailable";
          }
          schedules.push({
            date: dateString,
            dayName,
            employees: existing.employees ?? 1,
            hours,
          });
        } else {
          const hours: { [hour: number]: HourStatus } = {};
          for (let hour = 0; hour < 24; hour++) {
            hours[hour] = "unavailable";
          }
          schedules.push({
            date: dateString,
            dayName,
            employees: 1,
            hours,
          });
        }
      }

      setWeekSchedules(schedules);
    },
    []
  );
 useEffect(() => {
  console.log("Changed schedules:", changedSchedules);
 },[changedSchedules ]);
  const handleUpdateSchedule = async () => {
    try {
      setSaving(true);
      const response = await providerApi.updateSlots(changedSchedules);
      console.log('the handle update schedule response ', response);
     setWeekSchedules((prev) => {
        return prev.map((day) => {
          const updated = changedSchedules.find((d) => d.date === day.date);
          return updated ? updated : day;
        });
     });
      toast.success("Schedule updated successfully");
      setChangedSchedules([]);
      setHasChanges(false);
      console.log("Schedule updated successfully!");
    } catch (error) {
      console.error("Failed to update schedule", error);
    } finally {
      setSaving(false);
    }
  };

useEffect(() => {
  const fetchWeekSchedules = async () => {
    setLoading(true);
    try {
      const response = await providerApi.getSlots();
      const normalizedSlots = response.slots.map((slot: any) => ({
        ...slot,
        date: new Date(slot.date).toISOString().split("T")[0],
      }));
      console.log("Fetched slots:", normalizedSlots);
      initializeWeekSchedules(currentWeekStart, normalizedSlots);
    } catch (error) {
      console.error("Failed to fetch week schedules:", error);
    }
    setLoading(false);
  };
  fetchWeekSchedules();
}, []);

  useEffect(() => {
    const initializeData = () => {
      setLoading(true);
      const initialServiceAvailability: ServiceAvailability = {};
      SERVICE_TYPES.forEach((service) => {
        initialServiceAvailability[service.id] = false;
      });
      setServiceAvailability(initialServiceAvailability);
      setLoading(false);
    };

    initializeData();
  }, [currentWeekStart, initializeWeekSchedules]);

  const calculateStats = useCallback((schedules: DaySchedule[]) => {
    let available = 0;

    schedules.forEach((schedule) => {
      Object.values(schedule.hours).forEach((status) => {
        if (status === "available") available++;
      });
    });
    setStats({
      totalAvailable: available,
      totalHours: 168,
    });
  }, []);

  useEffect(() => {
    calculateStats(weekSchedules);
  }, [weekSchedules, calculateStats]);

const toggleHourStatus = (dayIndex: number, hour: number) => {
  setWeekSchedules((prev) => {
    const updated = [...prev];
    const day = { ...updated[dayIndex] };
    const hours = { ...day.hours };

    const currentStatus = hours[hour];
    const newStatus: HourStatus =
      currentStatus === "unavailable" ? "available" : "unavailable";

    hours[hour] = newStatus;
    day.hours = hours;
    updated[dayIndex] = day;

    setChangedSchedules((prevChanged) => {
      const exists = prevChanged.find((d) => d.date === day.date);
      if (exists) {
        return prevChanged.map((d) => (d.date === day.date ? day : d));
      } else {
        return [...prevChanged, day];
      }
    });

    return updated;
  });

  setHasChanges(true);
};


  useEffect(() => {
    console.log("Week schedules updated:", weekSchedules);
  }, [weekSchedules]);

 const updateEmployeeCount = (dayIndex: number, count: number) => {
  setWeekSchedules((prev) => {
    const updated = [...prev];
    const day = { ...updated[dayIndex] };
    day.employees = Math.max(1, count);
    updated[dayIndex] = day;
    setChangedSchedules((prevChanged) => {
      const exists = prevChanged.find((d) => d.date === day.date);
      if (exists) {
        return prevChanged.map((d) => (d.date === day.date ? day : d));
      } else {
        return [...prevChanged, day];
      }
    });

    return updated;
  });

  setHasChanges(true);
};


  const navigateWeek = (direction: "prev" | "next") => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(
      currentWeekStart.getDate() + (direction === "next" ? 7 : -7)
    );
    setCurrentWeekStart(newWeekStart);
    initializeWeekSchedules(newWeekStart, weekSchedules);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">
            Loading slot management...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="flex flex-1 flex-col gap-4 p-4 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-8 w-8" />
             Slot Management
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your availability and service offerings with hourly
              precision
            </p>
          </div>

          {/* <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={realTimeEnabled}
                onCheckedChange={setRealTimeEnabled}
              />
              <Label className="text-sm flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Real-time
              </Label>
            </div>
          </div> */}
        </div>

        {/* Service Types Selection */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Available Services
              <Badge variant="outline" className="ml-2">
                {Object.values(serviceAvailability).filter(Boolean).length}{" "}
                active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {SERVICE_TYPES.map((service) => (
                <Button
                  key={service.id}
                  variant={
                    serviceAvailability[service.id] ? "default" : "outline"
                  }
                  className={`w-full h-20 flex flex-col items-center gap-1 ${
                    serviceAvailability[service.id] ? service.color : ""
                  }`}
                  onClick={() =>
                    setServiceAvailability((prev) => ({
                      ...prev,
                      [service.id]: !prev[service.id],
                    }))
                  }
                >
                  <span className="text-lg">{service.icon}</span>
                  <span className="text-xs font-medium text-center">
                    {service.name}
                  </span>
                  <span className="text-xs opacity-75">
                    {service.duration}min
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>    */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Available Hours</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {stats.totalAvailable}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-sm font-medium">Unavailable Hours</span>
              </div>
              <p className="text-2xl font-bold text-gray-600 mt-1">
                {stats.totalHours - stats.totalAvailable}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Schedule
            </CardTitle>
            {/* <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-3">
                {currentWeekStart.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(
                  currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div> */}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {weekSchedules.map((schedule, dayIndex) => (
                <div
                  key={schedule.date}
                  className="border rounded-lg p-4 bg-white"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b">
                    <div>
                      <h3 className="font-bold text-lg">{schedule.dayName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(schedule.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-medium">Employees:</span>
                        {editingDay === dayIndex ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              value={schedule.employees}
                              onChange={(e) =>
                                updateEmployeeCount(
                                  dayIndex,
                                  Number.parseInt(e.target.value) || 1
                                )
                              }
                              className="w-16 h-8 text-sm text-center"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 text-sm bg-transparent"
                              onClick={() => setEditingDay(null)}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">
                              {schedule.employees}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => setEditingDay(dayIndex)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">
                            {
                              Object.values(schedule.hours).filter(
                                (h) => h === "available"
                              ).length
                            }
                            h Available
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          <span className="font-medium">
                            {
                              Object.values(schedule.hours).filter(
                                (h) => h === "unavailable"
                              ).length
                            }
                            h Unavailable
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    {/* Time labels */}
                    <div className="flex mb-2">
                      <div className="w-12"></div>
                      <div className="flex-1 flex">
                        {Array.from({ length: 24 }, (_, hour) => (
                          <div
                            key={hour}
                            className="flex-1 text-center text-xs text-gray-600 font-mono"
                          >
                            {hour.toString().padStart(2, "0")}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Horizontal timeline bar */}
                    <div className="flex items-center">
                      <div className="w-12 text-xs text-gray-600 font-medium">
                        Hours:
                      </div>
                      <div className="flex-1 flex h-12 border-2 border-gray-300 rounded-lg overflow-hidden">
                        {Array.from({ length: 24 }, (_, hour) => {
                          const status = schedule.hours[hour];

                          return (
                            <div
                              key={hour}
                              className={`
                                flex-1 cursor-pointer transition-all relative group border-r border-gray-300 last:border-r-0
                                ${
                                  status === "available"
                                    ? "bg-green-400 hover:bg-green-500"
                                    : ""
                                }
                                ${
                                  status === "unavailable"
                                    ? "bg-gray-400 hover:bg-gray-500"
                                    : ""
                                }
                                flex items-center justify-center
                              `}
                              onClick={() => toggleHourStatus(dayIndex, hour)}
                              title={`${hour
                                .toString()
                                .padStart(2, "0")}:00 - ${status}`}
                            >
                              <div className="text-white text-xs font-bold">
                                {status === "available" && "✓"}
                                {status === "unavailable" && "✕"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Legend</h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span className="text-sm text-slate-700">
                  Available for booking
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span className="text-sm text-slate-700">Unavailable</span>
              </div>
              <div className="text-sm text-slate-500">
                Click any hour block to toggle between available and unavailable
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {hasChanges && (
          <div className="flex justify-end gap-3 sticky bottom-4">
            <Button
              variant="outline"
              onClick={() => {
                initializeWeekSchedules(currentWeekStart, weekSchedules);
                const initialServiceAvailability: ServiceAvailability = {};
                SERVICE_TYPES.forEach((service) => {
                  initialServiceAvailability[service.id] = false;
                });
                setServiceAvailability(initialServiceAvailability);
                setHasChanges(false);
                console.log("Changes reset");
              }}
              disabled={saving}
              className="bg-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Changes
            </Button>
            <Button
              onClick={handleUpdateSchedule}
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
          </div>
        )}
      </main>
    </div>
  );
}
