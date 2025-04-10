import React from "react";

interface HeaderProps {
  setShowLoginModal: (show: boolean) => void;
  setShowSignupModal: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setShowLoginModal, setShowSignupModal }) => {
  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">FixMyRide</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <NavLink href="#services">Services</NavLink>
          <NavLink href="#about">About Us</NavLink>
          <NavLink href="#testimonials">Testimonials</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </nav>
        <div className="flex space-x-4 items-center">
          <button
            onClick={() => setShowLoginModal(true)}
            className="text-white hover:text-[#E73C33] transition"
          >
            Login
          </button>
          <button
            onClick={() => setShowSignupModal(true)}
            className="bg-[#E73C33] text-white px-4 py-2 rounded hover:bg-opacity-80 transition"
          >
            Sign Up
          </button>
          <button className="md:hidden text-2xl">☰</button>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <a href={href} className="hover:text-[#E73C33] transition">
    {children}
  </a>
);

export default Header;
