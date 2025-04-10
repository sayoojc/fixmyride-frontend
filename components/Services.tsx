
import React, { useState } from "react";
const services: Service[] = [
    {
      id: 1,
      name: 'Oil Change',
      description: 'Regular oil changes to keep your engine running smoothly.',
      icon: '🔧',
      price: 'From $39.99'
    },
    {
      id: 2,
      name: 'Brake Service',
      description: 'Inspection and replacement of brake pads, rotors, and fluid.',
      icon: '🛑',
      price: 'From $129.99'
    },
    {
      id: 3,
      name: 'Tire Rotation',
      description: 'Even out tire wear and extend the life of your tires.',
      icon: '🔄',
      price: 'From $29.99'
    },
    {
      id: 4,
      name: 'Full Inspection',
      description: 'Comprehensive vehicle inspection to identify potential issues.',
      icon: '🔍',
      price: 'From $89.99'
    },
  ];


// Define the type for a service
interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  icon:React.ReactNode;
}


const Services: React.FC = () => {
  const [activeService, setActiveService] = useState<number | null>(null);

  return (
    <section id="services" className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Our <span className="text-[#E73C33]">Services</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-gray-900 rounded-lg shadow-md p-6 hover:shadow-[#E73C33]/50 hover:shadow-lg transition cursor-pointer border border-gray-700"
              onClick={() =>
                setActiveService(activeService === service.id ? null : service.id)
              }
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{service.name}</h3>
              <p className="text-gray-400 mb-4">{service.description}</p>
              <p className="font-bold text-[#E73C33]">{service.price}</p>
              {activeService === service.id && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <a
                    href="#booking"
                    className="block w-full bg-[#E73C33] text-white text-center py-2 rounded hover:bg-opacity-80 transition"
                  >
                    Book This Service
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
