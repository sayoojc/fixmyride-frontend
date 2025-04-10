 
 import React,{useState} from 'react';
 import { Calendar, BarChart, Settings, Users, Wrench, Car, Menu, X, LogOut } from 'lucide-react';

 const DashboardSidebar: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ Fix: Added state

 
 return (

    <>
     {/* Mobile sidebar toggle */}
 <div className="md:hidden fixed top-4 left-4 z-50">
 <button 
   onClick={() => setSidebarOpen(!sidebarOpen)} 
   className="p-2 rounded-md bg-white shadow-md"
 >
   {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
 </button>
</div>

{/* Sidebar */}
<div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-white border-r border-gray-200`}>
 <div className="flex flex-col h-full">
   <div className="px-4 py-6 border-b border-gray-200">
     <h1 className="text-xl font-bold text-gray-800">VehicleService Pro</h1>
     <p className="text-sm text-gray-500">Admin Dashboard</p>
   </div>
   
   <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
     <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-blue-50 text-blue-600">
       <Calendar className="mr-3 h-5 w-5" />
       Dashboard
     </a>
     <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
       <Car className="mr-3 h-5 w-5" />
       Appointments
     </a>
     <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
       <Users className="mr-3 h-5 w-5" />
       Customers
     </a>
     <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
       <Wrench className="mr-3 h-5 w-5" />
       Services
     </a>
     <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
       <BarChart className="mr-3 h-5 w-5" />
       Reports
     </a>
     <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
       <Settings className="mr-3 h-5 w-5" />
       Settings
     </a>
   </nav>
   
   <div className="p-4 border-t border-gray-200">
     <a href="#" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
       <LogOut className="mr-3 h-5 w-5" />
       Logout
     </a>
   </div>
 </div>
</div>
    </>
 

 )

}

export default DashboardSidebar