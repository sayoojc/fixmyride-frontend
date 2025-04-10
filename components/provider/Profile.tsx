"use client";

export default function Profile() {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Provider Profile</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> john.doe@example.com</p>
          <p><strong>Phone:</strong> (123) 456-7890</p>
        </div>
        <div>
          <p><strong>Location:</strong> New York, NY</p>
          <p><strong>Experience:</strong> 5+ years</p>
          <p><strong>Rating:</strong> ⭐⭐⭐⭐⭐</p>
        </div>
      </div>
    </section>
  );
}
