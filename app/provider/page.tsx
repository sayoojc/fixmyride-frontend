"use client"

import { useState, FormEvent } from 'react';
import Head from 'next/head';
import createAuthApi from '@/services/authApi';
import { axiosPrivate } from '@/api/axios';
import { useRouter } from 'next/navigation';
import { AxiosError } from "axios";

const authApi = createAuthApi(axiosPrivate);

export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loginData,setLoginData] = useState({
    email:'',
    password:''
  })

  const handleLogin = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      try {
         await authApi.providerLoginApi(loginData.email, loginData.password);
         alert("Login successful!");
         setIsModalOpen(false);
         router.push("/provider/dashboard");
       } catch (error) {
         const err = error as AxiosError<{ message?: string }>;
         console.error("Login failed:", err.response?.data?.message || "Something went wrong");
         alert(err.response?.data?.message || "Login failed!");
       }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Car Service Center</title>
        <meta name="description" content="Professional car servicing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="p-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold">Car Service Center</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          Login
        </button>
      </header>


      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full p-2 border rounded"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required 
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2">Password</label>
                <input 
                  type="password" 
                  className="w-full p-2 border rounded"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 mb-4"
              >
                Sign In
              </button>
              <button 
                type="button" 
                className="w-full bg-gray-300 p-3 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
      <footer className="p-4 border-t text-center">
        <p>© 2025 Car Service Center</p>
      </footer>
    </div>
  );
}