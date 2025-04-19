"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { PlusCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Address {
  id: number;
  type: string;
  address: string;
  isDefault: boolean;
}

interface AddAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // You can uncomment this if you plan to pass address up
  // onAddAddress: (address: Address) => void;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  open,
  onOpenChange,
  // onAddAddress
}) => {
  const [addressForm, setAddressForm] = useState({
    type: "Home",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAddress = () => {
    if (
      !addressForm.addressLine1 ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.pincode
    ) {
      alert("Please fill all required fields");
      return;
    }

    const formattedAddress = `${addressForm.addressLine1}${
      addressForm.addressLine2 ? ", " + addressForm.addressLine2 : ""
    }, ${addressForm.city}, ${addressForm.state} - ${addressForm.pincode}`;

    const newAddress: Address = {
      id: Date.now(),
      type: addressForm.type,
      address: formattedAddress,
      isDefault: addressForm.isDefault,
    };

    // onAddAddress(newAddress);

    setAddressForm({
      type: "Home",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });

    onOpenChange(false); // Close modal
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Address
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="addressType"
              className="text-gray-600 text-sm"
            >
              Address Type
            </Label>
            <RadioGroup
              id="addressType"
              defaultValue="Home"
              className="flex space-x-4"
              value={addressForm.type}
              onValueChange={(value) =>
                setAddressForm((prev) => ({ ...prev, type: value }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Home" id="home" />
                <Label htmlFor="home">Home</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Work" id="work" />
                <Label htmlFor="work">Work</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="addressLine1"
              className="text-gray-600 text-sm"
            >
              Address Line 1
            </Label>
            <Input
              id="addressLine1"
              name="addressLine1"
              placeholder="Street address"
              value={addressForm.addressLine1}
              onChange={handleAddressChange}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="addressLine2"
              className="text-gray-600 text-sm"
            >
              Address Line 2 (Optional)
            </Label>
            <Input
              id="addressLine2"
              name="addressLine2"
              placeholder="Apartment, suite, etc."
              value={addressForm.addressLine2}
              onChange={handleAddressChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-600 text-sm">
                City
              </Label>
              <Input
                id="city"
                name="city"
                placeholder="City"
                value={addressForm.city}
                onChange={handleAddressChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-gray-600 text-sm">
                State
              </Label>
              <Input
                id="state"
                name="state"
                placeholder="State"
                value={addressForm.state}
                onChange={handleAddressChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="pincode"
              className="text-gray-600 text-sm"
            >
              PIN Code
            </Label>
            <Input
              id="pincode"
              name="pincode"
              placeholder="PIN Code"
              value={addressForm.pincode}
              onChange={handleAddressChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={addressForm.isDefault}
              onCheckedChange={(checked) =>
                setAddressForm((prev) => ({
                  ...prev,
                  isDefault: checked === true,
                }))
              }
            />
            <Label htmlFor="isDefault" className="text-sm font-medium">
              Set as default address
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="border-gray-300 hover:bg-gray-100"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleSubmitAddress}
          >
            Save Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddressModal;
