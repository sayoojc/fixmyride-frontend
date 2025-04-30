import React, { useState, useEffect } from "react";
import GoogleSignUpButton from './GoogleSignUpButton'
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { login } from '@/redux/features/authSlice';
import { AppDispatch } from '@/redux/store';
import { z } from 'zod'
import { Spinner } from "@nextui-org/react"; 
import {toast} from 'react-toastify'

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters").max(50, "Full name must be less than 50 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\+?[\d\s-]{10,}$/, "Invalid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface SignupModalProps {
  showSignupModal: boolean;
  setShowSignupModal: (show: boolean) => void;
  setShowLoginModal: (show: boolean) => void;
  signupData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
  };
  handleSignupInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSignupSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const SignupModal: React.FC<SignupModalProps> = ({
  showSignupModal,
  setShowSignupModal,
  setShowLoginModal,
  signupData,
  handleSignupInputChange,
  handleSignupSubmit,
}) => {
  const [animateIn, setAnimateIn] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({}); // State for validation errors
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter(); 

  //redux dispatcher

  const dispatch = useDispatch<AppDispatch>();

  // Handle animation
  useEffect(() => {
    if (showSignupModal) {
      // Slight delay to ensure the modal is rendered before animating
      const timer = setTimeout(() => setAnimateIn(true), 50);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
    }
  }, [showSignupModal]);

  // Handle Google signup
  const handleGoogleSignup = () => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.origin !== process.env.NEXT_PUBLIC_CLIENT_URL) return;
       
      // const data = event.data;
  
      //  dispatch(login({
      //       id:data.id,
      //       name:data.name,
      //       role:data.role,
      //       email:data.email,
      //     }))
     
          router.push("/user");
      window.removeEventListener("message", receiveMessage);
    };
  
    window.addEventListener("message", receiveMessage);
    window.open(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/google?state=user`,
      "_blank",
      "width=500,height=600"
    );
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validate signupData with Zod
    const validation = signupSchema.safeParse(signupData);

    if (!validation.success) {
      // Extract errors and map them to field names
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setIsLoading(true); // Start loader

    // Call the original handleSignupSubmit
    handleSignupSubmit(event);
  };
  if (!showSignupModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-gray-900 rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-700 transform transition-transform duration-300 ease-out ${
          animateIn ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Create Account</h2>
          <button onClick={() => setShowSignupModal(false)} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <GoogleSignUpButton onClick={handleGoogleSignup} />

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-3">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={signupData.fullName}
              onChange={handleSignupInputChange}
              className="w-full p-2 text-sm border border-gray-700 rounded bg-gray-800 text-white"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={signupData.email}
              onChange={handleSignupInputChange}
              className="w-full p-2 text-sm border border-gray-700 rounded bg-gray-800 text-white"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Phone</label>
            <input
              type="phone"
              name="phone"
              value={signupData.phone}
              onChange={handleSignupInputChange}
              className="w-full p-2 text-sm border border-gray-700 rounded bg-gray-800 text-white"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={signupData.password}
              onChange={handleSignupInputChange}
              className="w-full p-2 text-sm border border-gray-700 rounded bg-gray-800 text-white"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={signupData.confirmPassword}
              onChange={handleSignupInputChange}
              className="w-full p-2 text-sm border border-gray-700 rounded bg-gray-800 text-white"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E73C33] text-white py-2 rounded font-semibold hover:bg-opacity-80 transition text-sm flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Spinner color="white" size="sm" className="mr-2" />
                Processing...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
          <div className="text-center text-gray-400 text-sm">
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="text-[#E73C33] hover:text-opacity-80"
                onClick={() => {
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                }}
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;