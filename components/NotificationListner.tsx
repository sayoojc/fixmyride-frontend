"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useDispatch } from "react-redux";
import { markAsUnread } from "@/redux/features/notificationSlice";
import Swal from "sweetalert2";

/* ---------------- PROVIDER LISTENER ---------------- */
export const ProviderNotificationListener = ({
  providerId,
  providerLocation,
}: {
  providerId: string;
  providerLocation: { lat: number; lng: number };
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const socket = getSocket();
    socket.emit("register:role", {
      role: "provider",
      providerId,
      location: providerLocation,
    });
    socket.on("notification:new", (data) => {
      dispatch(markAsUnread());
    });
    socket.on("service:available", (data) => {
      Swal.fire({
        title: "New Emergency Order!",
        text: data.message,
        icon: "info",
        confirmButtonText: "View Order",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = `/provider/orders/${data.orderId}`;
        }
      });
    });

    return () => {
      socket.off("service:available");
    };
  }, [providerId, providerLocation]);

  return null;
};

/* ---------------- ADMIN LISTENER ---------------- */
export const AdminNotificationListener = ({ adminId }: { adminId: string }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const socket = getSocket();
    socket.emit("register:role", { role: "admin", adminId });
     socket.on("notification:new", (data) => {
      dispatch(markAsUnread());
    });
    return () => {
      socket.off("admin:alert");
    };
  }, [adminId]);
  return null;
};

export const UserNotificationListener = ({ userId }: { userId: string }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const socket = getSocket();
    socket.emit("register:role", { role: "user", userId });
    socket.on("notification:new", () => {
      dispatch(markAsUnread());
    });
    return () => {
      socket.off("order:update");
    };
  }, [userId]);

  return null;
};
