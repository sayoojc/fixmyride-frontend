"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  User,
  Settings,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

import { ConfirmationConfig } from "@/components/ConfirmationModal";

import { toast } from "react-toastify";
import createAdminApi from "@/services/adminApi";
import { axiosPrivate } from "@/api/axios";
import { INotification } from "@/types/notification";
import { ConfirmationModal } from "@/components/ConfirmationModal";
const adminApi = createAdminApi(axiosPrivate);
export default function NotificationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ConfirmationConfig | null>(
    null
  );
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const itemsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState<"all" | "read" | "unread">(
    "all"
  );
  useEffect(() => {
    fetchNotifications();
  }, [currentPage, searchQuery, statusFilter]);
  const confirmDeleteNotification = (id: string) => {
    setModalConfig({
      title: "Delete Notification",
      description:
        "Are you sure you want to delete this notification? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        setLoading(true);
        try {
          const response = await adminApi.deleteNotification(id);
          if (response.success) {
            toast.success("Notification deleted successfully.");
            setNotifications((prev) => prev.filter((n) => n._id !== id));
          }
        } catch (error) {
          toast.error("Failed to delete notification.");
          console.error("Error deleting notification:", error);
        } finally {
          setLoading(false);
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getNotifications(
        searchQuery,
        currentPage,
        itemsPerPage,
        statusFilter
      );
      setNotifications(response.notifications);
      setTotalNotifications(response.totalNotifications);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "service_request":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "order":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "admin_announcement":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRecipientIcon = (recipientType: string) => {
    switch (recipientType) {
      case "user":
        return <User className="w-4 h-4" />;
      case "provider":
        return <Settings className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date =
      typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await adminApi.markNotificationAsRead(id);

      if (response.success) {
        toast.success("marked notification as read");
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === id
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      toast.error("Marking notification as read failed.");
      console.error("Error marking notification as read:", error);
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      const response = await adminApi.markNotificationAsUnread(id);
      if (response.success) {
        toast.success("marked notification as unread");
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === id
              ? { ...notification, isRead: false }
              : notification
          )
        );
      }
    } catch (error) {
      toast.error("Marking notification as unread failed.");
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await adminApi.markAllAsRead();

      if (response.success) {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, isRead: true }))
        );
        fetchNotifications();
      }
      toast.success("notifications marked as read.");
    } catch (error) {
      toast.error("failed to mark notifications as marked.")
      console.error("Error marking all notifications as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-gray-600">
            Stay updated with your vehicle service management system
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(["all", "read", "unread"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                      statusFilter === status
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {status === "all" && <Bell className="w-4 h-4" />}
                    {status === "read" && <Check className="w-4 h-4" />}
                    {status === "unread" && <Clock className="w-4 h-4" />}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium"
              >
                Mark All Read
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            Showing{" "}
            {notifications.length > 0
              ? (currentPage - 1) * itemsPerPage + 1
              : 0}{" "}
            to {Math.min(currentPage * itemsPerPage, totalNotifications)} of{" "}
            {totalNotifications} notifications
          </p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-600">
                No notifications match your current search or filter criteria.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-xl shadow-lg border transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${
                  notification.isRead
                    ? "border-gray-200 opacity-75"
                    : "border-blue-200 shadow-blue-50"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        notification.isRead ? "bg-gray-100" : "bg-blue-50"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`font-semibold ${
                                notification.isRead
                                  ? "text-gray-700"
                                  : "text-gray-900"
                              }`}
                            >
                              {notification.type
                                .replace("_", " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p
                            className={`text-sm mb-2 ${
                              notification.isRead
                                ? "text-gray-500"
                                : "text-gray-600"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(notification.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              {getRecipientIcon(notification.recipientType)}
                              {notification.recipientType
                                .charAt(0)
                                .toUpperCase() +
                                notification.recipientType.slice(1)}
                            </div>
                            {notification.link && (
                              <div className="flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" />
                                <a
                                  href={notification.link}
                                  className="text-blue-500 hover:text-blue-700 underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View Details
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {notification.isRead ? (
                            <button
                              onClick={() => markAsUnread(notification._id)}
                              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Mark as unread"
                            >
                              <Bell className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all duration-200"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              confirmDeleteNotification(notification._id)
                            }
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete notification"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        config={modalConfig}
        isLoading={loading}
      />
    </div>
  );
}
