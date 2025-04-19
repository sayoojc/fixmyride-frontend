"use client"

import React, { useState } from 'react'
import Link from 'next/link';
import createAuthApi from '@/services/authApi';
import { axiosPrivate } from '@/api/axios';
import { useRouter } from 'next/navigation';


const authApi = createAuthApi(axiosPrivate);

export const Header = () => {
    const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
 const handleLogout = async () => {
    try {
        await authApi.logoutApi();
        router.push('/');
        alert('loggedout successfully');
    } catch (error) {
        console.error('logout failed',error);
    }
 }
  return (
    <header className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold">FixMyRide</div>
          <div className="relative">
            <span className="ml-2">Trivandrum</span>
            <span className="ml-1">▼</span>
          </div>
        </div>

        <div className="relative w-1/3">
          <input 
            type="text" 
            placeholder="Example: Periodic Services" 
            className="w-full py-2 px-4 rounded-lg text-gray-700"
          />
          <button className="absolute right-2 top-2 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-gray-300">Blog</a>
          <div className="relative group">
            <a href="#" className="hover:text-gray-300">More</a>
          </div>
          <div className="relative">
            <a 
              href="#" 
              className="bg-red-600 text-white px-4 py-2 rounded"
              onMouseEnter={() => setShowDropdown(true)}
            >
              Customer
            </a>
            {showDropdown && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-black border border-red-800 rounded shadow-lg z-10"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <ul>
                <li>
  <Link href="/user/profile">
    <div className="flex items-center px-4 py-2 text-white hover:bg-red-900">
      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      Profile
    </div>
  </Link>
</li>

                  <li>
                    <a href="#" className="flex items-center px-4 py-2 text-white hover:bg-red-900">
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                      </svg>
                      Wallet
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center px-4 py-2 text-white hover:bg-red-900">
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      Order History
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center px-4 py-2 text-white hover:bg-red-900">
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                      </svg>
                      Addresses
                    </a>
                  </li>
                  <li>
                    <a href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                    }}
                    className="flex items-center px-4 py-2 text-white hover:bg-red-900">
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}