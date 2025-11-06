"use client";
import { Header } from "@/components/user/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserNotificationListener } from "@/components/NotificationListner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import Footer from "@/components/user/Footer";
const EmergencyOrderWidget = dynamic(
  () => import("@/components/user/EmergencyOrderWidget"),
  {
    ssr: false,
  }
);
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = useSelector((state: RootState) => state.auth.user.id);
  useEffect(() => {
    console.log("userId in layout is ", userId);
  }, [userId]);
  return (
    <>
      <Header />
     {userId && <UserNotificationListener userId={userId} />}
      <main className="pt-20 pb-20 min-h-screen">{children}</main>
      <EmergencyOrderWidget />
      <ToastContainer position="top-right" autoClose={3000} />
      <Footer></Footer>
    </>
  );
}
