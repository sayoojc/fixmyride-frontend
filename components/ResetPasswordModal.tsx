import React, { useState, FormEvent } from 'react';
import createAuthApi from '@/services/authApi';
import { axiosPrivate } from '@/api/axios';

const authApi = createAuthApi(axiosPrivate);

interface ResetPasswordModalProps {
  show: boolean;
  handleClose: () => void;
  handleReset: (  otp: string, newPassword: string ) => void;
  email:string
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  show,
  handleClose,
  handleReset,
  email
}) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    console.log('The email',email);
     await authApi.resetPasswordApi(otp,newPassword,email);

    handleReset( otp, newPassword );

    // Clear and close
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    handleClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-2xl">
          <h2 className="text-lg font-semibold">Reset Your Password</h2>
          <button onClick={handleClose} className="text-white hover:text-gray-200 text-xl font-bold">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
