"use client"

import { motion } from "framer-motion"
import { CreditCard, Wallet, DollarSign, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { CheckoutStepProps } from "../../../../types/checkout"

export function PaymentSection({ data, onUpdate, onBack }: CheckoutStepProps) {
  const handlePaymentMethodChange = (method: "card" | "wallet" | "cash") => {
    onUpdate({ paymentMethod: method })
  }

  const handleCheckout = () => {
    // Handle final checkout logic here
    console.log("Processing checkout with data:", data)
    alert("Order placed successfully!")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Service</span>
                <span className="text-gray-900">Vehicle Repair Service</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Time Slot</span>
                <span className="text-gray-900">{data.selectedSlot?.time}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Address</span>
                <span className="text-gray-900">{data.selectedAddress?.name}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Service Fee</span>
                <span className="text-gray-900">₹99.00</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span className="text-gray-900">₹9.90</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">₹108.90</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Payment Method
            </CardTitle>
            <CardDescription>Choose your preferred payment method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={data.paymentMethod}
              onValueChange={handlePaymentMethodChange}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-50 [&:has([data-state=checked])]:border-red-500 [&:has([data-state=checked])]:bg-red-50 cursor-pointer"
                >
                  <CreditCard className="mb-3 h-6 w-6" />
                  Card
                </Label>
              </div>
              <div>
                <RadioGroupItem value="wallet" id="wallet" className="peer sr-only" />
                <Label
                  htmlFor="wallet"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-50 [&:has([data-state=checked])]:border-red-500 [&:has([data-state=checked])]:bg-red-50 cursor-pointer"
                >
                  <Wallet className="mb-3 h-6 w-6" />
                  Wallet
                </Label>
              </div>
              <div>
                <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                <Label
                  htmlFor="cash"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-50 [&:has([data-state=checked])]:border-red-500 [&:has([data-state=checked])]:bg-red-50 cursor-pointer"
                >
                  <DollarSign className="mb-3 h-6 w-6" />
                  Cash
                </Label>
              </div>
            </RadioGroup>

            {data.paymentMethod === "card" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4 p-4 bg-gray-50 rounded-lg border"
              >
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input id="cardName" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="month">Month</Label>
                    <Select>
                      <SelectTrigger id="month">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                            {String(i + 1).padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select>
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={2024 + i} value={String(2024 + i)}>
                            {2024 + i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
              </motion.div>
            )}

            {data.paymentMethod === "wallet" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 bg-gray-50 rounded-lg border text-center"
              >
                <p className="text-sm text-gray-600">
                  You will be redirected to your wallet provider to complete the payment.
                </p>
              </motion.div>
            )}

            {data.paymentMethod === "cash" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 bg-gray-50 rounded-lg border text-center"
              >
                <p className="text-sm text-gray-600">You can pay with cash when the service provider arrives.</p>
              </motion.div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onBack} className="hover:bg-gray-50">
                Back
              </Button>
              <Button onClick={handleCheckout} className="min-w-32 bg-red-500 hover:bg-red-600 text-white">
                Place Order - ₹108.90
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
