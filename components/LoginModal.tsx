import React from "react";
import createAuthApi from "@/services/authApi";
import { axiosPrivate } from "@/api/axios";
import { AxiosError } from "axios";



interface LoginModalProps {
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  setShowSignupModal: (show: boolean) => void;
  loginData: {
    email: string;
    password: string;
    rememberMe: boolean;
  };
  handleLoginInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoginSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleForgotPassword:(email:string) => void
}



const LoginModal: React.FC<LoginModalProps> = ({
  showLoginModal,
  setShowLoginModal,
  setShowSignupModal,
  loginData,
  handleLoginInputChange,
  handleLoginSubmit,
  handleForgotPassword
}) => {
  if (!showLoginModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Login</h2>
          <button
            onClick={() => setShowLoginModal(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleLoginSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginInputChange}
              className="w-full p-3 border border-gray-700 rounded bg-gray-800 text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginInputChange}
              className="w-full p-3 border border-gray-700 rounded bg-gray-800 text-white"
              required
            />
          </div>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              name="rememberMe"
              checked={loginData.rememberMe}
              onChange={handleLoginInputChange}
              className="mr-2"
            />
            <label className="text-gray-300">Remember me</label>
          </div>
          <button
            type="submit"
            className="w-full bg-[#E73C33] text-white py-3 rounded font-semibold hover:bg-opacity-80 transition"
          >
            Login
          </button>
          <div className="mt-4 text-center text-gray-400">
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="text-[#E73C33] hover:text-opacity-80"
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
              >
                Sign up
              </button>
            </p>
            <p className="mt-2">
              <a className="text-[#E73C33] hover:text-opacity-80 cursor-pointer" onClick={() =>handleForgotPassword(loginData.email)}>
                Forgot password?
              </a>
              </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
