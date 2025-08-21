"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { keralaCities } from "../../constants/cities"

interface LocationDropdownProps {
  selectedLocation: string
  onLocationChange: (location: string) => void
}

export const LocationDropdown: React.FC<LocationDropdownProps> = ({ selectedLocation, onLocationChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const detectCurrentLocation = () => {
    setIsDetecting(true)

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.")
      setIsDetecting(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        // Find the nearest city based on coordinates
        let nearestCity = keralaCities[0]
        let minDistance = calculateDistance(latitude, longitude, nearestCity.lat, nearestCity.long)

        keralaCities.forEach((city) => {
          const distance = calculateDistance(latitude, longitude, city.lat, city.long)
          if (distance < minDistance) {
            minDistance = distance
            nearestCity = city
          }
        })

        onLocationChange(nearestCity.name)
        setIsDetecting(false)
        setIsOpen(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        alert("Unable to detect your location. Please select manually.")
        setIsDetecting(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <span>{selectedLocation}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <button
              onClick={detectCurrentLocation}
              disabled={isDetecting}
              className="w-full flex items-center space-x-2 px-3 py-2 text-left text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
            >
              {isDetecting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span>{isDetecting ? "Detecting..." : "Detect Current Location"}</span>
            </button>
          </div>

          <div className="py-2">
            {keralaCities.map((city) => (
              <button
                key={city.name}
                onClick={() => {
                  onLocationChange(city.name)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                  selectedLocation === city.name ? "bg-blue-50 text-blue-600" : "text-gray-700"
                }`}
              >
                <div className="font-medium">{city.name}</div>
                <div className="text-sm text-gray-500">{city.district} District</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
