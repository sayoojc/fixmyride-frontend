// components/CarServiceBooking.jsx
"use client"
import React, { useState } from 'react';
import Image from 'next/image';

const CarServiceBooking = () => {
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

  const serviceCategories = [
    { id: 1, name: 'Periodic Services', icon: '/icons/periodic.png', isActive: true },
    { id: 2, name: 'AC Service & Repair', icon: '/icons/ac.png', isActive: false },
    { id: 3, name: 'Batteries', icon: '/icons/battery.png', isActive: false },
    { id: 4, name: 'Tyres & Wheel Care', icon: '/icons/tyre.png', isActive: false },
    { id: 5, name: 'Denting & Painting', icon: '/icons/denting.png', isActive: false },
    { id: 6, name: 'Detailing Services', icon: '/icons/detailing.png', isActive: false }
  ];

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

  const getSubtotal = () => {
    return cartItems.filter(item => item.isAdded).reduce((sum, item) => sum + item.price, 0);
  };

  const getCartItemCount = () => {
    return cartItems.filter(item => item.isAdded).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <a href="#" className="bg-red-600 text-white px-4 py-2 rounded">Customer</a>
          </div>
        </div>
      </header>

      {/* Service Categories */}
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

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Scheduled Packages</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Service Packages */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(service => (
              <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className={`px-2 py-1 text-white w-max ${service.id === 1 ? 'bg-green-500' : 'hidden'}`}>
                  RECOMMENDED
                </div>
                <div className="p-4">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 mb-4 md:mb-0">
                      {/* Placeholder for service image */}
                      <div className="bg-gray-200 w-full h-36 rounded"></div>
                    </div>
                    <div className="md:w-3/4 md:pl-6">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold">{service.name}</h2>
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                          {service.timeRequired} Taken
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-600">
                        • {service.warranty} &nbsp; • {service.recommendation}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                        {service.features.slice(0, 5).map((feature, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {service.moreFeatures > 0 && (
                        <div className="mt-2 text-green-500 text-sm cursor-pointer">
                          + {service.moreFeatures} more View All
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="flex items-center">
                      <span className="text-gray-400 line-through mr-2">Rs. {service.originalPrice}</span>
                      <span className="text-2xl font-bold">₹ {service.price}</span>
                    </div>
                    
                    {service.isAdded ? (
                      <div className="flex items-center text-green-500">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Added To Cart</span>
                      </div>
                    ) : (
                      <button 
                        // onClick={() => addToCart(service.id)}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right Column - Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="relative h-24 w-32">
                    {/* Placeholder for car image */}
                    <div className="absolute inset-0 bg-gray-200 rounded"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold">Tata Tiago</h3>
                    <p className="text-gray-600">Petrol</p>
                  </div>
                </div>
                <button className="text-red-500 font-medium">CHANGE</button>
              </div>
              
              {cartItems.filter(item => item.isAdded).map(item => (
                <div key={item.id} className="border p-3 rounded-lg mb-4 relative">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.oilType}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 line-through mr-2">₹ {item.originalPrice}</span>
                      <span className="font-semibold">₹ {item.price}</span>
                    </div>
                  </div>
                  <button className="absolute top-3 right-3 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
              
              <div className="bg-gray-800 text-white p-4 rounded flex justify-between items-center mb-6">
                <div>
                  <div className="font-semibold">Membership</div>
                  <div className="mt-2 text-sm">
                    • ₹ 20,000 Annual Savings
                  </div>
                </div>
                <div className="text-sm">
                  <div>Free SOS and much more</div>
                  <div className="flex justify-end mt-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-semibold">Subtotal ({getCartItemCount()} Items)</span>
                  <span className="text-lg font-semibold">₹ {getSubtotal()}</span>
                </div>
                <p className="text-sm text-gray-600">Extra charges may apply</p>
              </div>
              
              <div className="border border-dashed p-3 rounded-lg flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="text-blue-500 mr-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="font-medium">Apply Coupon</span>
                </div>
                <div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
              
              <button className="w-full bg-red-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-600">
                CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarServiceBooking;