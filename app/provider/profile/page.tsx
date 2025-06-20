

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import createProviderApi from "@/services/providerApi"
import { CheckCircle } from "lucide-react"
import { axiosPrivate } from "@/api/axios"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import Navbar from "../../../components/provider/Navbar"
import { Clock, MapPin, Mail, Phone, FileEdit, Save, X, XCircle, Pencil, Loader2,RefreshCw } from "lucide-react"
import createimageUploadApi from "@/services/imageUploadApi"
import { axiosPublic } from "@/api/axiosPublic"

interface IServiceProvider {
  name: string
  ownerName: string
  email: string
  phone?: string
  googleId?: string
  provider?: string
  address?: string
  addressToSend?:{
     street:string,
    city:string,
    state:string,
    pinCode:string,
  }
  location?: {
    latitude: number
    longitude: number
  }
  isListed: boolean
  verificationStatus?: "pending" | "approved" | "rejected"
  password?: string
  createdAt: Date
  updatedAt: Date
  license?: string
  ownerIdProof?: string
  profilePicture?: string
  coverPhoto?: string
  bankDetails?: {
    accountHolderName: string
    accountNumber: string
    ifscCode: string
    bankName: string
  }
  startedYear?: number
  description?: string
}

const defaultProvider: IServiceProvider = {
  name: "",
  ownerName: "",
  email: "",
  isListed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  license: "",
  ownerIdProof: "",
  profilePicture: "",
  coverPhoto: "",
  bankDetails: {
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  },
  startedYear: 1997,
  description: "",
}
const providerApi = createProviderApi(axiosPrivate)
const imageUploadApi = createimageUploadApi(axiosPublic);

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [providerData, setProviderData] = useState<IServiceProvider>(defaultProvider)
  const [addressFields, setAddressFields] = useState({
    street: "",
    city: "",
    state: "",
    pinCode: "",
  })
  const coverPhotoInputRef = useRef<HTMLInputElement>(null)
  const profilePhotoInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<{
    profile?: File
    cover?: File
  }>({})

  useEffect(() => {
    if(providerData){
      console.log('provider data',providerData);
    }
  },[providerData]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await providerApi.getProfileData()

        // Parse address if it exists
        if (response.provider?.address) {
          const addressParts = response.provider.address.split(",")
          const street = addressParts[0]?.trim() || ""
          const city = addressParts[1]?.trim() || ""
          let state = ""
          let pinCode = ""

          if (addressParts[2]) {
            const statePincodeParts = addressParts[2].trim().split(" ")
            state = statePincodeParts.slice(0, -1).join(" ").trim()
            pinCode = statePincodeParts[statePincodeParts.length - 1]?.trim() || ""
          }

          // Update the provider data with parsed address components
          setProviderData({
            ...response.provider,
          })

          setAddressFields({
            street,
            city,
            state,
            pinCode,
          })
        } else {
          setProviderData(response.provider)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }

    fetchData()
  }, [])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProviderData({
      ...providerData,
      [name]: name === "startedYear" ? Number.parseInt(value) : value,
    })
  }

  const handleCoverPhotoClick = () => {
    coverPhotoInputRef.current?.click()
  }

  const handleProfilePhotoClick = () => {
    profilePhotoInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "cover" | "profile") => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFiles({
      ...selectedFiles,
      [type]: file,
    })
    const previewUrl = URL.createObjectURL(file)
    setProviderData({
      ...providerData,
      [type === "cover" ? "coverPhoto" : "profilePicture"]: previewUrl,
    })
  }
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddressFields({
      ...addressFields,
      [name]: value,
    })
    setProviderData({
      ...providerData,
      address: `${name === "street" ? value : addressFields.street}, ${
        name === "city" ? value : addressFields.city
      }, ${name === "state" ? value : addressFields.state} ${name === "pinCode" ? value : addressFields.pinCode}`,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const { address, ...updatedProviderData } = providerData;
      if (selectedFiles.profile || selectedFiles.cover) {
        const uploadPromises = []
        if (selectedFiles.profile) {
          uploadPromises.push(
            imageUploadApi.uploadBrandImageApi(selectedFiles.profile).then((response) => {
              if (response) {
                updatedProviderData.profilePicture = response
              }
            }),
          )
        }
        if (selectedFiles.cover) {
          uploadPromises.push(
            imageUploadApi.uploadBrandImageApi(selectedFiles.cover).then((response) => {
              if (response) {
                updatedProviderData.coverPhoto = response
              }
            }),
          )
        }
        await Promise.all(uploadPromises)
      }
      const dataToSend = {
        ...updatedProviderData,
      addressToSend:addressFields,
      }
      const updateResponse = await providerApi.updateProfile(dataToSend)
      if (updateResponse.success) {
        setProviderData(updateResponse.provider)
        setIsEditing(false)
        alert("Profile updated successfully!")
      } else {
        throw new Error(updateResponse.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsSubmitting(false)
      setSelectedFiles({})
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto p-6">
        <div className="relative mb-8">
          {/* Cover image */}
          <div className="h-64 w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden relative">
            {providerData?.coverPhoto && (
              <img
                src={providerData.coverPhoto || "/placeholder.svg"}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
            {isEditing && (
              <div
                className="absolute right-4 top-4 p-2 bg-white/80 rounded-full cursor-pointer hover:bg-white transition-colors"
                onClick={handleCoverPhotoClick}
              >
                <Pencil className="h-5 w-5 text-blue-600" />
              </div>
            )}
            <input
              type="file"
              ref={coverPhotoInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileSelect(e, "cover")}
            />
          </div>

          {/* Profile header */}
          <div className="absolute -bottom-6 left-8 flex items-end">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white bg-white">
                <AvatarImage src={providerData?.profilePicture || "/api/placeholder/96/96"} alt={providerData?.name} />
                <AvatarFallback>{providerData?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <div
                  className="absolute bottom-0 right-0 p-1 bg-white rounded-full cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                  onClick={handleProfilePhotoClick}
                >
                  <Pencil className="h-4 w-4 text-blue-600" />
                </div>
              )}
              <input
                type="file"
                ref={profilePhotoInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, "profile")}
              />
            </div>
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
        <span className="flex items-center gap-1 px-2 py-1 text-white-600 text-lg rounded">
          <Clock size={16} />
          Pending Verification
        </span>
      ) : (
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-500 text-sm rounded">
            <XCircle size={16} />
            Rejected
          </span>
          <Link href="/provider/profile/verification">
            <div className="cursor-pointer px-3 py-1 bg-yellow-400 text-blue-900 text-sm font-bold rounded-md hover:bg-yellow-300 hover:scale-105 hover:shadow-lg active:bg-yellow-500 active:scale-95 border border-yellow-500 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 flex items-center justify-center gap-1">
              <RefreshCw size={14} />
              Reapply
            </div>
          </Link>
        </div>
      )}
              </div>
              <p className="text-sm text-white/80">Service Provider since {providerData?.startedYear}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="absolute right-6 bottom-6">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                <FileEdit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setSelectedFiles({})
                    // Reset any temporary preview URLs
                    if (selectedFiles.profile || selectedFiles.cover) {
                      // Refetch the data to restore original images
                      providerApi.getProfileData().then((response) => {
                        setProviderData(response.provider)
                      })
                    }
                  }}
                  disabled={isSubmitting}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
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
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>About Us</CardTitle>
                        <CardDescription>Your company description and mission</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{providerData?.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
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
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Business Name</Label>
                            <Input id="name" name="name" value={providerData?.name} onChange={handleChange} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={providerData?.email}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" value={providerData?.phone} onChange={handleChange} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="street">Street Address</Label>
                            <Input
                              id="street"
                              name="street"
                              value={addressFields.street}
                              onChange={handleAddressChange}
                              placeholder="Street address"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                name="city"
                                value={addressFields.city}
                                onChange={handleAddressChange}
                                placeholder="City"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="state">State</Label>
                              <Input
                                id="state"
                                name="state"
                                value={addressFields.state}
                                onChange={handleAddressChange}
                                placeholder="State"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pinCode">Pincode</Label>
                            <Input
                              id="pinCode"
                              name="pinCode"
                              value={addressFields.pinCode}
                              onChange={handleAddressChange}
                              placeholder="Pincode"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="startedYear">Founded Year</Label>
                            <Input
                              id="startedYear"
                              name="startedYear"
                              type="number"
                              value={providerData?.startedYear}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">About</Label>
                            <Textarea
                              id="description"
                              name="description"
                              value={providerData?.description}
                              onChange={handleChange}
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
  )
}
