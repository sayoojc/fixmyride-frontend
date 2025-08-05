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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Pagination from "../../../components/Pagination";
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
} from "lucide-react";
import type { Notification } from "@/types/notification";
import { toast } from "react-toastify";
import {
  ConfirmationModal,
  ConfirmationConfig,
} from "@/components/ConfirmationModal";

const providerApi = createProviderApi(axiosPrivate);

const getNotificationIcon = (type: string, category: string) => {
  if (category === "order") return Bell;
  if (category === "payment") return DollarSign;
  if (category === "appointment") return Calendar;
  if (category === "general") return User;
  switch (type) {
    case "success":
      return CheckCircle;
    case "warning":
      return AlertCircle;
    case "error":
      return XCircle;
    default:
      return Info;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "success":
      return "text-green-600 bg-green-50";
    case "warning":
      return "text-yellow-600 bg-yellow-50";
    case "error":
      return "text-red-600 bg-red-50";
    default:
      return "text-blue-600 bg-blue-50";
  }
};

const getBadgeVariant = (type: string) => {
  switch (type) {
    case "success":
      return "default";
    case "warning":
      return "secondary";
    case "error":
      return "destructive";
    default:
      return "outline";
  }
};

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

export default function NotificationsPage() {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmationConfig | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [providerData, setProviderData] = useState<IServiceProvider | null>(
    null
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [unreadOnlyFilter, setUnReadOnlyFilter] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  // useEffect(() => {
  //   const socket = getSocket()
  //   socket.on("service:available", (data) => {
  //     const newNotification: Notification = {
  //       _id: Date.now().toString(),
  //       title: "New Emergency Order",
  //       message: data.message,
  //       type: "info",
  //       category: "order",
  //       isRead: false,
  //       createdAt: new Date().toISOString(),
  //     }
  //     setNotifications((prev) => [newNotification, ...prev])
  //   })
  //   return () => {
  //     socket.off("service:available")
  //   }
  // }, []);
  useEffect(() => {
    console.log("the debounced search term", debouncedSearchTerm);
    console.log("the current page", currentPage);
    console.log("the fileter type", filterType);
  }, [debouncedSearchTerm, currentPage, filterType]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await providerApi.getProfileData();
        setProviderData(response.provider);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setNotificationLoading(true);
        const response = await providerApi.getNotifications(
          debouncedSearchTerm,
          currentPage,
          filterType,
          itemsPerPage,
          showUnreadOnly
        );
        setNotifications(response.notifications);
        setTotalPages(response.totalPages);
        setUnreadCount(response.unreadCount);
        setNotificationLoading(false);
      } catch (error) {
        setNotificationLoading(false);
      }
    };
    fetchNotifications();
  }, [
    debouncedSearchTerm,
    currentPage,
    filterType,
    itemsPerPage,
    showUnreadOnly,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const markAsRead = async (id: string) => {
    try {
      setNotificationLoading(true);
      const response = await providerApi.markNotificationAsRead(id);
      console.log("the response of the mark as response", response);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount((prev) => {
        if (prev - 1 >= 0) {
          return prev - 1;
        } else {
          return 0;
        }
      });
      setNotificationLoading(false);
      toast.success("Notification marked as read");
    } catch (error) {
      setNotificationLoading(false);
      toast.error("notification update failed");
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      setNotificationLoading(true);
      const response = await providerApi.markNotificationAsUnread(id);
      console.log("the response after mark notification as unread", response);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: false }
            : notification
        )
      );
      setUnreadCount((prev) => prev + 1);
      setNotificationLoading(false);
      toast.success("Notification marked as unread");
    } catch (error) {
      setNotificationLoading(false);
      toast.error("notification update failed");
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotificationLoading(true);
      const response = await providerApi.markAllAsRead();
      if (response.success) {
        toast.success("All notifications marked as read.");
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } else {
      toast.error("Marking notification as read failed");
      }
      setNotificationLoading(false);
    } catch (error) {
      setNotificationLoading(false);
      toast.error("Marking notification as read failed");
    }
  };

  const deleteNotification = async (id: string) => {
    setConfirmConfig({
      title: "Delete Notification",
      description:
        "Are you sure you want to delete this notification? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
          setNotificationLoading;
          const response = await providerApi.deleteNotification(id);
          if (response.success) {
            setUnreadCount((prev) => {
              if (prev - 1 >= 0) {
                return prev - 1;
              } else {
                return 0;
              }
            });
            setNotifications((prev) =>
              prev.filter((notification) => notification._id !== id)
            );
            toast.success("Notification deleted successfully");
          }
        } catch (error) {
          toast.error("Deleting notification failed");
        } finally {
          setNotificationLoading(false);
          setConfirmDeleteOpen(false);
        }
      },
    });
    setConfirmDeleteOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value));
    setCurrentPage(1);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">
            Loading notifications...
          </p>
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
                <p className="text-slate-500 mt-1">
                  Stay updated with your latest activities
                </p>
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
                  <Button
                    onClick={markAllAsRead}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Filters and Items Per Page */}
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="service_request">
                          Service Request
                        </SelectItem>
                        <SelectItem value="order">Order</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="admin_announcement">
                          Admin Announcement
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={handleItemsPerPageChange}
                    >
                      <SelectTrigger className="w-full md:w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 per page</SelectItem>
                        <SelectItem value="10">10 per page</SelectItem>
                        <SelectItem value="20">20 per page</SelectItem>
                        <SelectItem value="50">50 per page</SelectItem>
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
              {notificationLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-700">
                            <div className="h-5 w-5 rounded-full bg-slate-300 animate-pulse" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="h-4 w-24 bg-slate-300 rounded animate-pulse" />
                              <div className="h-4 w-12 bg-slate-300 rounded animate-pulse" />
                              <div className="h-2 w-2 bg-blue-300 rounded-full animate-pulse" />
                            </div>

                            <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
                            <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
                            <div className="flex justify-end mt-3">
                              <div className="h-4 w-4 bg-slate-300 rounded animate-pulse" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      No notifications found
                    </h3>
                    <p className="text-slate-500">
                      {searchTerm || filterType !== "all" || showUnreadOnly
                        ? "Try adjusting your filters to see more notifications."
                        : "You're all caught up! New notifications will appear here."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification, index) => {
                  const IconComponent = getNotificationIcon(
                    notification.type,
                    "order"
                  );
                  return (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card
                        className={`transition-all hover:shadow-md ${
                          !notification.isRead
                            ? "border-l-4 border-l-blue-500 bg-blue-50/30"
                            : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-2 rounded-full ${getNotificationColor(
                                notification.type
                              )}`}
                            >
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3
                                      className={`font-medium ${
                                        !notification.isRead
                                          ? "text-slate-900"
                                          : "text-slate-700"
                                      }`}
                                    >
                                      {notification.type}
                                    </h3>
                                    <Badge
                                      variant={getBadgeVariant(
                                        notification.type
                                      )}
                                      className="text-xs"
                                    >
                                      {notification.type}
                                    </Badge>
                                    {!notification.isRead && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}
                                  </div>
                                  <p className="text-slate-600 text-sm mb-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-slate-400 text-xs">
                                    {formatTimeAgo(notification.createdAt)}
                                  </p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {notification.isRead ? (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          markAsUnread(notification._id)
                                        }
                                      >
                                        <Bell className="h-4 w-4 mr-2" />
                                        Mark as Unread
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          console.log(
                                            "the mark as read click event"
                                          );
                                          markAsRead(notification._id);
                                        }}
                                      >
                                        <Check className="h-4 w-4 mr-2" />
                                        Mark as Read
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() =>
                                        deleteNotification(notification._id)
                                      }
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              {notification.link && (
                                <div className="mt-3">
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={notification.link}>View Details</a>
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <ConfirmationModal
              isOpen={confirmDeleteOpen}
              onClose={() => setConfirmDeleteOpen(false)}
              config={confirmConfig}
              isLoading={loading}
            />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
