"use client"
export default function Footer() {

      const serviceCategories = [
        { id: 1, name: "Periodic Services" },
        { id: 2, name: "AC Service & Repair" },
        { id: 3, name: "Batteries" },
        { id: 4, name: "Tyres & Wheel Care" },
        { id: 5, name: "Denting & Painting" },
        { id: 6, name: "Car Inspections" },
        { id: 7, name: "Insurance Claims" },
        { id: 8, name: "SOS Service"},
      ];

    return (
        <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm font-bold mb-4 uppercase">About Us</h4>
              <p className="text-xs">Your trusted car repair partner.</p>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4 uppercase">Services</h4>
              <ul className="text-xs space-y-2">
                {serviceCategories.map((service) => (
                  <li key={service.id}>{service.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4 uppercase">Contact</h4>
              <p className="text-xs">support@fixmyride.com</p>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-4 uppercase">Follow Us</h4>
              <p className="text-xs">Social Media Links</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  