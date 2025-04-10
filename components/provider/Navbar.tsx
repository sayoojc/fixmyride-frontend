"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { axiosPrivate } from "@/api/axios";
import createAuthApi from "@/services/authApi";
import { AxiosError } from "axios";

const authApi = createAuthApi(axiosPrivate);
export default function Navbar() {
  const router = useRouter();
  const handleLogout = async() => {
  
    try {
        await authApi.ProviderLogoutApi();
        router.push('/provider')
    } catch (error) {
       const err = error as AxiosError<{ message?: string }>;
              console.error("Logout failed:", err.response?.data?.message || "Something went wrong");
              alert(err.response?.data?.message || "Logout failed!");   
    }
  }

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Car Service Center</h1>

        <div className="space-x-4">
          <button onClick={() => router.push("/")} className="hover:underline">
            Dashboard
          </button>
          <button onClick={() => router.push("/profile")} className="hover:underline">
            Profile
          </button>
          <button 
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-500 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
