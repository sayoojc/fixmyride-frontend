
"use client";

import { useEffect } from "react";
import { getSocket } from "../../lib/socket";
import Swal from "sweetalert2";

export const NotificationListener = ({
  providerId,
  providerLocation,
}: {
  providerId: string;
  providerLocation: { lat: number; lng: number };
}) => {
  useEffect(() => {
    const socket = getSocket();
    socket.emit("register:provider", { providerId, location: providerLocation });

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
