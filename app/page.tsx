"use client";
import type React from "react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

import createAuthApi from "@/services/authApi";
import { axiosPrivate } from "@/api/axios";
import LoginModal from "@/components/LoginModal";
import SignupModal from "@/components/SignupModal";
import OTPModal from "@/components/OtpModal";
import EmailInputModal from "@/components/EnterEmailModal";
//redux
import { useDispatch } from "react-redux";
import { login } from "@/redux/features/authSlice";
import type { AppDispatch } from "@/redux/store";

import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CarIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  SettingsIcon,
  StarIcon,
  PenToolIcon as ToolIcon,
  TruckIcon,
  WrenchIcon,
} from "lucide-react";
import {
  LoginData,
  SignupData,
  ServiceCardProps,
  TestimonialProps,
} from "@/types/userAuth";
const authApi = createAuthApi(axiosPrivate);
const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
}) => (
  <motion.div
    whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl p-6 shadow-md"
  >
    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);
const Testimonial: React.FC<TestimonialProps> = ({
  name,
  role,
  content,
  rating,
  image,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-white p-6 rounded-xl shadow-md"
  >
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={48}
          height={48}
          className="object-cover w-full h-full"
        />
      </div>
      <div>
        <h4 className="font-bold">{name}</h4>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
    <div className="flex mb-3">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill={i < rating ? "currentColor" : "none"}
        />
      ))}
    </div>
    <p className="text-gray-600 italic">{content}</p>
  </motion.div>
);

const CarServiceLandingPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false);
  const [showOTPModal, setShowOTPModal] = useState<boolean>(false);
  const [showEmailInputModal, setShowEmailInputModal] =
    useState<boolean>(false);
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [signupData, setSignupData] = useState<SignupData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    phone: "",
  });
  const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: inputValue,
    }));
  };
  const handleSignupInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setSignupData((prevState) => ({
      ...prevState,
      [name]: inputValue,
    }));
  };
  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await authApi.loginApi(
        loginData.email,
        loginData.password
      );
      dispatch(
        login({
          id: response.user._id,
          name: response.user.name,
          role: response.user.role,
          email: response.user.email,
        })
      );
      toast.success("Login successful");
      setShowLoginModal(false);
      router.push("/user");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    }
  };

  const handleforgotPassword = async (email: string) => {
    try {
      // await authApi.forgotPasswordApi(email);
      setShowLoginModal(false);
      setShowEmailInputModal(true);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Login failed!");
    }
  };

  const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await authApi.registerTempApi(
        signupData.fullName,
        signupData.email,
        signupData.phone,
        signupData.password
      );
      toast.success("Fill the OTP to continue");
      router.push(
        `/otp?phone=${encodeURIComponent(
          signupData.phone
        )}&email=${encodeURIComponent(signupData.email)}`
      );
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Signup failed!");
    }
  };

  const services = [
    {
      icon: <WrenchIcon className="w-6 h-6" />,
      title: "Regular Maintenance",
      description:
        "Keep your vehicle in top condition with our comprehensive maintenance services.",
    },
    {
      icon: <SettingsIcon className="w-6 h-6" />,
      title: "Engine Diagnostics",
      description:
        "Advanced diagnostic tools to identify and fix engine problems quickly.",
    },
    {
      icon: <ToolIcon className="w-6 h-6" />,
      title: "Brake Service",
      description:
        "Expert brake inspection, repair and replacement for your safety.",
    },
    {
      icon: <TruckIcon className="w-6 h-6" />,
      title: "Towing Service",
      description:
        "24/7 emergency towing service to help you when you need it most.",
    },
    {
      icon: <CarIcon className="w-6 h-6" />,
      title: "Body Repair",
      description:
        "Professional body repair and painting to make your car look like new.",
    },
    {
      icon: <HeartIcon className="w-6 h-6" />,
      title: "Premium Care",
      description:
        "VIP treatment for luxury vehicles with specialized care and attention.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Customer",
      content:
        "The service was exceptional! My car runs better than ever and the staff was incredibly friendly and professional.",
      rating: 5,
      image: "/placeholder.svg?height=48&width=48",
    },
    {
      name: "Michael Chen",
      role: "First-time Customer",
      content:
        "I was impressed by how quickly they diagnosed the issue with my car. Fair pricing and great communication throughout.",
      rating: 4,
      image: "/placeholder.svg?height=48&width=48",
    },
    {
      name: "Emily Rodriguez",
      role: "Business Owner",
      content:
        "They've been maintaining our company fleet for years. Reliable, efficient, and always go the extra mile.",
      rating: 5,
      image: "/placeholder.svg?height=48&width=48",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <WrenchIcon className="w-8 h-8 mr-2" />
              <span className="text-2xl font-bold">FixMyRide</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex space-x-4"
            >
              <Button
                variant="outline"
                className="bg-white text-blue-900 hover:bg-blue-100"
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </Button>
              <Button
                className="bg-white text-blue-900 hover:bg-blue-100"
                onClick={() => setShowSignupModal(true)}
              >
                Sign Up
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="md:w-1/2 mb-10 md:mb-0"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Expert Car Service You Can Trust
              </h1>
              <p className="text-xl mb-8">
                Professional maintenance and repair services to keep your
                vehicle running smoothly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-blue-100"
                  onClick={() => {
                    const servicesSection = document.getElementById("services");
                    servicesSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Our Services
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="md:w-1/2"
            >
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Car Service"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide top-quality service with certified technicians and
              state-of-the-art equipment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <CheckCircleIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Certified Experts</h3>
              <p className="text-gray-600">
                Our technicians are certified and experienced in handling all
                types of vehicles.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <ClockIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quick Service</h3>
              <p className="text-gray-600">
                We value your time and strive to provide efficient service
                without compromising quality.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <MapPinIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multiple Locations</h3>
              <p className="text-gray-600">
                Conveniently located service centers to serve you better,
                wherever you are.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive car care services to keep your vehicle in perfect
              condition.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied
              customers have to say.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Testimonial
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                content={testimonial.content}
                rating={testimonial.rating}
                image={testimonial.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <WrenchIcon className="w-6 h-6 mr-2" />
                <span className="text-xl font-bold">FixMyRide</span>
              </div>
              <p className="text-gray-400 mb-4">
                Professional car service you can trust. Keeping your vehicle in
                perfect condition.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-white"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a href="#booking" className="text-gray-400 hover:text-white">
                    Book Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Regular Maintenance
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Engine Diagnostics
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Brake Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Towing Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Body Repair
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for the latest updates and offers.
              </p>
              <form className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button className="ml-2 bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} FixMyRide. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        setShowSignupModal={setShowSignupModal}
        loginData={loginData}
        handleLoginInputChange={handleLoginInputChange}
        handleLoginSubmit={handleLoginSubmit}
        handleForgotPassword={handleforgotPassword}
      />

      {/* Signup Modal */}
      <SignupModal
        showSignupModal={showSignupModal}
        setShowSignupModal={setShowSignupModal}
        setShowLoginModal={setShowLoginModal}
        signupData={signupData}
        handleSignupInputChange={handleSignupInputChange}
        handleSignupSubmit={handleSignupSubmit}
      />

      {/* Email input modal for the forgot password */}
      {showEmailInputModal && (
        <EmailInputModal setShowEmailInputModal={setShowEmailInputModal} />
      )}

      {/* OTP Modal */}
      {showOTPModal && (
        <OTPModal email={signupData.email} phone={signupData.phone} />
      )}
    </div>
  );
};

export default CarServiceLandingPage;
