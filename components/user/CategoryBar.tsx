"use client";

import Image from "next/image";
import React from "react";

interface CategoryBarProps {
  setSelectedServiceCategory: (state: string) => void;
  serviceCategories: ReadonlyArray<{
    key: string;
    name: string;
    icon: string;
    isActive: boolean;
  }>;
  selectedServiceCategory: string;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  setSelectedServiceCategory,
  serviceCategories,
  selectedServiceCategory,
}) => {
  return (
    <div className="border-b bg-white sticky top-0 z-10">
      <div className="container mx-auto overflow-x-auto whitespace-nowrap px-4">
        <div className="flex space-x-8 py-4">
          {serviceCategories.map((category) => {
            const isActive = category.key === selectedServiceCategory;

            return (
              <button
                key={category.key}
                onClick={() => setSelectedServiceCategory(category.key)}
                className={`flex flex-col items-center min-w-max transition-all duration-200 ${
                  isActive
                    ? "border-b-2 border-red-500 text-red-600"
                    : "text-gray-600 hover:text-red-400"
                }`}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  <Image
                    src={category.icon}
                    alt={category.name}
                    width={40}
                    height={40}
                    className={`object-contain transition-transform duration-200 ${
                      isActive ? "scale-110" : "opacity-80 hover:opacity-100"
                    }`}
                  />
                </div>

                <span
                  className={`text-sm ${
                    isActive ? "font-semibold" : "font-medium"
                  }`}
                >
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
