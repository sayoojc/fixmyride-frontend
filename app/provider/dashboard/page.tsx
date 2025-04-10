"use client";

import Navbar from "../../../components/provider/Navbar";
import ServiceCard from "../../../components/provider/ServiceCard";
import Profile from "../../../components/provider/Profile";

export default function Dashboard() {
  // Mock data for the dashboard
  const services = [
    { id: 1, type: "Service Request", status: "Pending", customer: "John Doe", date: "2025-04-01" },
    { id: 2, type: "Scheduled Service", status: "Scheduled", customer: "Alice Johnson", date: "2025-04-05" },
    { id: 3, type: "Emergency Request", status: "In Progress", customer: "Mark Spencer", date: "2025-03-29" },
    { id: 4, type: "Ongoing Service", status: "Ongoing", customer: "Emma Watson", date: "2025-03-30" }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Car Service Dashboard</h1>

        {/* Services Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Profile Section */}
        <Profile />
      </main>

      <footer className="p-4 text-center bg-gray-800 text-white">
        <p>© 2025 Car Service Provider. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
