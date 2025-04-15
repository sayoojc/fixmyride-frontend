import React, { useState, FormEvent } from "react";
import createAuthApi from "@/services/authApi";
import { axiosPrivate } from "@/api/axios";
import { AxiosError } from "axios";
import Loader from "./Loader";

const authApi = createAuthApi(axiosPrivate);



const EmailInputModal: React.FC<any> = ({setShowEmailInputModal,email,setEmail}) => {
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      // Example API call
      const response = await authApi.forgotPasswordApi(email);
     alert(response.message);
     setShowEmailInputModal(false);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError?.response?.data as string || "Something went wrong");
    }
  };

 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Enter your email</h2>
          <button
           
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-500 mb-2">{error}</div>}

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="example@email.com"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailInputModal;
