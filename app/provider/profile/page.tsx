"use client";

import { useState,useEffect } from 'react';
import createProviderApi from '@/services/providerApi';
import { CheckCircle } from "lucide-react";
import { axiosPrivate } from '@/api/axios';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import {
  Badge
} from '@/components/ui/badge';
import {
  Separator
} from '@/components/ui/separator';
import {
  Label
} from '@/components/ui/label';
import Navbar from "../../../components/provider/Navbar";
import { Clock, MapPin, Mail, Phone, Award, User, FileEdit, Save, X,XCircle, } from 'lucide-react';
import { IServiceProvider } from '@/types/provider';



interface Statistic {
  label: string;
  value: number;
  icon: React.ReactNode;
}
const providerApi = createProviderApi(axiosPrivate);
export default function ProfilePage() {
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await providerApi.getProfileData();
        console.log('response',response);
        setProviderData(response.provider);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
  
    fetchData();
  }, []);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [providerData, setProviderData] = useState<IServiceProvider>();
  // Mock data for the service provider
  // const [providerData, setProviderData] = useState<ProviderData>({
  //   name: "AutoFix Pro Services",
  //   ownerName: "Michael Rodriguez",
  //   email: "contact@autofixpro.com",
  //   phone: "(555) 123-4567",
  //   address: "123 Mechanic Avenue, Autoville, CA 94103",
  //   businessHours: "Mon-Fri: 8AM-6PM, Sat: 9AM-3PM",
  //   specialty: "European & Japanese Vehicles",
  //   foundedYear: 2015,
  //   about: "AutoFix Pro Services has been providing high-quality automotive repair and maintenance services for over 10 years. We specialize in European and Japanese vehicles, offering everything from routine maintenance to complex repairs. Our team of certified technicians is committed to delivering exceptional service and ensuring customer satisfaction with every job."
  // });

  // Mock statistics
  // const statistics: Statistic[] = [
  //   { label: "Completed Services", value: 1258, icon: <Clock className="h-5 w-5 text-blue-500" /> },
  //   { label: "Active Customers", value: 437, icon: <User className="h-5 w-5 text-green-500" /> },
  //   { label: "5-Star Reviews", value: 892, icon: <Award className="h-5 w-5 text-yellow-500" /> },
  //   { label: "Service Specialists", value: 8, icon: <User className="h-5 w-5 text-purple-500" /> }
  // ];

  // Mock certifications
  // const certifications: string[] = [
  //   "ASE Master Technician",
  //   "BMW Certified",
  //   "Toyota Service Center",
  //   "Honda Professional Automotive Career Training",
  //   "Electric Vehicle Service Certified"
  // ];

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setProviderData({
  //     ...providerData,
  //     [name]: name === 'foundedYear' ? parseInt(value) : value
  //   });
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the data to your backend
    setIsEditing(false);
    // Show success message
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto p-6">
        <div className="relative mb-8">
          {/* Cover image */}
          <div className="h-64 w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
            {/* <div className="absolute inset-0 bg-black/10 rounded-lg"></div> */}
          </div>
          
          {/* Profile header */}
          <div className="absolute -bottom-6 left-8 flex items-end">
            <Avatar className="h-24 w-24 border-4 border-white bg-white">
              <AvatarImage src="/api/placeholder/96/96" alt={providerData?.name} />
              <AvatarFallback>{providerData?.name}</AvatarFallback>
            
            </Avatar>
            <div className="ml-6 pb-8">
  <div className="flex items-center gap-4">
    <h1 className="text-3xl font-bold text-white">{providerData?.name}</h1>
    {!providerData?.verificationStatus ? (
      <Link href="/provider/profile/verification">
  <div className="cursor-pointer px-3 py-1 bg-yellow-400 text-blue-900 text-sm font-bold rounded-md hover:bg-yellow-300 hover:scale-105 hover:shadow-lg active:bg-yellow-500 active:scale-95 border border-yellow-500 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 flex items-center gap-1">
    <span className="relative">
      <span className="absolute -right-1 -top-1 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </span>
    </span>
    Verify Now
  </div>
</Link>
) : providerData.verificationStatus === "approved" ? (
  <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded">
    <CheckCircle size={16} />
    Verified
  </span>
) : providerData.verificationStatus === "pending" ? (
  <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-600 text-sm rounded">
    <Clock size={16} />
    Pending Verification
  </span>
) : (
  <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-500 text-sm rounded">
    <XCircle size={16} />
    Rejected
  </span>
)}

  </div>
  <p className="text-sm text-white/80">
    Service Provider since {providerData?.startedYear}
  </p>
</div>

          </div>
          
          {/* Action buttons */}
          <div className="absolute right-6 bottom-6">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileEdit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              {!isEditing ? (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Business Information</CardTitle>
                        <CardDescription>Details about your automotive service business</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* <div className="space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <User className="mr-2 h-4 w-4" />
                              Owner
                            </div>
                            <p className="font-medium">{providerData.ownerName}</p>
                          </div> */}
                          
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="mr-2 h-4 w-4" />
                              Email
                            </div>
                            <p className="font-medium">{providerData?.email}</p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="mr-2 h-4 w-4" />
                              Phone
                            </div>
                            <p className="font-medium">{providerData?.phone}</p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-2 h-4 w-4" />
                              Address
                            </div>
                            <p className="font-medium">{providerData?.address}</p>
                          </div>
                          
                          {/* <div className="space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-2 h-4 w-4" />
                              Business Hours
                            </div>
                            <p className="font-medium">{providerData.businessHours}</p>
                          </div> */}
                          
                          {/* <div className="space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Award className="mr-2 h-4 w-4" />
                              Specialty
                            </div>
                            <p className="font-medium">{providerData.specialty}</p>
                          </div> */}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>About Us</CardTitle>
                        <CardDescription>Your company description and mission</CardDescription>
                      </CardHeader>
                      {/* <CardContent>
                        <p className="text-muted-foreground">{providerData.about}</p>
                      </CardContent> */}
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Certifications & Qualifications</CardTitle>
                        <CardDescription>Professional certifications and training</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* <div className="flex flex-wrap gap-2">
                          {certifications.map((cert, index) => (
                            <Badge key={index} variant="secondary" className="text-xs py-1">
                              <Award className="mr-1 h-3 w-3" />
                              {cert}
                            </Badge>
                          ))}
                        </div> */}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Service Statistics</CardTitle>
                        <CardDescription>Performance metrics and achievements</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* <div className="space-y-4">
                          {statistics.map((stat, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="mr-3">{stat.icon}</div>
                                <span className="text-sm text-muted-foreground">{stat.label}</span>
                              </div>
                              <span className="text-xl font-bold">{stat.value.toLocaleString()}</span>
                            </div>
                          ))}
                        </div> */}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Links</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          View Service History
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Manage Appointments
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Update Business Hours
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Add New Certification
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your business information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Business Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={providerData?.name}
                              // onChange={handleChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="ownerName">Owner Name</Label>
                            <Input
                              id="ownerName"
                              name="ownerName"
                              // value={providerData.ownerName}
                              // onChange={handleChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={providerData?.email}
                              // onChange={handleChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={providerData?.phone}
                              // onChange={handleChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              name="address"
                              value={providerData?.address}
                              // onChange={handleChange}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="businessHours">Business Hours</Label>
                            <Input
                              id="businessHours"
                              name="businessHours"
                              // value={providerData.businessHours}
                              // onChange={handleChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="specialty">Specialty</Label>
                            <Input
                              id="specialty"
                              name="specialty"
                              // value={providerData.specialty}
                              // onChange={handleChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="foundedYear">Founded Year</Label>
                            <Input
                              id="foundedYear"
                              name="foundedYear"
                              type="number"
                              // value={providerData.foundedYear}
                              // onChange={handleChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="about">About</Label>
                            <Textarea
                              id="about"
                              name="about"
                              // value={providerData.about}
                              // onChange={handleChange}
                              rows={5}
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                  <CardDescription>Automotive services available to customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">Services content would be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>What your customers are saying about you</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">Reviews content would be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="gallery">
              <Card>
                <CardHeader>
                  <CardTitle>Service Gallery</CardTitle>
                  <CardDescription>Images of your workshop and completed services</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">Gallery content would be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="p-4 text-center bg-slate-900 text-white mt-8">
        <p>© 2025 Car Service Provider. All Rights Reserved.</p>
      </footer>
    </div>
  );
}