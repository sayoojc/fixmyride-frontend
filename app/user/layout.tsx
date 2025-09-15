"use client"
import { Header } from "@/components/user/Header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserNotificationListener} from "@/components/NotificationListner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const userId = useSelector((state: RootState) => state.auth.user.id);

  return (
    
  <>
   <Header/>
   {userId && <UserNotificationListener userId={userId} />}
        {children}  
    <ToastContainer position="top-right" autoClose={3000} />
  </> 
  );
}
