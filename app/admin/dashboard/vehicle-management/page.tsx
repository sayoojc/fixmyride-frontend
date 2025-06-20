"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash, Ban, CheckCircle, FileText, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Import shadcn components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define interfaces
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  owner: string;
  status: "active" | "maintenance" | "blocked";
  registrationDate: string;
  lastService?: string;
  type: "sedan" | "suv" | "truck" | "hatchback" | "motorcycle" | "van";
  color: string;
}

// Define form schema for validation
const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900, "Year must be valid").max(new Date().getFullYear(), "Year cannot be in the future"),
  licensePlate: z.string().min(1, "License plate is required"),
  owner: z.string().min(1, "Owner is required"),
  type: z.enum(["sedan", "suv", "truck", "hatchback", "motorcycle", "van"]),
  color: z.string().min(1, "Color is required"),
  status: z.enum(["active", "maintenance", "blocked"]),
  registrationDate: z.string().min(1, "Registration date is required"),
});

const VehicleManagement: React.FC = () => {
  // State management
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;



  return (
    <div className="flex h-screen bg-slate-50">
      {/* Main content */}
      <div className="flex-1 md:ml-64 transition-all duration-200 ease-in-out overflow-y-auto">
        {/* Top header */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Vehicle Management</h2>
              <p className="text-sm text-slate-500">Manage all registered vehicles</p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Add Vehicle
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <Tabs defaultValue="all" className="mb-6">
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default VehicleManagement;