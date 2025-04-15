import React,{useState} from 'react'



export const CartSummary = () => {
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
      const getSubtotal = () => {
        return cartItems.filter(item => item.isAdded).reduce((sum, item) => sum + item.price, 0);
      };
    
      const getCartItemCount = () => {
        return cartItems.filter(item => item.isAdded).length;
      };
  return (
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
  )
}
