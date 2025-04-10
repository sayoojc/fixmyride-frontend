
"use client"
import { FaCarAlt, FaTools, FaOilCan, FaWrench } from "react-icons/fa";
import { MdBattery80, MdAcUnit, MdBrush } from "react-icons/md";
import { GiCarWheel } from "react-icons/gi";
  
  export default function Navbar(){
    const serviceCategories = [
        { id: 1, name: "Periodic Services", icon: <FaWrench size={24} /> },
        { id: 2, name: "AC Service & Repair", icon: <MdAcUnit size={24} /> },
        { id: 3, name: "Batteries", icon: <MdBattery80 size={24} /> },
        { id: 4, name: "Tyres & Wheel Care", icon: <GiCarWheel size={24} /> },
        { id: 5, name: "Denting & Painting", icon: <MdBrush size={24} /> },
        { id: 6, name: "Car Inspections", icon: <FaCarAlt size={24} /> },
        { id: 7, name: "Insurance Claims", icon: <FaTools size={24} /> },
        { id: 8, name: "SOS Service", icon: <FaOilCan size={24} /> },
      ];
    
    return (
            <div className="bg-gray-100 py-2 border-b border-gray-300 overflow-x-auto">
        <div className="container mx-auto flex items-center justify-start">
          {serviceCategories.map((category) => (
            <div key={category.id} className="flex flex-col items-center mx-4 min-w-max cursor-pointer">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                {category.icon}
              </div>
              <span className="text-xs text-center mt-1">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
    
    
    
    
 