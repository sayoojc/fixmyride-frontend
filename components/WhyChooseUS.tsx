import React from "react";

const whyChooseUsData = [
  { id: 1, icon: "🏆", title: "Certified Technicians", description: "Our team consists of certified professionals with years of experience." },
  { id: 2, icon: "⏱️", title: "Quick Turnaround", description: "We value your time and strive to complete services promptly." },
  { id: 3, icon: "💯", title: "Quality Guarantee", description: "All our services come with a satisfaction guarantee." },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section id="about" className="bg-black py-16 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Why <span className="text-[#E73C33]">Choose Us</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whyChooseUsData.map((item) => (
            <div key={item.id} className="bg-gray-900 rounded-lg shadow p-6 text-center border border-gray-800">
              <div className="text-4xl mb-4 text-[#E73C33]">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
