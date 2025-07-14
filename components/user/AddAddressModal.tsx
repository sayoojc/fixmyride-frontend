"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MapPin, Home, Briefcase, Map } from "lucide-react"
import createUserApi from "@/services/userApi"
import { axiosPrivate } from "@/api/axios"
import { toast } from "react-toastify"

const userApi = createUserApi(axiosPrivate)

import type { User, Address } from "../../types/user"
import dynamic from "next/dynamic"
import { useJsApiLoader } from "@react-google-maps/api"

const MapPicker = dynamic(() => import("../../components/user/MapPicker"), {
  ssr: false,
})

interface AddAddressModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | undefined
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({ open, onOpenChange, userId, setUser }) => {
  const [addressForm, setAddressForm] = useState<Address>({
    userId: userId,
    addressLine1: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    addressType: "Home",
    latitude: 0,
    longitude: 0,
    isDefault:false,
  })

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places", "marker"],
  })

  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  useEffect(() => {
    if (isLoaded && !geocoder) {
      setGeocoder(new window.google.maps.Geocoder())
    }
  }, [isLoaded, geocoder])

  useEffect(() => {
    if (open && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          if (geocoder) {
            geocoder.geocode(
              { location: { lat: position.coords.latitude, lng: position.coords.longitude } },
              (results, status) => {
                if (status === "OK" && results && results[0]) {
                  updateAddressFromGeocode(results[0])
                }
              },
            )
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
          setCurrentLocation({ lat: 28.6139, lng: 77.209 })
        },
      )
    }
  }, [open, geocoder])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!addressForm.addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required"
    if (!addressForm.street.trim()) newErrors.street = "Street is required"
    if (!addressForm.city.trim()) newErrors.city = "City is required"
    if (!addressForm.state.trim()) newErrors.state = "State is required"
    if (!addressForm.zipCode.trim()) newErrors.zipCode = "ZIP/PIN Code is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddressForm((prev) => ({ ...prev, [name]: value }))

    if (errors[name] && value.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const updateAddressFromGeocode = useCallback((result: google.maps.GeocoderResult) => {
    let street = ""
    let city = ""
    let state = ""
    let zipCode = ""
    const addressLine1 = result.formatted_address

    for (const component of result.address_components) {
      if (component.types.includes("street_number") || component.types.includes("route")) {
        street += component.long_name + " "
      }
      if (component.types.includes("locality")) {
        city = component.long_name
      }
      if (component.types.includes("administrative_area_level_1")) {
        state = component.long_name
      }
      if (component.types.includes("postal_code")) {
        zipCode = component.long_name
      }
    }

    setAddressForm((prev) => ({
      ...prev,
      addressLine1: addressLine1.split(",")[0] || prev.addressLine1,
      street: street.trim() || prev.street,
      city: city || prev.city,
      state: state || prev.state,
      zipCode: zipCode || prev.zipCode,
      latitude: result.geometry.location.lat(),
      longitude: result.geometry.location.lng(),
    }))
  }, [])

  const handleMarkerDrag = useCallback(
    (lat: number, lng: number) => {
      setAddressForm((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }))

      if (geocoder) {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            updateAddressFromGeocode(results[0])
          }
        })
      }
    },
    [geocoder, updateAddressFromGeocode],
  )

  const handleSubmitAddress = async () => {
    if (!validateForm()) return

    const response = await userApi.addAddressApi({
      ...addressForm,
      userId: userId,
    })

    console.log("The response from the add address function", response)

    if (response) {
      const newAddress = response.data
      console.log("new address", newAddress)
      toast.success("Address Added Successfully")
      setUser((prevUser: User | null): User | null => {
        if (!prevUser) return prevUser

        return {
          ...prevUser,
          addresses: [...prevUser.addresses, newAddress],
        }
      })
    }

    setAddressForm({
      userId: userId,
      addressLine1: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      addressType: "Home",
      latitude: 0,
      longitude: 0,
      isDefault:false,
    })
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-semibold">
            <MapPin className="mr-2 h-5 w-5 text-red-500" />
            Add New Address
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Map Section - Made Larger */}
          {isLoaded && currentLocation && (
            <div className="space-y-2">
              <Label className="text-gray-600 text-sm font-medium">Select Location on Map</Label>
              <div className="h-80 w-full rounded-lg overflow-hidden border">
                <MapPicker initialLocation={currentLocation} onMarkerDrag={handleMarkerDrag} />
              </div>
            </div>
          )}

          {/* Address Type */}
          <div className="space-y-2">
            <Label htmlFor="addressType" className="text-gray-600 text-sm font-medium">
              Address Type
            </Label>
            <RadioGroup
              id="addressType"
              defaultValue="Home"
              className="flex flex-wrap gap-4"
              value={addressForm.addressType}
              onValueChange={(value) => setAddressForm((prev) => ({ ...prev, addressType: value }))}
            >
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md border">
                <RadioGroupItem value="Home" id="home" />
                <Home className="h-4 w-4 text-red-500" />
                <Label htmlFor="home" className="cursor-pointer">
                  Home
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md border">
                <RadioGroupItem value="Work" id="work" />
                <Briefcase className="h-4 w-4 text-red-500" />
                <Label htmlFor="work" className="cursor-pointer">
                  Work
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md border">
                <RadioGroupItem value="Other" id="other" />
                <Map className="h-4 w-4 text-red-500" />
                <Label htmlFor="other" className="cursor-pointer">
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Address Line 1 */}
          <div className="space-y-2">
            <Label htmlFor="addressLine1" className="text-gray-600 text-sm font-medium">
              Address Line 1 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="addressLine1"
              name="addressLine1"
              placeholder="Building, Apartment, Suite, etc."
              value={addressForm.addressLine1}
              onChange={handleAddressChange}
              className={errors.addressLine1 ? "border-red-500" : ""}
            />
            {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}
          </div>

          {/* Street */}
          <div className="space-y-2">
            <Label htmlFor="street" className="text-gray-600 text-sm font-medium">
              Landmark <span className="text-red-500">*</span>
            </Label>
            <Input
              id="street"
              name="street"
              placeholder="landmark"
              value={addressForm.street}
              onChange={handleAddressChange}
              className={errors.street ? "border-red-500" : ""}
            />
            {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
          </div>

          {/* City and State */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-600 text-sm font-medium">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                name="city"
                placeholder="City"
                value={addressForm.city}
                onChange={handleAddressChange}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-gray-600 text-sm font-medium">
                State <span className="text-red-500">*</span>
              </Label>
              <Input
                id="state"
                name="state"
                placeholder="State"
                value={addressForm.state}
                onChange={handleAddressChange}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
          </div>

          {/* ZIP Code */}
          <div className="space-y-2">
            <Label htmlFor="zipCode" className="text-gray-600 text-sm font-medium">
              ZIP/PIN Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="zipCode"
              name="zipCode"
              placeholder="ZIP/PIN Code"
              value={addressForm.zipCode}
              onChange={handleAddressChange}
              className={errors.zipCode ? "border-red-500" : ""}
            />
            {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="border-gray-300 hover:bg-gray-100 bg-transparent"
            type="button"
            onClick={() => {
              setErrors({})
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleSubmitAddress}>
            Save Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddAddressModal
