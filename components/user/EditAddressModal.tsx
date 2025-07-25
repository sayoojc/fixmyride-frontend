"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Home, Briefcase, Map } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import createUserApi from "@/services/userApi";
import { axiosPrivate } from "@/api/axios";
import { toast } from "react-toastify";
import {User,Address} from '../../types/user'
const userApi = createUserApi(axiosPrivate);


interface EditAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | undefined;
  address: Address | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const EditAddressModal: React.FC<EditAddressModalProps> = ({
  open,
  onOpenChange,
  userId,
  address,
  setUser
}) => {
  const [addressForm, setAddressForm] = useState<Address>({
    userId: userId,
    addressLine1: "",
    addressLine2: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
    addressType: "Home",
    latitude:0,
    longitude:0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form with existing address data
  useEffect(() => {
    if (address) {
      setAddressForm({
        userId: userId,
        addressLine1: address.addressLine1 || "",
        addressLine2: address.addressLine2 || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zipCode: address.zipCode || "",
        isDefault: address.isDefault || false,
        addressType: address.addressType || "Home",
        latitude:address.latitude,
        longitude:address.longitude
      });
    }
  }, [address, userId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!addressForm.addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required";
    if (!addressForm.street.trim()) newErrors.street = "Street is required";
    if (!addressForm.city.trim()) newErrors.city = "City is required";
    if (!addressForm.state.trim()) newErrors.state = "State is required";
    if (!addressForm.zipCode.trim()) newErrors.zipCode = "ZIP/PIN Code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));

    if (errors[name] && value.trim()) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmitAddress = async () => {
    if (!validateForm()) return;

    try {
        if(address?.id && userId){
            const response = await userApi.updateAddressApi(addressForm,address.id);
            if (response && response.data.address) {
              const updatedAddress = response.data.address;
              console.log('updated address',updatedAddress);
            
              toast.success("Address Updated Successfully");
            
              setUser(prevUser => {
                if (!prevUser) return prevUser;
            
                const updatedAddresses = prevUser.addresses.map(addr =>
                  addr.id === updatedAddress.id ? updatedAddress : addr
                );
            
                return {
                  ...prevUser,
                  addresses: updatedAddresses,
                  defaultAddress: updatedAddress.isDefault
                    ? updatedAddress.id
                    : prevUser.defaultAddress
                };
              });
            
                setErrors({});
                onOpenChange(false);
              } else {
                toast.error("Failed to update address");
              } 
        } else {
            throw new Error('Address Id or userId is missing')
        }

    
    } catch (error) {
      toast.error("Error updating address");
      console.error("Update address error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-semibold">
            <MapPin className="mr-2 h-5 w-5 text-red-500" />
            Edit Address
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="AddressType" className="text-gray-600 text-sm font-medium">
              Address Type
            </Label>
            <RadioGroup
              id="AddressType"
              defaultValue="Home"
              className="flex flex-wrap gap-4"
              value={addressForm.addressType}
              onValueChange={(value) =>
                setAddressForm(prev => ({ ...prev, addressType: value }))
              }
            >
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md border">
                <RadioGroupItem value="Home" id="home" />
                <Home className="h-4 w-4 text-red-500" />
                <Label htmlFor="home" className="cursor-pointer">Home</Label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md border">
                <RadioGroupItem value="Work" id="work" />
                <Briefcase className="h-4 w-4 text-red-500" />
                <Label htmlFor="work" className="cursor-pointer">Work</Label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md border">
                <RadioGroupItem value="Other" id="other" />
                <Map className="h-4 w-4 text-red-500" />
                <Label htmlFor="other" className="cursor-pointer">Other</Label>
              </div>
            </RadioGroup>
          </div>

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
            {errors.addressLine1 && (
              <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2" className="text-gray-600 text-sm font-medium">
              Address Line 2 (Optional)
            </Label>
            <Input
              id="addressLine2"
              name="addressLine2"
              placeholder="Floor, Unit Number, etc."
              value={addressForm.addressLine2 || ""}
              onChange={handleAddressChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street" className="text-gray-600 text-sm font-medium">
              Street <span className="text-red-500">*</span>
            </Label>
            <Input
              id="street"
              name="street"
              placeholder="Street name"
              value={addressForm.street}
              onChange={handleAddressChange}
              className={errors.street ? "border-red-500" : ""}
            />
            {errors.street && (
              <p className="text-red-500 text-xs mt-1">{errors.street}</p>
            )}
          </div>

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
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
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
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>
          </div>

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
            {errors.zipCode && (
              <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 mt-2 bg-gray-50 p-3 rounded-md border">
            <Checkbox
              id="isDefault"
              checked={addressForm.isDefault}
              onCheckedChange={(checked) =>
                setAddressForm(prev => ({
                  ...prev,
                  isDefault: checked === true,
                }))
              }
            />
            <Label htmlFor="isDefault" className="text-sm font-medium cursor-pointer">
              Set as default address
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="border-gray-300 hover:bg-gray-100"
            type="button"
            onClick={() => {
              setErrors({});
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleSubmitAddress}
          >
            Update Address
          </Button>
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAddressModal;