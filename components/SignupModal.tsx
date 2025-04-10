import React,{useState,useEffect} from "react";
import GoogleSignUpButton from './GoogleSignUpButton'

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
    // Implement Google signup logic here
    console.log("Google signup initiated");
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
        
        <form onSubmit={handleSignupSubmit} className="space-y-3">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Full Name</label>
            <input type="text" name="fullName" onChange={handleSignupInputChange} className="w-full p-2 text-sm border border-gray-700 rounded bg-gray-800 text-white" required />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <input type="email" name="email" onChange={handleSignupInputChange} className="w-full p-2 text-sm border border-gray-700 rounded bg-gray-800 text-white" required />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Phone</label>
            <input type="phone" name="phone" onChange={handleSignupInputChange} className="w-full p-2 text-sm border border-gray-700 rounded bg-gray-800 text-white" required />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <input type="password" name="password" onChange={handleSignupInputChange} className="w-full p-2 text-sm border border-gray-700 rounded bg-gray-800 text-white" required />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Confirm Password</label>
            <input type="password" name="confirmPassword" onChange={handleSignupInputChange} className="w-full p-2 text-sm border border-gray-700 rounded bg-gray-800 text-white" required />
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="agreeTerms" onChange={handleSignupInputChange} className="mr-2" required />
            <label className="text-gray-300 text-sm">I agree to the <a href="#" className="text-[#E73C33]">Terms & Conditions</a></label>
          </div>
          <button type="submit" className="w-full bg-[#E73C33] text-white py-2 rounded font-semibold hover:bg-opacity-80 transition text-sm">
            Sign Up
          </button>
          <div className="text-center text-gray-400 text-sm">
            <p>
              Already have an account?{" "}
              <button type="button" className="text-[#E73C33] hover:text-opacity-80" onClick={() => {
                setShowSignupModal(false);
                setShowLoginModal(true);
              }}>
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