"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import type { IServiceProvider } from "@/types/provider"

interface ServiceSearchProps {
  selectedLocation: string
  onSearch: (query: string, location: string) => void
  searchResults: IServiceProvider[]
}

export const ServiceSearch: React.FC<ServiceSearchProps> = ({ selectedLocation, onSearch, searchResults }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
 useEffect(() => {
  if (searchQuery.trim()) {
    setShowResults(true)
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery, selectedLocation)
    }, 500)

    return () => clearTimeout(timeoutId)
  } else {
    setShowResults(false)
  }
}, [searchQuery, selectedLocation, onSearch])


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery, selectedLocation)
    }
  }

  return (
    <div className="relative w-1/3">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder={`Search services in ${selectedLocation}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2 px-4 pr-10 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </button>
      </form>

      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-40 max-h-60 overflow-y-auto">
          {searchResults.map((center) => (
            <div
              key={center._id}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => {
                setSearchQuery(center.name)
                setShowResults(false)
                onSearch(center.name, selectedLocation)
              }}
            >
              <div className="font-medium text-gray-900">{center.name}</div>
              {/* <div className="text-sm text-gray-600">{center.addressToSend.street}</div> */}
              <div className="text-xs text-blue-600 mt-1">
                {/* {center.services.slice(0, 3).join(", ")}
                {center.services.length > 3 && "..."} */}
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && searchResults.length === 0 && searchQuery.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-40 p-3">
          <div className="text-gray-500 text-center">
            No service centers found in {selectedLocation} for "{searchQuery}"
          </div>
        </div>
      )}
    </div>
  )
}
