import React from 'react';

interface AdminHeaderProps {
  setShowLoginModal: (value: boolean) => void;  // Explicitly type the prop
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ setShowLoginModal }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">FixMyRide Admin</h1>
        </div>
        <button
          onClick={() => setShowLoginModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Admin Login
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
