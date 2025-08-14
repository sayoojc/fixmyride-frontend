"use client";

import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import createAuthApi from "@/services/authApi";
import { axiosPrivate } from "@/api/axios";

const authApi = createAuthApi(axiosPrivate);

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(60);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Create refs for each input
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(0, 1);
    setOtp(newOtp);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    setIsLoading(true);
    try {
      await authApi.registerApi(otpValue, email, phone);
      toast.success("Signup success");
      router.push("/user");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Signup failed!");
    } finally {
      setIsLoading(false);
    }
  };
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(""));
      if (inputRefs.current[5]) {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(60);
    toast.success("New OTP has been sent!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="relative bg-gray-900 rounded-2xl p-6 shadow-2xl border border-violet-500/20">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-violet-600/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-violet-600/20 rounded-full blur-xl"></div>

          <div className="relative z-10">
            <div className="flex justify-center items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-violet-900/50 flex items-center justify-center">
                <span className="text-xl">🔒</span>
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Verification Code
              </h2>
              <p className="text-violet-200/70 mt-2 text-sm">
                Enter the 6-digit code we sent to {email || phone}
              </p>
            </div>

            <div className="flex justify-center space-x-2 mb-8">
              {otp.map((digit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <input
                    type="text"
                    value={digit}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-10 h-12 text-center text-xl font-semibold bg-gray-800 text-white border border-violet-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200"
                    maxLength={1}
                    aria-label={`Digit ${index + 1}`}
                    disabled={isLoading}
                  />
                </motion.div>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className={`w-full py-3 px-4 ${
                isLoading
                  ? "bg-violet-700/70"
                  : "bg-violet-700 hover:bg-violet-600"
              } text-white rounded-lg font-semibold transition duration-200 flex items-center justify-center`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Verify
                </>
              )}
            </motion.button>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Didn't receive the code?
                {timer > 0 ? (
                  <span className="text-gray-400 ml-2">Resend in {timer}s</span>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-violet-400 hover:text-violet-300 transition-colors font-medium ml-2"
                    disabled={isLoading}
                  >
                    Resend
                  </button>
                )}
              </p>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.back()}
                className="text-violet-400 hover:text-violet-300 transition-colors text-sm"
                disabled={isLoading}
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
