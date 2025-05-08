"use client"

import React, { useState,useEffect } from 'react';


import createUserApi from '@/services/userApi';
import { axiosPrivate } from '@/api/axios';
const userApi = createUserApi(axiosPrivate);

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Pencil, Trash2, Check } from "lucide-react";
import AddAddressModal from '@/components/user/AddAddressModal';
import AddVehicleModal from '@/components/user/AddVehicleModal';
import EditAddressModal from '@/components/user/EditAddressModal';

import { toast } from 'react-toastify';

// import { useSelector } from 'react-redux';
// import { RootState } from '../../../redux/store'; 
import {User,Address}  from '../../../types/user'


export const CustomerProfile = () => {
    

  const [user,setUser] = useState<User | null>(null);
  const [addAddressModalOpen,setAddAddressModalOpen] = useState<boolean>(false);
  const [addVehicleModalOpen,setAddVehicleModalOpen] = useState<boolean>(false);
  const [editAddressModalOpen,setEditAddressModalOpen] = useState<boolean>(false);
  const [editingAddress,setEditingAddress] = useState<Address|null>(null);
 

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
          const response = await userApi.getProfileDataApi(); 
          console.log('response from the fetch user',response);
          setUser(response.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
  
    fetchUserDetails();
  }, []);

  const handleSetDefaultAddress = async (addressId: string,userId:string) => {
    try {
      const response = await axiosPrivate.patch("/api/user/set-default-address", {
        addressId,
        userId
      });
  
      if (response.status === 200) {
        toast.success("Default address updated successfully!");
  
        setUser(prevUser => {
          if (!prevUser) return prevUser;
  
          // Update the isDefault property of all addresses
          const updatedAddresses = prevUser.addresses.map(address => ({
            ...address,
            isDefault: address._id === addressId
          }));
  
          return {
            ...prevUser,
            addresses: updatedAddresses,
            defaultAddress: addressId
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
   

  const handleDeleteAddress = async (addressId: string, userId: string) => {
    try {
      const response = await userApi.deleteAddress(addressId,userId);
  
      if (response?.status === 200) {
        toast.success("Address deleted successfully!");
  
        setUser((prevUser) => {
          if (!prevUser) return prevUser;
        
          const updatedAddresses = prevUser.addresses.filter(addr => addr._id !== addressId);
        
          const isDeletedDefault = prevUser.defaultAddress === addressId;
        
          return {
            ...prevUser,
            addresses: updatedAddresses,
            defaultAddress: isDeletedDefault
              ? updatedAddresses[0]?._id || "" // ✅ always return a string
              : prevUser.defaultAddress
          };
        });
      } else {
        toast.error("Failed to delete address.");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Something went wrong while deleting address.");
    }
  };
  
  
  

  const [userDetails, setUserDetails] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    defaultAddress: '123 Main St, Trivandrum, Kerala - 695001',
    addresses: [
      {
        id: 1,
        type: 'Home',
        address: '123 Main St, Trivandrum, Kerala - 695001',
        isDefault: true
      },
      {
        id: 2,
        type: 'Work',
        address: '456 Office Complex, Technopark, Trivandrum - 695581',
        isDefault: false
      }
    ],
    vehicles: [
      {
        id: 1,
        model: 'Tata Tiago',
        type: 'Petrol',
        regNumber: 'KL-01-AB-1234',
        year: '2021'
      },
      {
        id: 2,
        model: 'Hyundai i20',
        type: 'Diesel',
        regNumber: 'KL-05-CD-5678',
        year: '2019'
      }
    ]
  });

  return (
    <div className="lg:col-span-3">
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="profile" className="data-[state=active]:text-red-500 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:shadow-none">
                Personal Details
              </TabsTrigger>
              <TabsTrigger value="addresses" className="data-[state=active]:text-red-500 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:shadow-none">
                Addresses
              </TabsTrigger>
              <TabsTrigger value="vehicles" className="data-[state=active]:text-red-500 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:shadow-none">
                My Vehicles
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:text-red-500 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:shadow-none">
                Security
              </TabsTrigger>
            </TabsList>
            
            {/* Personal Details Tab */}
            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-600 text-sm">Full Name</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="name"
                      value={user?.name}
                      className="bg-gray-50"
                      readOnly
                    />
                    <Button variant="ghost" className="text-red-500 font-medium h-9">
                      EDIT
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-600 text-sm">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="email"
                      type="email"
                      value={user?.email}
                      className="bg-gray-50"
                      readOnly
                    />
                    {/* <Button variant="ghost" className="text-red-500 font-medium h-9">
                      EDIT
                    </Button> */}
                  </div>
                </div>
              
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-600 text-sm">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="phone"
                      value={user?.phone}
                      className="bg-gray-50"
                      readOnly
                    />
                    <Button variant="ghost" className="text-red-500 font-medium h-9">
                      EDIT
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-address" className="text-gray-600 text-sm">Default Address</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="default-address"
                      value={user?.defaultAddress}
                      className="bg-gray-50"
                      readOnly
                    />
                      {/* <Button variant="ghost" className="text-red-500 font-medium h-9">
                        CHANGE
                      </Button> */}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Saved Addresses</h3>
                      {/* add address modal */}
                      <Button onClick={() => setAddAddressModalOpen(true)}>
      <PlusCircle className="h-4 w-4 mr-2" /> ADD NEW ADDRESS
    </Button>

    <AddAddressModal 
      open={addAddressModalOpen}
      onOpenChange={setAddAddressModalOpen}
      userId= {user?.id}
      setUser = {setUser}
    />
    
                    </div>
                
                {user?.addresses.map((address) => (
                  <Card key={address._id} className="mb-3">
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{address.addressType}</span>
                            {address.isDefault && (
                              <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Default</Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{address.addressLine1+address.addressLine2+address.city+address.state}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button variant="ghost" className="h-8 text-red-500 justify-start px-2" 
                          onClick={() =>{
                            setEditAddressModalOpen(true)
                            setEditingAddress(address)
                          }
                          }>
                            <Pencil className="h-4 w-4 mr-2" /> EDIT
                          </Button>
                        
                          <Button variant="ghost" className="h-8 text-gray-500 justify-start px-2" 
                          onClick={() => {address._id && user.id ?handleDeleteAddress(address._id,user.id): null}}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> DELETE
                          </Button>
                          {!address.isDefault && (
                            <Button variant="ghost" className="h-8 text-blue-500 justify-start px-2" onClick={() => {address._id && user.id ?handleSetDefaultAddress(address._id,user.id): null}}>
                              <Check className="h-4 w-4 mr-2" /> SET AS DEFAULT
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                  <EditAddressModal 
                          open = {editAddressModalOpen}
                          onOpenChange={() =>setEditAddressModalOpen((prev) => !prev)}
                          userId= {user?.id}
                          address={editingAddress}
                          setUser={setUser}
                          />
              </div>
            </TabsContent>
            
            {/* Vehicles Tab */}
            <TabsContent value="vehicles">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">My Vehicles</h3>
                {/* add vehicle modal */}
                <Button onClick={() => setAddVehicleModalOpen(true)}>
      <PlusCircle className="h-4 w-4 mr-2" /> ADD NEW VEHICLE
    </Button>
<AddVehicleModal open={addVehicleModalOpen} onOpenChange={setAddVehicleModalOpen} />

                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userDetails.vehicles.map((vehicle) => (
                    <Card key={vehicle.id}>
                      <CardContent className="p-4">
                        <div className="flex">
                          <div className="h-24 w-24 bg-gray-200 rounded mr-4"></div>
                          <div>
                            <h4 className="font-semibold">{vehicle.model}</h4>
                            <p className="text-sm text-gray-600">{vehicle.type}</p>
                            <p className="text-sm text-gray-600">Reg: {vehicle.regNumber}</p>
                            <p className="text-sm text-gray-600">Year: {vehicle.year}</p>
                          </div>
                          <div className="ml-auto flex flex-col space-y-2">
                            <Button variant="ghost" className="h-8 text-red-500 justify-start px-2">
                              <Pencil className="h-4 w-4 mr-2" /> EDIT
                            </Button>
                            <Button variant="ghost" className="h-8 text-gray-500 justify-start px-2">
                              <Trash2 className="h-4 w-4 mr-2" /> DELETE
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Change Password</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-gray-600 text-sm">Current Password</Label>
                      <Input 
                        id="current-password"
                        type="password"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-gray-600 text-sm">New Password</Label>
                      <Input 
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-600 text-sm">Confirm New Password</Label>
                      <Input 
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button className="bg-red-500 hover:bg-red-600 text-white mt-2">
                      CHANGE PASSWORD
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Disabled</span>
                        <Switch id="2fa" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>




    </div>
  );
};


export default CustomerProfile