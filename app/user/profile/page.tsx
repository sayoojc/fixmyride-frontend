"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import createUserApi from "@/services/userApi";
import { axiosPrivate } from "@/api/axios";
import { AxiosError } from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Check,
  User,
  MapPin,
  Car,
  Shield,
  Edit,
} from "lucide-react";
import AddAddressModal from "@/components/user/AddAddressModal";
import AddVehicleModal from "@/components/user/AddVehicleModal";
import EditVehicleModal from "@/components/user/EditVehicleModal";
import EditAddressModal from "@/components/user/EditAddressModal";
import { toast } from "react-toastify";
import type { User as UserType, Address } from "../../../types/user";
import { updateProfileSchema } from "../../../validations/profileValidation";
import z from "zod";
import {
  ConfirmationModal,
  ConfirmationConfig,
} from "@/components/ConfirmationModal";
import { IVehicle, EditVehicleFormData } from "@/types/vehicle";
const userApi = createUserApi(axiosPrivate);

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const CustomerProfile = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [addAddressModalOpen, setAddAddressModalOpen] =
    useState<boolean>(false);
  const [addVehicleModalOpen, setAddVehicleModalOpen] =
    useState<boolean>(false);
  const [editVehicleModalOpen, setEditVehicleModalOpen] =
    useState<boolean>(false);
  const [editAddressModalOpen, setEditAddressModalOpen] =
    useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | null>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmationConfig | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      setIsDeleting(true);
      const response = await userApi.deleteVehicleApi(vehicleId);
      if (response.success) {
        toast.success("Vehicle deleted successfully");
        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            vehicles: prev.vehicles.filter(
              (vehicle) => vehicle._id !== vehicleId
            ),
          };
        });
      } else {
        toast.error("Deleting vehicle failed");
      }
    } catch (error) {
      toast.error("Deleting vehicle failed");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await userApi.getProfileDataApi();
        setUser(response.user);
        setName(response.user.name);
        setPhone(response.user.phone);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const response = await userApi.setDefaultAddress(addressId);
      if (response.status === 200) {
        toast.success("Default address updated successfully!");
        setUser((prevUser) => {
          if (!prevUser) return prevUser;
          const updatedAddresses = prevUser.addresses.map((address) => ({
            ...address,
            isDefault: address.id === addressId,
          }));
          return {
            ...prevUser,
            addresses: updatedAddresses,
            defaultAddress: addressId,
          };
        });
      } else {
        toast.error("Failed to update default address.");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Something went wrong while setting default address.");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await userApi.deleteAddress(addressId);
      if (response?.status === 200) {
        toast.success("Address deleted successfully!");
        setUser((prevUser) => {
          if (!prevUser) return prevUser;
          const updatedAddresses = prevUser.addresses.filter(
            (addr) => addr.id !== addressId
          );
          const isDeletedDefault = prevUser.defaultAddress === addressId;

          return {
            ...prevUser,
            addresses: updatedAddresses,
            defaultAddress: isDeletedDefault
              ? updatedAddresses[0]?.id || ""
              : prevUser.defaultAddress,
          };
        });
      } else {
        toast.error("Failed to delete address.");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting address.");
    }
  };

  const updateProfile = async (
    phone: string,
    userId: string,
    userName: string
  ) => {
    try {
      const validatedData = updateProfileSchema.parse({
        phone,
        userId,
        userName,
      });

      const response = await userApi.updateProfileApi(
        validatedData.phone,
        validatedData.userName
      );

      if (response.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
       const err = error as AxiosError<{message:string}>;
       toast.error(err.response?.data.message || "Something went wrong")
    }
  };

  const toggleEdit = async () => {
    if (isEditing) {
      if (user) {
        await updateProfile(phone, user.id, name);
      } else {
        toast.error("User not found. Please log in again.");
        return;
      }
    }
    setIsEditing(!isEditing);
  };
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (!user?.id) {
      toast.error("user not found");
      return;
    }
    try {
      const response = await userApi.changePasswordApi(
        currentPassword,
        newPassword
      );

      if (response.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response?.data?.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleSaveVehicle = async (
    vehicleId: string,
    data: EditVehicleFormData
  ) => {
    try {
         const response = await userApi.editVehicleApi(vehicleId, data);
    if (response.success) {
      toast.success("Vehicle updated successfully");
      setUser((prev) => {
        if (!prev) return prev;
        const updatedVehicles = prev.vehicles.map((vehicle) => {
          if (vehicle._id === vehicleId) {
            return response.vehicle;
          } else {
            return vehicle;
          }
        });

        return {
          ...prev,
          vehicles: updatedVehicles,
        };
      });
    }
    } catch (error) {
      const err = error as AxiosError<{message:string}>;
      toast.error(err.response?.data.message || "something went wrong")
    }
 
  };

  const formatAddress = (address: Address) => {
    return [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.zipCode,
    ]
      .filter(Boolean)
      .join(", ");
  };

 
  const defaultAddressObj =
    user?.addresses?.find((addr) => addr.isDefault) || user?.addresses?.[0];
  const defaultAddressText = defaultAddressObj
    ? formatAddress(defaultAddressObj)
    : "";

  return (
    <motion.div
      className="lg:col-span-3 container mx-auto py-6"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <Card className="border shadow-lg overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-4 border-white shadow-md">
                <AvatarImage
                  src={user?.profileImage || "/placeholder.svg"}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="bg-red-100 text-red-700 text-xl">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  My Profile
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Manage your personal information and preferences
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={toggleEdit}
              variant={isEditing ? "default" : "outline"}
              className={`rounded-full transition-all duration-300 ${
                isEditing
                  ? "bg-red-600 hover:bg-red-700"
                  : "border-red-300 text-red-700"
              }`}
            >
              {isEditing ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Save Changes
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
              <div className="container flex overflow-x-auto no-scrollbar">
                <TabsTrigger
                  value="profile"
                  className="flex items-center py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 data-[state=active]:shadow-none rounded-none bg-transparent text-slate-600"
                >
                  <User className="h-4 w-4 mr-2" />
                  Personal Details
                </TabsTrigger>
                <TabsTrigger
                  value="addresses"
                  className="flex items-center py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 data-[state=active]:shadow-none rounded-none bg-transparent text-slate-600"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Addresses
                </TabsTrigger>
                <TabsTrigger
                  value="vehicles"
                  className="flex items-center py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 data-[state=active]:shadow-none rounded-none bg-transparent text-slate-600"
                >
                  <Car className="h-4 w-4 mr-2" />
                  My Vehicles
                </TabsTrigger>
                {user?.provider === "local" && (
                  <TabsTrigger
                    value="security"
                    className="flex items-center py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 data-[state=active]:shadow-none rounded-none bg-transparent text-slate-600"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                )}
              </div>
            </TabsList>

            {/* Personal Details Tab */}
            <TabsContent value="profile" className="p-6">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="space-y-2" variants={fadeIn}>
                  <Label
                    htmlFor="name"
                    className="text-slate-600 text-sm font-medium"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`bg-slate-50 border-slate-200 focus-visible:ring-red-400 ${
                      isEditing ? "border-red-400" : ""
                    }`}
                    readOnly={!isEditing}
                  />
                </motion.div>

                <motion.div className="space-y-2" variants={fadeIn}>
                  <Label
                    htmlFor="email"
                    className="text-slate-600 text-sm font-medium"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    className="bg-slate-50 border-slate-200 focus-visible:ring-red-400"
                    readOnly
                  />
                </motion.div>

                <motion.div className="space-y-2" variants={fadeIn}>
                  <Label
                    htmlFor="phone"
                    className="text-slate-600 text-sm font-medium"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`bg-slate-50 border-slate-200 focus-visible:ring-red-400 ${
                      isEditing ? "border-red-400" : ""
                    }`}
                    readOnly={!isEditing}
                  />
                </motion.div>

                <motion.div className="space-y-2" variants={fadeIn}>
                  <Label
                    htmlFor="default-address"
                    className="text-slate-600 text-sm font-medium"
                  >
                    Default Address
                  </Label>
                  <Input
                    id="default-address"
                    value={defaultAddressText}
                    className="bg-slate-50 border-slate-200 focus-visible:ring-red-400"
                    readOnly
                  />
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="p-6">
              <motion.div
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-slate-800">
                    Saved Addresses
                  </h3>
                  <Button
                    onClick={() => setAddAddressModalOpen(true)}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Add New Address
                  </Button>

                  <AddAddressModal
                    open={addAddressModalOpen}
                    onOpenChange={setAddAddressModalOpen}
                    userId={user?.id}
                    setUser={setUser}
                  />
                </div>

                {user?.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((address) => (
                    <motion.div key={address.id} variants={fadeIn}>
                      <Card className="mb-3 overflow-hidden border border-slate-200 hover:shadow-md transition-shadow duration-300">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="p-4 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-slate-800">
                                  {address.addressType}
                                </span>
                                {address.isDefault && (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200"
                                  >
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="text-slate-600 text-sm">
                                {formatAddress(address)}
                              </p>
                            </div>
                            <div className="flex md:flex-col border-t md:border-t-0 md:border-l border-slate-200 bg-slate-50">
                              <Button
                                variant="ghost"
                                className="flex-1 h-10 text-red-500 justify-center rounded-none hover:bg-slate-100"
                                onClick={() => {
                                  setEditAddressModalOpen(true);
                                  setEditingAddress(address);
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-2" /> Edit
                              </Button>

                              <Separator className="hidden md:block" />

                              <Button
                                variant="ghost"
                                className="flex-1 h-10 text-slate-700 justify-center rounded-none hover:bg-slate-100"
                                onClick={() => {
                                  address.id && user.id
                                    ? handleDeleteAddress(address.id)
                                    : null;
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </Button>

                              {!address.isDefault && (
                                <>
                                  <Separator className="hidden md:block" />
                                  <Button
                                    variant="ghost"
                                    className="flex-1 h-10 text-blue-500 justify-center rounded-none hover:bg-slate-100"
                                    onClick={() => {
                                      address.id && user.id
                                        ? handleSetDefaultAddress(address.id)
                                        : null;
                                    }}
                                  >
                                    <Check className="h-4 w-4 mr-2" /> Set
                                    Default
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <motion.div variants={fadeIn} className="text-center py-8">
                    <p className="text-slate-500">
                      No addresses found. Add your first address!
                    </p>
                  </motion.div>
                )}
                <EditAddressModal
                  open={editAddressModalOpen}
                  onOpenChange={() => setEditAddressModalOpen((prev) => !prev)}
                  userId={user?.id}
                  address={editingAddress}
                  setUser={setUser}
                />
              </motion.div>
            </TabsContent>

            {/* Vehicles Tab */}
            <TabsContent value="vehicles" className="p-6">
              <motion.div
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-slate-800">
                    My Vehicles
                  </h3>
                  <Button
                    onClick={() => setAddVehicleModalOpen(true)}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Add New Vehicle
                  </Button>
                  <AddVehicleModal
                    open={addVehicleModalOpen}
                    onOpenChange={setAddVehicleModalOpen}
                    setUser={setUser}
                    user={user!}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user &&
                    user.vehicles.map((vehicle) => {
                      return (
                        <motion.div key={vehicle._id} variants={fadeIn}>
                          <Card className="overflow-hidden border border-slate-200 hover:shadow-md transition-shadow duration-300">
                            <CardContent className="p-0">
                              <div className="flex p-4">
                                <div className="h-20 w-20 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                                  <img
                                    src={vehicle.modelId.imageUrl}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-slate-800">
                                    {vehicle.modelId.name}
                                  </h4>
                                  <p className="text-sm text-slate-600">
                                    {vehicle.brandId.brandName}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    fuel: {vehicle.fuel}
                                  </p>
                                </div>
                                <div className="flex flex-col space-y-2">
                                  <Button
                                    variant="ghost"
                                    className="h-8 text-red-500 justify-start px-2 hover:bg-red-50"
                                    onClick={() => {
                                      console.log(
                                        "the edit vehicle button clicked"
                                      );
                                      setSelectedVehicle(vehicle);
                                      setEditVehicleModalOpen(true);
                                    }}
                                  >
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setConfirmConfig({
                                        title: "Delete Vehicle",
                                        description:
                                          "Are you sure you want to delete this vehicle? This action cannot be undone.",
                                        confirmText: "Delete",
                                        cancelText: "Cancel",
                                        variant: "destructive",
                                        onConfirm: () =>
                                          handleDeleteVehicle(vehicle._id), // your ID
                                      });
                                      setIsConfirmOpen(true);
                                    }}
                                    variant="ghost"
                                    className="h-8 text-slate-700 justify-start px-2 hover:bg-slate-100"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  <EditVehicleModal
                    isOpen={editVehicleModalOpen}
                    onClose={() => setEditVehicleModalOpen(false)}
                    vehicle={selectedVehicle}
                    onSave={handleSaveVehicle}
                  />
                </div>
              </motion.div>
            </TabsContent>

            {/* Security Tab */}
            {user?.provider === "local" && (
              <TabsContent value="security" className="p-6">
                <motion.div
                  className="space-y-6"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={fadeIn}>
                    <Card className="border border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-slate-800">
                          Change Password
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="current-password"
                            className="text-slate-600 text-sm font-medium"
                          >
                            Current Password
                          </Label>
                          <Input
                            id="current-password"
                            type="password"
                            placeholder="Enter current password"
                            className="border-slate-200 focus-visible:ring-red-400"
                            value={currentPassword}
                            autoComplete="new-password"
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="new-password"
                            className="text-slate-600 text-sm font-medium"
                          >
                            New Password
                          </Label>
                          <Input
                            id="new-password"
                            type="password"
                            placeholder="Enter new password"
                            className="border-slate-200 focus-visible:ring-red-400"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="confirm-password"
                            className="text-slate-600 text-sm font-medium"
                          >
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm new password"
                            className="border-slate-200 focus-visible:ring-red-400"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white mt-2"
                          onClick={handleChangePassword}
                        >
                          Change Password
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={fadeIn}>
                    <Card className="border border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-slate-800">
                          Two-Factor Authentication
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm text-slate-600">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-600">
                              Disabled
                            </span>
                            <Switch />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        config={confirmConfig}
        isLoading={isDeleting}
      />
    </motion.div>
  );
};

export default CustomerProfile;
