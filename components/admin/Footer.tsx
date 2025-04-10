import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center">
          &copy; {new Date().getFullYear()} Vehicle Service Pro Admin Portal. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
