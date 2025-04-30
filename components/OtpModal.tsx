"use client"
import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react';
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import createAuthApi from '@/services/authApi';
import { axiosPrivate } from '@/api/axios';
const authApi = createAuthApi(axiosPrivate);
import { toast } from 'react-toastify'

interface OTPModalProps {
  email: string;
  phone: string
}

const OTPModal: React.FC<OTPModalProps> = ({ email, phone }) => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60); // Timer state
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Create refs for each input
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Simulate modal appearing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number): void => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(0, 1);
    setOtp(newOtp);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }
    
    setIsLoading(true); // Show loader
    
    try {
      await authApi.registerApi(otpValue, email, phone);
      toast.success('Signup success');
      router.push("/user");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error("Signup Error:", err.response?.data?.message || "Something went wrong");
      toast.error(err.response?.data?.message || "Signup failed!");
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
      if (inputRefs.current[5]) {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(60); // Restart timer
    toast.success('New OTP has been sent!');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-transparent"></div>

      {/* Loader overlay - appears on top when isLoading is true */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-5 rounded-lg flex flex-col items-center">
            <div className="spinner-border animate-spin inline-block w-10 h-10 border-4 rounded-full border-t-transparent border-purple-500" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="text-white mt-3">Verifying...</p>
          </div>
        </div>
      )}

      <div className={`relative w-full max-w-md ${isVisible ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-500 ease-in-out`}>
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 w-full border border-gray-700">
          <div className="text-center mb-6">
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-100">Verification Code</h2>
            <p className="text-gray-400 mt-2">Enter the 6-digit code we sent to your device</p>
          </div>

          <div className="flex justify-center space-x-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                ref={(el) => { inputRefs.current[index] = el; }}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-14 text-center text-xl font-semibold bg-gray-800 text-gray-100 border-2 border-gray-700 rounded-md focus:border-purple-500 focus:outline-none"
                maxLength={1}
                aria-label={`Digit ${index + 1}`}
                disabled={isLoading} // Disable inputs during loading
              />
            ))}
          </div>

          <button 
            onClick={() => { console.log("Button clicked!"); handleSubmit(); }}
            className={`w-full py-3 ${isLoading ? 'bg-purple-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition`}
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>

          <div className="mt-4 text-center">
            <p className="text-gray-400">
              Didn't receive the code? 
              {timer > 0 ? (
                <span className="text-gray-400 ml-2">Resend in {timer}s</span>
              ) : (
                <button 
                  onClick={handleResend} 
                  className="text-purple-400 font-medium hover:text-purple-300 ml-2"
                  disabled={isLoading} // Disable resend during loading
                >
                  Resend
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;