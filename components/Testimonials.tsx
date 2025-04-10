import React from "react";

interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  { id: 1, name: "John Doe", text: "Amazing service! My car has never run better.", rating: 5 },
  { id: 2, name: "Jane Smith", text: "Fast and professional. Highly recommended!", rating: 4 },
  { id: 3, name: "Mike Johnson", text: "Friendly staff and quality service.", rating: 5 },
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          What Our <span className="text-[#E73C33]">Customers Say</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-900 rounded-lg shadow-md p-6 border-l-4 border-[#E73C33]">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-[#E73C33]">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-semibold text-white">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
