// components/CarServiceBooking.jsx
"use client"
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { CategoryBar } from '@/components/user/CategoryBar';
import { ServicePackages } from '@/components/user/ServicePackages';
import { CartSummary } from '@/components/user/CartSummary';
const CarServiceBooking = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [selectedService, setSelectedService] = useState('Standard Service');
  const [cartItems, setCartItems] = useState([
    { 
      id: 1, 
      name: 'Standard Service', 
      price: 4867, 
      originalPrice: 6953,
      timeRequired: '6 Hrs', 
      warranty: '1000 Kms or 1 Month Warranty',
      recommendation: 'Every 10,000 Kms or 6 Months (Recommended)',
      isAdded: true,
      features: [
        'Car Scanning',
        'Battery Water Top up',
        'Interior Vacuuming ( Carpet & Seats )',
        'Wiper Fluid Replacement',
        'Car Wash'
      ],
      moreFeatures: 10,
      oilType: 'Mobil 5W40 Semi Synthetic'
    },
    { 
      id: 2, 
      name: 'Basic Service', 
      price: 4867,
      originalPrice: 5500,
      timeRequired: '4 Hrs', 
      warranty: '1000 Kms or 1 Month Warranty',
      recommendation: 'Every 5000 Kms or 3 Months (Recommended)',
      isAdded: false,
      features: [
        'Wiper Fluid Replacement',
        'Car Wash',
        'Engine Oil Replacement',
        'Battery Water Top Up',
        'Interior Vacuuming ( Carpet & Seats )'
      ],
      moreFeatures: 4
    }
  ]);



  // const addToCart = (id) => {
  //   setCartItems(cartItems.map(item => 
  //     item.id === id ? { ...item, isAdded: true } : item
  //   ));
  // };

  // const removeFromCart = (id) => {
  //   setCartItems(cartItems.map(item => 
  //     item.id === id ? { ...item, isAdded: false } : item
  //   ));
  // };



  return (
    <div className="min-h-screen bg-gray-50">
   <CategoryBar/>
   
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Scheduled Packages</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Service Packages */}
         
          <ServicePackages/>
          {/* Right Column - Cart Summary */}
          <CartSummary/>
        </div>
      </div>
    </div>
  );
};

export default CarServiceBooking;