"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import AdminHeader from "@/components/admin/Header";
import MainContent from "@/components/admin/MainContent";
import Footer from "../../components/admin/Footer";
import LoginModal from "@/components/admin/LoginModal";
import { axiosPrivate } from "@/api/axios";
import { useRouter } from "next/navigation";
import createAuthApi from "@/services/authApi";
import createAdminApi from "@/services/adminApi";
import { toast } from "react-toastify";
import { login } from "@/redux/features/authSlice";
import { setUnreadCount } from "@/redux/features/notificationSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

const authApi = createAuthApi(axiosPrivate);
const adminApi = createAdminApi(axiosPrivate);

export default function AdminHomePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authApi.adminLoginApi(email, password);
      const unreadNotificationsResponse = await adminApi.getUnreadCount();
      console.log("unreadNotificationsResponse", unreadNotificationsResponse);
      console.log("the admin after login", response);
      dispatch(setUnreadCount(unreadNotificationsResponse.unreadCount));
      dispatch(
        login({
          id: response.user._id,
          name: response.user.name,
          role: response.user.role || "admin",
          email: response.user.email,
          location: null,
        })
      );
      toast.success("Successfully logged in");
      setShowLoginModal(false);
      router.push("/admin/dashboard");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(
        "Login failed: " +
          (err.response?.data?.message || "Something went wrong")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AdminHeader setShowLoginModal={setShowLoginModal} />
      <MainContent setShowLoginModal={setShowLoginModal} />
      <Footer />
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}
