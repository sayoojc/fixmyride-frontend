// "use client"

// import React, { useEffect, useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { PlusCircle } from "lucide-react";
// import createUserApi from '@/services/userApi';
// import { axiosPrivate } from '@/api/axios';
// const userApi = createUserApi(axiosPrivate);

// // interface Vehicle {
// //   id: number;
// //   model: string;
// //   type: string;
// //   regNumber: string;
// //   year: string;
// // }
// interface AddVehicleModalProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//   }

//   export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ open, onOpenChange }) => {
//     const [brands, setBrands] = useState<any[]>([]);
// const [selectedBrand, setSelectedBrand] = useState<any>(null);
// const [selectedModel, setSelectedModel] = useState<any>(null);


// useEffect(() => {
//     if (!open) return;
  
//     const fetchBrandsAndModels = async () => {
//       try {
//         const response = await userApi.getBrandAndModels();
//         console.log("Response", response);
//         if (response.success) {
//           setBrands(response.brand);
//         }
//       } catch (error) {
//         console.error("Failed to fetch brands and models:", error);
//       }
//     };
  
//     fetchBrandsAndModels();
//   }, [open]);
  

//     const currentYear = new Date().getFullYear();
//     const [vehicleForm, setVehicleForm] = useState({
//       model: '',
//       type: 'Petrol',
//       regNumber: '',
//       year: currentYear.toString()
//     });
  
//     const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const { name, value } = e.target;
//       setVehicleForm(prev => ({ ...prev, [name]: value }));
//     };
  
//     const handleSubmitVehicle = () => {
//       if (!vehicleForm.model || !vehicleForm.regNumber) {
//         alert('Please fill all required fields');
//         return;
//       }
  
//       // Reset form
//       setVehicleForm({
//         model: '',
//         type: 'Petrol',
//         regNumber: '',
//         year: currentYear.toString()
//       });
  
//       // Close dialog
//       onOpenChange(false);
//     };
  
//     const years = Array.from({ length: currentYear - 1989 }, (_, i) => (currentYear - i).toString());
  
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogTrigger asChild>
//         <Button className="bg-red-500 hover:bg-red-600 text-white">
//           <PlusCircle className="h-4 w-4 mr-2" /> ADD NEW VEHICLE
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-semibold">Add New Vehicle</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="space-y-2">
//             <Label htmlFor="vehicleModel" className="text-gray-600 text-sm">Vehicle Model</Label>
//             <Input 
//               id="vehicleModel"
//               name="model"
//               placeholder="e.g. Tata Tiago, Hyundai i20"
//               value={vehicleForm.model}
//               onChange={handleVehicleChange}
//             />
//           </div>
//           <div className="space-y-2">
//   <Label className="text-gray-600 text-sm">Select Brand</Label>
//   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//     {brands.map((brand) => (
//       <div
//         key={brand._id}
//         onClick={() => {
//           setSelectedBrand(brand);
//           setSelectedModel(null); // reset previously selected model
//         }}
//         className={`border rounded-lg p-2 cursor-pointer text-center transition-all ${
//           selectedBrand?._id === brand._id ? 'border-red-500 ring-2 ring-red-400' : 'hover:shadow-md'
//         }`}
//       >
//         <img src={brand.imageUrl} alt={brand.brandName} className="w-full h-20 object-contain" />
//         <p className="text-sm mt-1">{brand.brandName}</p>
//       </div>
//     ))}
//     {selectedBrand && (
//   <div className="space-y-2">
//     <Label className="text-gray-600 text-sm">Select Model</Label>
//     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//       {selectedBrand.models.map((model: any) => (
//         <div
//           key={model._id}
//           onClick={() => setSelectedModel(model)}
//           className={`border rounded-lg p-2 cursor-pointer text-center transition-all ${
//             selectedModel?._id === model._id ? 'border-green-500 ring-2 ring-green-400' : 'hover:shadow-md'
//           }`}
//         >
//           <img src={model.imageUrl} alt={model.name} className="w-full h-20 object-contain" />
//           <p className="text-sm mt-1">{model.name}</p>
//         </div>
//       ))}
//     </div>
//   </div>
// )}

//   </div>
// </div>
//           <div className="space-y-2">
//             <Label htmlFor="vehicleType" className="text-gray-600 text-sm">Fuel Type</Label>
//             <Select 
//               value={vehicleForm.type}
//               onValueChange={(value) => setVehicleForm(prev => ({...prev, type: value}))}
//             >
//               <SelectTrigger id="vehicleType">
//                 <SelectValue placeholder="Select fuel type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Petrol">Petrol</SelectItem>
//                 <SelectItem value="Diesel">Diesel</SelectItem>
//                 <SelectItem value="Electric">Electric</SelectItem>
//                 <SelectItem value="CNG">CNG</SelectItem>
//                 <SelectItem value="Hybrid">Hybrid</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="regNumber" className="text-gray-600 text-sm">Registration Number</Label>
//             <Input 
//               id="regNumber"
//               name="regNumber"
//               placeholder="e.g. KL-01-AB-1234"
//               value={vehicleForm.regNumber}
//               onChange={handleVehicleChange}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="vehicleYear" className="text-gray-600 text-sm">Manufacturing Year</Label>
//             <Select 
//               value={vehicleForm.year}
//               onValueChange={(value) => setVehicleForm(prev => ({...prev, year: value}))}
//             >
//               <SelectTrigger id="vehicleYear">
//                 <SelectValue placeholder="Select year" />
//               </SelectTrigger>
//               <SelectContent>
//                 {years.map(year => (
//                   <SelectItem key={year} value={year}>{year}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//         <DialogFooter>
//         <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleSubmitVehicle}>
//             Save Vehicle
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddVehicleModal;

import React, { useEffect, useState } from "react";

type Brand = {
  id: number;
  name: string;
  logo: string;
};

type Model = {
  id: number;
  name: string;
  image: string;
};

type AddVehicleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Dummy Data — replace with actual API
const brands: Brand[] = [
  { id: 1, name: "Maruti", logo: "/images/maruti.png" },
  { id: 2, name: "Hyundai", logo: "/images/hyundai.png" },
];

const allModels: Record<string, Model[]> = {
  Maruti: [
    { id: 1, name: "Swift", image: "/images/swift.png" },
    { id: 2, name: "Baleno", image: "/images/baleno.png" },
    { id: 3, name: "Alto", image: "/images/alto.png" },
  ],
  Hyundai: [
    { id: 4, name: "i20", image: "/images/i20.png" },
    { id: 5, name: "Creta", image: "/images/creta.png" },
  ],
};

const fuelOptions = ["Petrol", "Diesel", "CNG", "Electric"];

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState<"brand" | "model" | "fuel" | "final">("brand");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedFuel, setSelectedFuel] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setStep("brand");
      setSelectedBrand(null);
      setSelectedModel(null);
      setSelectedFuel(null);
    }
  }, [open]);

  const models = selectedBrand ? allModels[selectedBrand.name] || [] : [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-2 text-gray-600 text-xl"
        >
          &times;
        </button>

        {step === "brand" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Select Brand</h2>
            <div className="grid grid-cols-3 gap-4">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setStep("model");
                  }}
                  className="cursor-pointer text-center hover:bg-gray-100 p-2 rounded"
                >
                  <img src={brand.logo} alt={brand.name} className="w-16 h-16 mx-auto" />
                  <p className="mt-2 text-sm">{brand.name}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {step === "model" && (
          <>
            <button onClick={() => setStep("brand")} className="text-sm text-blue-500 mb-2">
              ← Back to brands
            </button>
            <h2 className="text-xl font-semibold mb-4">Select Model</h2>
            <div className="grid grid-cols-3 gap-4">
              {models.map((model) => (
                <div
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model);
                    setStep("fuel");
                  }}
                  className="cursor-pointer text-center hover:bg-gray-100 p-2 rounded"
                >
                  <img src={model.image} alt={model.name} className="w-16 h-16 mx-auto" />
                  <p className="mt-2 text-sm">{model.name}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {step === "fuel" && (
          <>
            <button onClick={() => setStep("model")} className="text-sm text-blue-500 mb-2">
              ← Back to models
            </button>
            <h2 className="text-xl font-semibold mb-4">Select Fuel Type</h2>
            <div className="grid grid-cols-2 gap-4">
              {fuelOptions.map((fuel) => (
                <div
                  key={fuel}
                  onClick={() => {
                    setSelectedFuel(fuel);
                    setStep("final");
                  }}
                  className="cursor-pointer p-4 border rounded-lg text-center shadow hover:bg-blue-50"
                >
                  {fuel}
                </div>
              ))}
            </div>
          </>
        )}

        {step === "final" && (
          <>
            <h2 className="text-xl font-semibold mb-4">You're All Set!</h2>
            <ul className="space-y-2 text-gray-700">
              <li>🚗 Brand: {selectedBrand?.name}</li>
              <li>📘 Model: {selectedModel?.name}</li>
              <li>🛢️ Fuel: {selectedFuel}</li>
            </ul>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => onOpenChange(false)}
            >
              Confirm & Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddVehicleModal;
