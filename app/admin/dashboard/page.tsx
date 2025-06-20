"use client"

import React from 'react';

const AdminDashboard: React.FC = () => {
 
  
 
  return (
    <div className="flex h-screen bg-slate-50">
      <div className="flex-1 md:ml-64 transition-all duration-200 ease-in-out overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Dashboard Overview</h2>
              <p className="text-sm text-slate-500">Welcome back, Admin</p>
            </div>
          </div>
        </header>
        
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          
         
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;