"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import createAuthApi from '@/services/authApi';
import { axiosPrivate } from '@/api/axios';

import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import WhyChooseUs from '@/components/WhyChooseUS';
import Testimonials from '@/components/Testimonials';
import ContactSection from '../components/ContactSection'
import Header from '@/components/Header';
import LoginModal from '@/components/LoginModal';
import SignupModal from '@/components/SignupModal';
import OTPModal from '@/components/OtpModal';
import EmailInputModal from '@/components/EnterEmailModal';

// imports for redux
import { useDispatch} from 'react-redux';
import { login } from '@/redux/features/authSlice';
import { AppDispatch } from '@/redux/store';


import { toast } from 'react-toastify';


const authApi = createAuthApi(axiosPrivate);

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  vehicle?: string;
  message: string;
}

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone:string;
  agreeTerms: boolean;
}

const CarServiceLandingPage: React.FC = () => {
  const router = useRouter(); 

  //redux dispatcher

  const dispatch = useDispatch<AppDispatch>();

  
  // Auth modal states
  const [email,setEmail] = useState('');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false);
  const [showOTPModal, setShowOTPModal] = useState<boolean>(false); // OTP Modal state
  const [showEmailInputModal,setShowEmailInputModal] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [signupData, setSignupData] = useState<SignupData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    phone:''
  });


  const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setLoginData(prevState => ({
      ...prevState,
      [name]: inputValue
    }));
  };

  const handleSignupInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setSignupData(prevState => ({
      ...prevState,
      [name]: inputValue
    }));
  };
  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
     const response =  await authApi.loginApi(loginData.email, loginData.password);
     console.log('The response.user after the login',response.user);
     dispatch(login({
      id:response.user._id,
      name:response.user.name,
      role:response.user.role,
      email:response.user.email,

     }))
      alert("Login successful!");
      setShowLoginModal(false);
      router.push("/user");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || "Login failed. Please try again.";
console.log('the message',err);
      toast.error(message);

    
    }
  };

    const handleforgotPassword = async (email:string) => {
    
      try {
        // await authApi.forgotPasswordApi(email);
        setShowLoginModal(false);
        setShowEmailInputModal(true);
       
        
       
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        console.error("Login failed:", err.response?.data?.message || "Something went wrong");
        alert(err.response?.data?.message || "Login failed!");
      }
    };


  const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await authApi.registerTempApi(
        signupData.fullName,
        signupData.email,
        signupData.phone,
        signupData.password
      );
      alert("Signup successful!");
      setShowSignupModal(false);
      setShowOTPModal(true);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error("Signup failed:", err.response?.data?.message || "Something went wrong");
      alert(err.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900"> 
   <Header setShowLoginModal={setShowLoginModal}setShowSignupModal={setShowSignupModal} />
   <Hero/>
   <Services/>
   <WhyChooseUs/>
   <Testimonials/>
   <ContactSection/>
   <Footer/>
   {/* Login Modal */}
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        setShowSignupModal={setShowSignupModal}
        loginData={loginData}
        handleLoginInputChange={handleLoginInputChange}
        handleLoginSubmit={handleLoginSubmit}
        handleForgotPassword ={handleforgotPassword}
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

{/*email input modal for the forgot password */}

{showEmailInputModal && <EmailInputModal 
setShowEmailInputModal={setShowEmailInputModal} 
email = {email} 
setEmail = {setEmail}/>}

 {/* OTP Modal */}
 {showOTPModal && <OTPModal email = {signupData.email} phone = {signupData.phone} />}
    </div>
  );
};

export default CarServiceLandingPage;