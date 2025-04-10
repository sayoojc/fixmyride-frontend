"use client";

interface ServiceProps {
  service: {
    id: number;
    type: string;
    status: string;
    customer: string;
    date: string;
  };
}

export default function ServiceCard({ service }: ServiceProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
      <h2 className="text-xl font-bold mb-2">{service.type}</h2>
      <p className="text-gray-600">Customer: <span className="font-medium">{service.customer}</span></p>
      <p className="text-gray-600">Date: <span className="font-medium">{service.date}</span></p>
      <p className={`mt-2 font-bold 
        ${service.status === "Pending" ? "text-yellow-500" : ""} 
        ${service.status === "Scheduled" ? "text-blue-500" : ""} 
        ${service.status === "In Progress" ? "text-orange-500" : ""} 
        ${service.status === "Ongoing" ? "text-green-500" : ""}`}
      >
        {service.status}
      </p>
    </div>
  );
}
