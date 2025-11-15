"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useDispatch } from "react-redux";
import { markAsUnread } from "@/redux/features/notificationSlice";
import Swal from "sweetalert2";
import {toast} from "react-toastify"
import { useRef } from "react";
/* ---------------- PROVIDER LISTENER ---------------- */
interface ProviderNotificationListenerProps {
  providerId: string;
  providerLocation: { lat: number; lng: number };
}


export const ProviderNotificationListener = ({
  providerId,
  providerLocation,
}: ProviderNotificationListenerProps) => {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!providerId || !providerLocation) return;

    hasInitialized.current = true;
    const socket = getSocket();

 socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);

  console.log("🚀 Emitting register:role with data:", {
    role: "provider",
    id: providerId,
    location: providerLocation,
  });
  socket.emit(
    "register:role",
    {
      role: "provider",
      id: providerId,
      location: providerLocation,
    },
    (response: any) => {
      console.log("📬 Server acknowledgment for register:role:", response);
    }
  );
});
    socket.on("notification:new", (data) => {
      console.log("📩 Notification:", data);
      dispatch(markAsUnread());
    });

    socket.on("service:available", (data) => {
      console.log('the service available event recieved')
      console.log("🚨 Emergency:", data);
      Swal.fire({
        title: "🚨 New Emergency Order!",
        text: data.message || "Emergency nearby!",
        icon: "info",
        confirmButtonText: "View Order",
        showCancelButton: true,
      }).then((res) => {
        if (res.isConfirmed && data?.orderId) {
          window.location.href = `/provider/orders/${data.orderId}`;
        }
      });
    });

    socket.on("connect_error", (err) =>
      console.error("❌ Socket error:", err.message)
    );

    socket.on("disconnect", (reason) =>
      console.warn("⚠️ Socket disconnected:", reason)
    );


  }, [providerId, providerLocation]);

  return null;
};



/* ---------------- ADMIN LISTENER ---------------- */
export const AdminNotificationListener = ({ adminId }: { adminId: string }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const socket = getSocket();
    socket.emit("register:role", { role: "admin", id:adminId });
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
  console.log('userId in listener is ',userId);
  const dispatch = useDispatch();
  useEffect(() => {
    const socket = getSocket();
    socket.emit("register:role", { role: "user",id:userId },() => {
      console.log('the socket event register is emitted ',userId)
    });
    socket.on("notification:new", () => {
      dispatch(markAsUnread());
    });
    socket.on("order:update", (data) => {
      console.log("📦 order:update payload:", data);
      toast.success(data.message || "Your order has been updated");
       dispatch(markAsUnread());
     
    });
    return () => {
      socket.off("order:update");
      socket.off("notification:new");
    };
  }, [userId]);

  return null;
};
