"use client"
import { ProviderNotificationListener } from "@/components/NotificationListner";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ProviderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { id, role, location } = useSelector(
    (state: RootState) => state.auth.user
  );
  const providerId = role === "provider" ? id : null;
  const providerLocation = role === "provider" ? location : null;

  return (
    <>
      {providerId && providerLocation && (
        <ProviderNotificationListener
          providerId={providerId}
          providerLocation={providerLocation}
        />
      )}
      <main className="p-6">{children}</main>
    </>
  );
}
