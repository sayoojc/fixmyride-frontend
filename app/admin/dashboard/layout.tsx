"use client"; 

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import DashboardSidebar from "@/components/admin/DashboardSidebar";
import { AdminNotificationListener } from "@/components/NotificationListner"; 

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { id, role } = useSelector((state: RootState) => state.auth.user);

  const adminId = role === "admin" ? id : null;

  return (
    <>
      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-6">{children}</main>
      </div>

      {adminId && <AdminNotificationListener adminId={adminId} />}

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
