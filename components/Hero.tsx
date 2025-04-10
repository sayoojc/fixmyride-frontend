import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-gray-900 to-black text-white py-16 border-b-4 border-[#E73C33]">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Left Section: Text Content */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            High-Performance <span className="text-[#E73C33]">Auto Care</span>
          </h1>
          <p className="text-xl mb-6">
            Expert car servicing with state-of-the-art equipment and certified technicians.
          </p>
          <div className="flex space-x-4">
            {/* <a href="#booking" className="bg-[#E73C33] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-80 transition">Book Now</a> */}
            <a href="#services" className="border-2 border-[#E73C33] px-6 py-3 rounded-lg font-semibold hover:bg-[#E73C33] transition">
              Our Services
            </a>
          </div>
        </div>

        {/* Right Section: Image */}
        <div className="md:w-1/2">
          <img src="/api/placeholder/600/400" alt="Mechanic servicing a car" className="rounded-lg shadow-lg" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
