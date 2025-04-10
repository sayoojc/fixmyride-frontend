const ContactSection = () => {
    return (
      <section id="contact" className="py-16 bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Contact <span className="text-[#E73C33]">Us</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ContactCard
              icon="📍"
              title="Our Location"
              content="123 Service Street, Autoville, AV 12345"
            />
            <ContactCard icon="📞" title="Phone" content="(555) 123-4567" />
            <ContactCard icon="📧" title="Email" content="service@turbomech.com" />
          </div>
        </div>
      </section>
    );
  };
  
  const ContactCard = ({ icon, title, content }) => {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow text-center border border-gray-700">
        <div className="text-3xl text-[#E73C33] mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
        <p className="text-gray-300">{content}</p>
      </div>
    );
  };
  
  export default ContactSection;
  