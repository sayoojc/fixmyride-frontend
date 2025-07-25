"use client";

import type React from "react";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { axiosPrivate } from "@/api/axios";
import createAuthApi from "@/services/authApi";
import GoogleSignupButton from "@/components/GoogleSignUpButton";
import { MapPin, Home, Briefcase, Map } from "lucide-react";
import dynamic from "next/dynamic";
import { useJsApiLoader } from "@react-google-maps/api";
const authApi = createAuthApi(axiosPrivate);

const MapPicker = dynamic(() => import("../../../components/user/MapPicker"), {
  ssr: false,
});

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Building2,
  Mail,
  Phone,
  MapPinned,
  Lock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signupSchema } from "@/validations/providerSignupValidation";

type SignupFormData = z.infer<typeof signupSchema>;

export default function ServiceProviderSignupPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 3;

  const router = useRouter();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      latitude: 0,
      longitude: 0,
      address: {
        street: "",
        city: "",
        state: "",
        pinCode: "",
      },
    },
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places", "marker"],
  });

  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  useEffect(() => {
    if (isLoaded && !geocoder) {
      setGeocoder(new window.google.maps.Geocoder());
    }
  }, [isLoaded, geocoder]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          form.setValue('latitude',position.coords.latitude);
          form.setValue('longitude',position.coords.longitude);
          if (geocoder) {
            geocoder.geocode(
              {
                location: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
              },
              (results, status) => {
                if (status === "OK" && results && results[0]) {
                  updateAddressFromGeocode(results[0]);
                }
              }
            );
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setCurrentLocation({ lat: 28.6139, lng: 77.209 });
        }
      );
    }
  }, [geocoder]);
  const updateAddressFromGeocode = useCallback(
    (result: google.maps.GeocoderResult) => {
      let street = "";
      let city = "";
      let state = "";
      let zipCode = "";
      const addressLine1 = result.formatted_address;

      for (const component of result.address_components) {
        if (
          component.types.includes("street_number") ||
          component.types.includes("route")
        ) {
          street += component.long_name + " ";
        }
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          state = component.long_name;
        }
        if (component.types.includes("postal_code")) {
          zipCode = component.long_name;
        }
      }
      const lat = result.geometry.location.lat();
      const lng = result.geometry.location.lng();

      form.setValue("latitude",lat);
      form.setValue("longitude",lng);
      form.setValue("address.street", street.trim());
      form.setValue("address.city", city);
      form.setValue("address.state", state);
      form.setValue("address.pinCode", zipCode);
    },
    []
  );

  const handleMarkerDrag = useCallback(
    (lat: number, lng: number) => {
      if (geocoder) {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            updateAddressFromGeocode(results[0]);
          }
        });
      }
    },
    [geocoder, updateAddressFromGeocode]
  );

  const onSubmit = async (data: SignupFormData): Promise<void> => {
    setIsSubmitting(true);
    setError(null);
    setEmail(data.email);
    setPhone(data.phone);
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...submissionData } = data;
      const response: unknown = await authApi.providerRegisterTempApi(
        submissionData
      );
      toast.success("Enter OTP to continue");
      console.log("Email before router.push:", data.email);
      router.push(
        `/provider/register/otp?email=${data.email}&phone=${data.phone}`
      );
      form.reset();
    } catch (err: unknown) {
      setError("An error occurred while registering. Please try again.");
      toast.error("error submitting form ");
      console.error("Error submitting form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = (): void => {
    const receiveMessage = (
      event: MessageEvent<{ [key: string]: string }>
    ): void => {
      if (event.origin !== process.env.NEXT_PUBLIC_BACKEND_URL) return;

      router.push("/provider");
      window.removeEventListener("message", receiveMessage);
    };

    window.addEventListener("message", receiveMessage);
    window.open(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/google?state=provider`,
      "_blank",
      "width=500,height=600"
    );
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  if (success) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-md w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        ></motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-3xl font-bold text-gray-900 sm:text-3xl">
            Service Provider Registration
          </p>
        </motion.div>

        <div className="flex items-center justify-center mb-8">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  currentStep > index + 1
                    ? "bg-blue-600 text-white"
                    : currentStep === index + 1
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-gray-100 text-gray-500"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {currentStep > index + 1 ? (
                  <Check className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </motion.div>
              {index < totalSteps - 1 && (
                <motion.div
                  className={cn(
                    "h-1 w-16 mx-1",
                    currentStep > index + 1 ? "bg-blue-600" : "bg-gray-200"
                  )}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                />
              )}
            </div>
          ))}
        </div>

        <motion.div
          className="bg-white shadow-xl rounded-xl overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white">
              {currentStep === 1
                ? "Business Information"
                : currentStep === 2
                ? "Location Details"
                : "Account Security"}
            </h2>
            <p className="mt-2 text-blue-100">
              {currentStep === 1
                ? "Tell us about your business"
                : currentStep === 2
                ? "Where is your service center located?"
                : "Set up your account credentials"}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {currentStep === 1 && (
                  <motion.div
                    className="space-y-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    key="step1"
                  >
                    <motion.div variants={staggerItem}>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 flex items-center">
                              <Building2 className="mr-2 h-4 w-4 text-blue-600" />
                              Business Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your service center name"
                                {...field}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div variants={staggerItem}>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 flex items-center">
                                <Mail className="mr-2 h-4 w-4 text-blue-600" />
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="email@example.com"
                                  {...field}
                                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                                />
                              </FormControl>
                              <FormDescription className="text-xs text-gray-500">
                                This will be used for account verification
                              </FormDescription>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={staggerItem}>
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 flex items-center">
                                <Phone className="mr-2 h-4 w-4 text-blue-600" />
                                Phone Number
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="(+91) 9544381407"
                                  {...field}
                                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    className="space-y-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    key="step2"
                  >
                    <motion.div variants={staggerItem}>
                      {isLoaded && currentLocation && (
                        <div className="space-y-2">
                          {/* <Label className="text-gray-600 text-sm font-medium">Select Location on Map</Label> */}
                          <div className="h-80 w-full rounded-lg overflow-hidden border">
                            <MapPicker
                              initialLocation={currentLocation}
                              onMarkerDrag={handleMarkerDrag}
                            />
                          </div>
                        </div>
                      )}
                      <FormField
                        control={form.control}
                        name="address.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 flex items-center">
                              <MapPinned className="mr-2 h-4 w-4 text-blue-600" />
                              Street Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Main Street"
                                {...field}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div
                      variants={staggerItem}
                      className="grid md:grid-cols-3 gap-6"
                    >
                      <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              City
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Anytown"
                                {...field}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              State
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="CA"
                                {...field}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.pinCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              Zip Code
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="670595"
                                {...field}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    className="space-y-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    key="step3"
                  >
                    <motion.div
                      variants={staggerItem}
                      className="flex items-center mb-4"
                    >
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Lock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Secure Your Account
                        </h3>
                        <p className="text-sm text-gray-500">
                          Create a strong password to protect your account
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={staggerItem}
                      className="grid md:grid-cols-2 gap-6"
                    >
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter password"
                                  {...field}
                                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription className="text-xs text-gray-500">
                              Must be at least 8 characters with uppercase,
                              lowercase, and number
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  placeholder="Confirm password"
                                  {...field}
                                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div
                      variants={staggerItem}
                      className="mt-8 pt-6 border-t border-gray-200"
                    >
                      <div className="text-center mb-4">
                        <span className="text-sm text-gray-500">
                          Or register with
                        </span>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <GoogleSignupButton onClick={handleGoogleSignup} />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}

                <motion.div
                  className="flex justify-between mt-8 pt-6 border-t border-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {currentStep > 1 ? (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50 flex items-center"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                    </motion.div>
                  ) : (
                    <div></div>
                  )}

                  {currentStep < totalSteps ? (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Registering...
                          </div>
                        ) : (
                          "Register Service Center"
                        )}
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </form>
            </Form>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Already have an account?{" "}
          <Button
            variant="link"
            className="text-blue-600 p-0"
            onClick={() => router.push("/provider/login")}
          >
            Sign in
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
