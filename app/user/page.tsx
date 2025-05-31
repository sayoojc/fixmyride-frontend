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
          <ServicePackages/>
          <CartSummary/>
        </div>
      </div>
    </div>
  );
};

export default CarServiceBooking;