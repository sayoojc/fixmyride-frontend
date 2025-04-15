import React, { useState } from 'react';

export const ServicePackages = () => {
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
        'Car Wash',
      ],
      moreFeatures: 10,
      oilType: 'Mobil 5W40 Semi Synthetic',
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
        'Interior Vacuuming ( Carpet & Seats )',
      ],
      moreFeatures: 4,
    },
  ]);

  return (
    <div className="lg:col-span-2 space-y-6">
      {cartItems.map((service) => (
        <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div
            className={`px-2 py-1 text-white w-max ${service.id === 1 ? 'bg-green-500' : 'hidden'}`}
          >
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
                  • {service.warranty} • {service.recommendation}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  {service.features.slice(0, 5).map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <svg
                        className="w-5 h-5 text-green-500 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
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
                <span className="text-gray-400 line-through mr-2">
                  Rs. {service.originalPrice}
                </span>
                <span className="text-2xl font-bold">₹ {service.price}</span>
              </div>

              {service.isAdded ? (
                <div className="flex items-center text-green-500">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
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
  );
};