"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Car,
  Wrench,
  Calendar,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  MapPin,
  Menu,
  X,
  Mail,
  Phone,
  Building2,
  Clock,
  Smartphone,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import LoginModal from "../../components/provider/LoginModal"


export default function Home() {
  const router = useRouter()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Appointment Management",
      description: "Streamline your booking process with our easy-to-use appointment scheduling system.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Business Analytics",
      description: "Gain valuable insights into your business performance with detailed analytics and reports.",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile Notifications",
      description: "Keep your customers informed with automated SMS and email notifications.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Customer Management",
      description: "Build stronger relationships with a comprehensive customer management system.",
    },
  ]

  const testimonials = [
    {
      name: "Mike's Auto Repair",
      location: "Chicago, IL",
      content:
        "Since joining the platform, we've seen a 40% increase in new customers. The scheduling system has saved us hours of phone calls every day.",
      rating: 5,
    },
    {
      name: "Premier Car Service",
      location: "Atlanta, GA",
      content:
        "The customer management tools have transformed how we run our business. We're more organized and our customers are happier.",
      rating: 5,
    },
    {
      name: "FastTrack Auto Care",
      location: "Phoenix, AZ",
      content:
        "The analytics dashboard gives us insights we never had before. We've been able to optimize our service offerings based on real data.",
      rating: 4,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Car className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              FixMyRide
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden md:flex items-center gap-8"
          >
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">
              Success Stories
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </a>
          </motion.nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Auth Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center gap-4"
          >
            <Button
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Login
            </Button>
            <Button
                    asChild
                       size="lg"
                     className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                   <Link href="/provider/register">
                     Register Your Business
                     <ArrowRight className="ml-2 h-4 w-4" />
                       </Link>
                        </Button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-100"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                <a href="#features" className="text-gray-700 py-2 border-b border-gray-100">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-700 py-2 border-b border-gray-100">
                  How It Works
                </a>
                <a href="#testimonials" className="text-gray-700 py-2 border-b border-gray-100">
                  Success Stories
                </a>
                <a href="#pricing" className="text-gray-700 py-2 border-b border-gray-100">
                  Pricing
                </a>
                <a href="#contact" className="text-gray-700 py-2 border-b border-gray-100">
                  Contact
                </a>
                <div className="flex gap-4 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      setIsLoginModalOpen(true)
                      setMobileMenuOpen(false)
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    asChild
                       size="lg"
                     className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                   <Link href="/provider/register">
                     Register Your Business
                     <ArrowRight className="ml-2 h-4 w-4" />
                       </Link>
                        </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <motion.span
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4"
                  >
                    For Auto Service Providers
                  </motion.span>
                  <motion.h1
                    className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Grow Your Auto Service <br />
                    <span className="text-blue-600">Business Today</span>
                  </motion.h1>
                </div>
                <motion.p
                  className="text-lg text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Join thousands of auto service centers using our platform to streamline operations, attract new
                  customers, and increase revenue. Our all-in-one solution helps you manage appointments, customers, and
                  business analytics.
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                    <Button
                    asChild
                       size="lg"
                     className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                   <Link href="/provider/register">
                     Register Your Business
                     <ArrowRight className="ml-2 h-4 w-4" />
                       </Link>
                        </Button>
                 
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    Login to Dashboard
                  </Button>
                </motion.div>
                <motion.div
                  className="flex items-center gap-4 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">2,500+</span>
                    <span className="text-gray-600 ml-1">service providers trust us</span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-3 opacity-10"></div>
                <div className="absolute inset-0 bg-blue-600 rounded-3xl -rotate-3 opacity-10"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/placeholder.svg?height=600&width=800"
                    alt="Auto service center with mechanics working"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-full">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-white">
                        <p className="font-medium">Boost Your Business</p>
                        <p className="text-sm opacity-80">Average 35% increase in bookings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Floating cards */}
          <motion.div
            className="hidden md:block absolute top-1/4 -right-16 bg-white p-4 rounded-xl shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Easy Setup</p>
                <p className="text-xs text-gray-500">Get started in less than 15 minutes</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hidden md:block absolute bottom-1/4 -left-16 bg-white p-4 rounded-xl shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Save Time</p>
                <p className="text-xs text-gray-500">Reduce admin work by 75%</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-blue-600">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
              {[
                { value: "2,500+", label: "Service Centers" },
                { value: "1.2M+", label: "Appointments Booked" },
                { value: "35%", label: "Average Growth" },
                { value: "98%", label: "Satisfaction Rate" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
                  <p className="text-blue-100">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
                Platform Features
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our comprehensive platform provides all the tools you need to manage and grow your auto service
                business.
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-blue-200 transition-all"
                >
                  <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center text-blue-600 mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                  <Button variant="link" className="mt-4 p-0 text-blue-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link href={'/provider/register'}>
                Start Your Free Trial
                </Link>
               </Button>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
                Simple Process
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Getting started with AutoCare Pro is quick and easy. Follow these simple steps to transform your
                business.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-blue-200"></div>

              {[
                {
                  step: "01",
                  title: "Register Your Business",
                  description:
                    "Create your account and set up your business profile with service details and location.",
                  icon: <Building2 className="h-6 w-6" />,
                },
                {
                  step: "02",
                  title: "Customize Your Dashboard",
                  description: "Set up your services, pricing, availability, and business hours in your dashboard.",
                  icon: <Wrench className="h-6 w-6" />,
                },
                {
                  step: "03",
                  title: "Start Accepting Bookings",
                  description: "Your business is now live on our platform and ready to receive customer appointments.",
                  icon: <Calendar className="h-6 w-6" />,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative z-10"
                >
                  <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 h-full">
                    <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-6">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
                Success Stories
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Service Providers Say</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Hear from auto service businesses that have transformed their operations with our platform.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
                Pricing Plans
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Choose the plan that works best for your business. All plans include a 14-day free trial.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "$49",
                  description: "Perfect for small service centers",
                  features: [
                    "Up to 100 appointments/month",
                    "Basic customer management",
                    "Email notifications",
                    "Standard support",
                  ],
                  cta: "Start Free Trial",
                  highlighted: false,
                },
                {
                  name: "Professional",
                  price: "$99",
                  description: "Ideal for growing businesses",
                  features: [
                    "Unlimited appointments",
                    "Advanced customer management",
                    "SMS & email notifications",
                    "Priority support",
                    "Business analytics",
                    "Multiple staff accounts",
                  ],
                  cta: "Start Free Trial",
                  highlighted: true,
                },
                {
                  name: "Enterprise",
                  price: "$199",
                  description: "For large service centers",
                  features: [
                    "Everything in Professional",
                    "Multiple location management",
                    "Custom branding",
                    "API access",
                    "Dedicated account manager",
                    "Advanced analytics & reporting",
                  ],
                  cta: "Contact Sales",
                  highlighted: false,
                },
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-xl overflow-hidden ${
                    plan.highlighted
                      ? "shadow-xl border-2 border-blue-500 scale-105 relative"
                      : "shadow-lg border border-gray-100"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="bg-blue-600 text-white text-center py-1 text-sm font-medium">Most Popular</div>
                  )}
                  <div className="bg-white p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-1">/month</span>
                    </div>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        plan.highlighted
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
                      }`}
                      
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Auto Service Business?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of service providers who have increased their bookings, streamlined operations, and grown
                their business with AutoCare Pro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  
                >
                  Register Your Business
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-blue-700"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Login to Dashboard
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-6"
              >
                <div>
                  <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
                    Contact Us
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                  <p className="text-lg text-gray-600">
                    Have questions about our platform or need assistance? Our team is here to help you get started.
                  </p>
                </div>

                <div className="space-y-6 mt-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Our Location</h3>
                      <p className="text-gray-600">123 Business Avenue, Tech Park, TP 12345</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email Us</h3>
                      <p className="text-gray-600">partners@autocarepro.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Call Us</h3>
                      <p className="text-gray-600">(555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <Card className="shadow-lg border-gray-100">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Request a Demo</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Business Name</label>
                        <Input
                          placeholder="Your service center name"
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Full Name</label>
                          <Input placeholder="John Doe" className="border-gray-300 focus:border-blue-500" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Job Title</label>
                          <Input placeholder="Manager" className="border-gray-300 focus:border-blue-500" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Email</label>
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            className="border-gray-300 focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Phone</label>
                          <Input placeholder="(555) 123-4567" className="border-gray-300 focus:border-blue-500" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Business Size</label>
                        <select className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500">
                          <option>1-5 employees</option>
                          <option>6-20 employees</option>
                          <option>21-50 employees</option>
                          <option>50+ employees</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Message</label>
                        <textarea
                          className="w-full min-h-[120px] rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Tell us about your business needs"
                        ></textarea>
                      </div>

                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Schedule Demo</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Car className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-bold">AutoCare Pro</h2>
              </div>
              <p className="text-gray-400 mb-6">
                The all-in-one platform for auto service businesses to manage and grow their operations.
              </p>
              <div className="flex gap-4">
                {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5"></div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Platform</h3>
              <ul className="space-y-3">
                {["Features", "Pricing", "Integrations", "API", "Security", "Support"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                {["Blog", "Case Studies", "Webinars", "Documentation", "Partner Program", "Help Center"].map(
                  (resource) => (
                    <li key={resource}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        {resource}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} AutoCare Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  )
}
