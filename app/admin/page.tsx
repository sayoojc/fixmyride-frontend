
"use client"

import { useState } from 'react';
import { AxiosError } from "axios";
import { X, Lock, Mail } from 'lucide-react';
import AdminHeader from '@/components/admin/Header';
import MainContent from '@/components/admin/MainContent';
import Footer from '../../components/admin/Footer';
import LoginModal from '@/components/admin/LoginModal';
import { axiosPrivate } from '@/api/axios';
import { useRouter } from "next/navigation";
import createAuthApi from '@/services/authApi';
const authApi = createAuthApi(axiosPrivate);

export default function AdminHomePage() {
   const router = useRouter(); 
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async(email: string, password: string) => {
 try {
      await authApi.adminLoginApi(email,password);
      alert("Login successful!");
      setShowLoginModal(false);
      router.push("/admin/dashboard");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error("Login failed:", err.response?.data?.message || "Something went wrong");
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
     <AdminHeader setShowLoginModal={setShowLoginModal}/>

      {/* Main Content */}
      <MainContent setShowLoginModal={setShowLoginModal}/>

      {/* Footer */}
     <Footer/>

         {/* Login Modal */}
         {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

