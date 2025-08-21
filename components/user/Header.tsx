"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LocationDropdown } from "./location-dropdown"
import { ServiceSearch } from "./ServiceSearch"
import { axiosPrivate } from "@/api/axios"
import createAuthApi from "@/services/authApi"
import createUserApi from "@/services/userApi"
const userApi = createUserApi(axiosPrivate)
const authApi = createAuthApi(axiosPrivate)
import { IServiceProvider } from "@/types/provider"
export const Header = () => {
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("Thiruvananthapuram");
  const [searchResults, setSearchResults] = useState<IServiceProvider[]>([])

  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocation")
    if (savedLocation) {
      setSelectedLocation(savedLocation)
    } else {
      // Auto-detect location on first visit
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // This would normally call your location detection logic
            // For now, keeping default location
          },
          (error) => {
            console.log("Location detection failed, using default")
          },
        )
      }
    }
  }, [])

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location)
    localStorage.setItem("selectedLocation", location)
  }
  const handleSearch = async(query: string, location: string) => {
    console.log("Search query:", query, "Location:", location)
     const  response = await userApi.getProvidersBySearch(query, location);
     console.log("Search results:", response.providers)
      setSearchResults(response.providers)
  }
  const handleLogout = async () => {
    try {
      await authApi.logoutApi();
      router.push("/")
      alert("Logged out successfully")
    } catch (error) {
      console.error("logout failed", error)
    }
  }

  return (
    <header className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold">FixMyRide</div>
          <LocationDropdown selectedLocation={selectedLocation} onLocationChange={handleLocationChange} />
        </div>

        <ServiceSearch selectedLocation={selectedLocation} onSearch={handleSearch} searchResults={searchResults}/>

        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-gray-300">
            Blog
          </a>
          <div className="relative group">
            <a href="#" className="hover:text-gray-300">
              More
            </a>
          </div>
          <div className="relative">
            <a href="#" className="bg-red-600 text-white px-4 py-2 rounded" onMouseEnter={() => setShowDropdown(true)}>
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
                        <svg
                          className="w-5 h-5 mr-2 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </div>
                    </Link>
                  </li>

                  <li>
                    <a href="#" className="flex items-center px-4 py-2 text-white hover:bg-red-900">
                      <svg
                        className="w-5 h-5 mr-2 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        ></path>
                      </svg>
                      Wallet
                    </a>
                  </li>
                  <li>
                    <Link href="/user/orders" className="flex items-center px-4 py-2 text-white hover:bg-red-900">
                      <svg
                        className="w-5 h-5 mr-2 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        ></path>
                      </svg>
                      Order History
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="flex items-center px-4 py-2 text-white hover:bg-red-900">
                      <svg
                        className="w-5 h-5 mr-2 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        ></path>
                      </svg>
                      Addresses
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={(e) => {
                        e.preventDefault()
                        handleLogout()
                      }}
                      className="flex items-center px-4 py-2 text-white hover:bg-red-900"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        ></path>
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
