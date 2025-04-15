import React from 'react'
const serviceCategories = [
    { id: 1, name: 'Periodic Services', icon: '/icons/periodic.png', isActive: true },
    { id: 2, name: 'AC Service & Repair', icon: '/icons/ac.png', isActive: false },
    { id: 3, name: 'Batteries', icon: '/icons/battery.png', isActive: false },
    { id: 4, name: 'Tyres & Wheel Care', icon: '/icons/tyre.png', isActive: false },
    { id: 5, name: 'Denting & Painting', icon: '/icons/denting.png', isActive: false },
    { id: 6, name: 'Detailing Services', icon: '/icons/detailing.png', isActive: false }
  ];
export const CategoryBar = () => {
  return (
    <div className="border-b">
    <div className="container mx-auto overflow-x-auto whitespace-nowrap px-4">
      <div className="flex space-x-8 py-4">
        {serviceCategories.map(category => (
          <div 
            key={category.id} 
            className={`flex flex-col items-center cursor-pointer min-w-max ${category.isActive ? 'border-b-2 border-red-500' : ''}`}
          >
            <div className="w-10 h-10 mb-2 flex items-center justify-center">
              {/* Placeholder for icon */}
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
            <span className={`text-sm ${category.isActive ? 'font-semibold' : ''}`}>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}
