import React from 'react';

interface MainContentProps {
  setShowLoginModal: (value: boolean) => void;  // Explicitly type the prop
}

const MainContent: React.FC<MainContentProps> = ({ setShowLoginModal }) => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Portal</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Welcome to the admin portal for FixMyRide. This area is restricted to authorized personnel only.
          Please log in to access the admin dashboard.
        </p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium text-lg transition-colors"
        >
          Admin Login
        </button>
      </div>
    </main>
  );
};

export default MainContent;
