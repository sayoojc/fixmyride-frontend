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

  // Initialize forms
  const addForm = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      owner: "",
      type: "sedan",
      color: "",
      status: "active",
      registrationDate: new Date().toISOString().split("T")[0],
    },
  });

  const editForm = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      owner: "",
      type: "sedan",
      color: "",
      status: "active",
      registrationDate: new Date().toISOString().split("T")[0],
    },
  });

  // Sample vehicle data (replace with API calls in production)
  const sampleVehicles: Vehicle[] = [
    {
      id: "VH-1001",
      make: "Toyota",
      model: "Camry",
      year: 2020,
      licensePlate: "ABC-1234",
      owner: "John Smith",
      status: "active",
      registrationDate: "2020-06-15",
      lastService: "2023-11-10",
      type: "sedan",
      color: "Silver",
    },
    {
      id: "VH-1002",
      make: "Honda",
      model: "CR-V",
      year: 2021,
      licensePlate: "DEF-5678",
      owner: "Sarah Johnson",
      status: "active",
      registrationDate: "2021-03-22",
      lastService: "2023-12-05",
      type: "suv",
      color: "Blue",
    },
    {
      id: "VH-1003",
      make: "Ford",
      model: "F-150",
      year: 2019,
      licensePlate: "GHI-9012",
      owner: "Michael Brown",
      status: "maintenance",
      registrationDate: "2019-08-30",
      lastService: "2024-01-18",
      type: "truck",
      color: "Red",
    },
    {
      id: "VH-1004",
      make: "Chevrolet",
      model: "Spark",
      year: 2022,
      licensePlate: "JKL-3456",
      owner: "Emily Davis",
      status: "active",
      registrationDate: "2022-01-12",
      lastService: "2024-02-20",
      type: "hatchback",
      color: "Green",
    },
    {
      id: "VH-1005",
      make: "BMW",
      model: "X5",
      year: 2021,
      licensePlate: "MNO-7890",
      owner: "Robert Wilson",
      status: "blocked",
      registrationDate: "2021-05-19",
      lastService: "2023-09-30",
      type: "suv",
      color: "Black",
    },
    {
      id: "VH-1006",
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      licensePlate: "PQR-1234",
      owner: "Jessica Lee",
      status: "active",
      registrationDate: "2023-02-14",
      lastService: "2024-03-01",
      type: "sedan",
      color: "White",
    },
    {
      id: "VH-1007",
      make: "Nissan",
      model: "Rogue",
      year: 2020,
      licensePlate: "STU-5678",
      owner: "David Martinez",
      status: "maintenance",
      registrationDate: "2020-11-08",
      lastService: "2023-10-12",
      type: "suv",
      color: "Gray",
    },
    {
      id: "VH-1008",
      make: "Harley-Davidson",
      model: "Sportster",
      year: 2021,
      licensePlate: "VWX-9012",
      owner: "Patricia Garcia",
      status: "active",
      registrationDate: "2021-07-25",
      lastService: "2023-12-15",
      type: "motorcycle",
      color: "Black",
    },
    {
      id: "VH-1009",
      make: "Dodge",
      model: "Grand Caravan",
      year: 2019,
      licensePlate: "YZA-3456",
      owner: "Thomas Rodriguez",
      status: "active",
      registrationDate: "2019-04-17",
      lastService: "2024-02-05",
      type: "van",
      color: "Silver",
    },
    {
      id: "VH-1010",
      make: "Audi",
      model: "A4",
      year: 2022,
      licensePlate: "BCD-7890",
      owner: "Jennifer Wilson",
      status: "blocked",
      registrationDate: "2022-09-03",
      lastService: "2023-11-28",
      type: "sedan",
      color: "Blue",
    },
    {
      id: "VH-1011",
      make: "Subaru",
      model: "Outback",
      year: 2021,
      licensePlate: "EFG-1234",
      owner: "Kevin Moore",
      status: "active",
      registrationDate: "2021-01-29",
      lastService: "2024-01-10",
      type: "suv",
      color: "Green",
    },
    {
      id: "VH-1012",
      make: "Mazda",
      model: "CX-5",
      year: 2020,
      licensePlate: "HIJ-5678",
      owner: "Amanda Taylor",
      status: "maintenance",
      registrationDate: "2020-10-14",
      lastService: "2023-12-20",
      type: "suv",
      color: "Red",
    },
  ];

  // Load vehicles on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setVehicles(sampleVehicles);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Get status badge variant
  const getStatusBadge = (status: Vehicle["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "maintenance":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Maintenance</Badge>;
      case "blocked":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Blocked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Handle vehicle type display
  const getVehicleTypeDisplay = (type: Vehicle["type"]) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Filter vehicles based on search and filters
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    const matchesType = typeFilter === "all" || vehicle.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // CRUD operations
  const addVehicle = (vehicleData: Omit<Vehicle, "id">) => {
    const newVehicle = {
      ...vehicleData,
      id: `VH-${1000 + vehicles.length + 1}`,
    };
    setVehicles([...vehicles, newVehicle as Vehicle]);
    setIsAddDialogOpen(false);
    addForm.reset();
  };

  const updateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(vehicles.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v)));
    setIsEditDialogOpen(false);
    setEditingVehicle(null);
    editForm.reset();
  };

  const deleteVehicle = (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
  };

  const toggleVehicleStatus = (id: string, newStatus: Vehicle["status"]) => {
    setVehicles(
      vehicles.map((vehicle) => (vehicle.id === id ? { ...vehicle, status: newStatus } : vehicle))
    );
  };

  // Set edit form values when editingVehicle changes
  useEffect(() => {
    if (editingVehicle) {
      editForm.reset({
        make: editingVehicle.make,
        model: editingVehicle.model,
        year: editingVehicle.year,
        licensePlate: editingVehicle.licensePlate,
        owner: editingVehicle.owner,
        type: editingVehicle.type,
        color: editingVehicle.color,
        status: editingVehicle.status,
        registrationDate: editingVehicle.registrationDate,
      });
    }
  }, [editingVehicle, editForm]);

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
            <TabsList>
              <TabsTrigger value="all">All Vehicles</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="blocked">Blocked</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Vehicle Database</CardTitle>
                  <CardDescription>Manage vehicle information, status, and details</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Search and filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                      <Input
                        placeholder="Search vehicles..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="sedan">Sedan</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="truck">Truck</SelectItem>
                          <SelectItem value="hatchback">Hatchback</SelectItem>
                          <SelectItem value="motorcycle">Motorcycle</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("all");
                          setTypeFilter("all");
                        }}
                      >
                        <RefreshCw size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Vehicles table */}
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-md bg-slate-200 animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-4 w-[250px] bg-slate-200 rounded animate-pulse" />
                            <div className="h-4 w-[200px] bg-slate-200 rounded animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Vehicle ID</TableHead>
                              <TableHead>Make & Model</TableHead>
                              <TableHead>License Plate</TableHead>
                              <TableHead>Owner</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Year</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedVehicles.length > 0 ? (
                              paginatedVehicles.map((vehicle) => (
                                <TableRow key={vehicle.id}>
                                  <TableCell className="font-medium">{vehicle.id}</TableCell>
                                  <TableCell>
                                    {vehicle.make} {vehicle.model}
                                  </TableCell>
                                  <TableCell>{vehicle.licensePlate}</TableCell>
                                  <TableCell>{vehicle.owner}</TableCell>
                                  <TableCell>{getVehicleTypeDisplay(vehicle.type)}</TableCell>
                                  <TableCell>{vehicle.year}</TableCell>
                                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreHorizontal size={16} />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setEditingVehicle(vehicle);
                                            setIsEditDialogOpen(true);
                                          }}
                                        >
                                          <Edit size={14} className="mr-2" />
                                          Edit Details
                                        </DropdownMenuItem>

                                        {vehicle.status !== "active" && (
                                          <DropdownMenuItem
                                            onClick={() => toggleVehicleStatus(vehicle.id, "active")}
                                          >
                                            <CheckCircle size={14} className="mr-2" />
                                            Set to Active
                                          </DropdownMenuItem>
                                        )}

                                        {vehicle.status !== "maintenance" && (
                                          <DropdownMenuItem
                                            onClick={() => toggleVehicleStatus(vehicle.id, "maintenance")}
                                          >
                                            <RefreshCw size={14} className="mr-2" />
                                            Set to Maintenance
                                          </DropdownMenuItem>
                                        )}

                                        {vehicle.status !== "blocked" && (
                                          <DropdownMenuItem
                                            onClick={() => toggleVehicleStatus(vehicle.id, "blocked")}
                                          >
                                            <Ban size={14} className="mr-2" />
                                            Block Vehicle
                                          </DropdownMenuItem>
                                        )}

                                        <DropdownMenuItem>
                                          <FileText size={14} className="mr-2" />
                                          Service History
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <DropdownMenuItem className="text-red-600">
                                              <Trash size={14} className="mr-2" />
                                              Delete
                                            </DropdownMenuItem>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Are you sure you want to delete this vehicle? This action cannot be
                                                undone.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction
                                                className="bg-red-600 hover:bg-red-700"
                                                onClick={() => deleteVehicle(vehicle.id)}
                                              >
                                                Delete
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={8} className="text-center py-6 text-slate-500">
                                  No vehicles found matching your filters.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {filteredVehicles.length > 0 && (
                        <Pagination className="mt-4">
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>

                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                              let pageToShow;

                              if (totalPages <= 5) {
                                pageToShow = i + 1;
                              } else if (currentPage <= 3) {
                                pageToShow = i + 1;
                                if (i === 4)
                                  return (
                                    <PaginationItem key={i}>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  );
                              } else if (currentPage >= totalPages - 2) {
                                pageToShow = totalPages - 4 + i;
                                if (i === 0)
                                  return (
                                    <PaginationItem key={i}>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  );
                              } else {
                                if (i === 0)
                                  return (
                                    <PaginationItem key={i}>
                                      <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
                                    </PaginationItem>
                                  );
                                if (i === 1)
                                  return (
                                    <PaginationItem key={i}>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  );
                                if (i === 3)
                                  return (
                                    <PaginationItem key={i}>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  );
                                if (i === 4)
                                  return (
                                    <PaginationItem key={i}>
                                      <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                                        {totalPages}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                pageToShow = currentPage + i - 2;
                              }

                              return (
                                <PaginationItem key={i}>
                                  <PaginationLink
                                    onClick={() => setCurrentPage(pageToShow)}
                                    isActive={currentPage === pageToShow}
                                  >
                                    {pageToShow}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}

                            <PaginationItem>
                              <PaginationNext
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="active">
              <Card>
                <CardHeader>
                  <CardTitle>Active Vehicles</CardTitle>
                  <CardDescription>All vehicles currently active in the system</CardDescription>
                </CardHeader>
                <CardContent>{/* Active vehicles will be displayed here - similar table as above but filtered */}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance">
              <Card>
                <CardHeader>
                  <CardTitle>Vehicles in Maintenance</CardTitle>
                  <CardDescription>Vehicles currently undergoing service or repairs</CardDescription>
                </CardHeader>
                <CardContent>{/* Maintenance vehicles will be displayed here */}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blocked">
              <Card>
                <CardHeader>
                  <CardTitle>Blocked Vehicles</CardTitle>
                  <CardDescription>Vehicles that have been blocked from service</CardDescription>
                </CardHeader>
                <CardContent>{/* Blocked vehicles will be displayed here */}</CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Add Vehicle Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>Enter the details of the new vehicle to add it to the system.</DialogDescription>
          </DialogHeader>

          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(addVehicle)} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="make">Make</FormLabel>
                      <FormControl>
                        <Input id="make" placeholder="Toyota" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="model">Model</FormLabel>
                      <FormControl>
                        <Input id="model" placeholder="Camry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="year">Year</FormLabel>
                      <FormControl>
                        <Input
                          id="year"
                          type="number"
                          placeholder="2023"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="licensePlate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="license">License Plate</FormLabel>
                      <FormControl>
                        <Input id="license" placeholder="ABC-1234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={addForm.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="owner">Owner</FormLabel>
                    <FormControl>
                      <Input id="owner" placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="type">Vehicle Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedan">Sedan</SelectItem>
                            <SelectItem value="suv">SUV</SelectItem>
                            <SelectItem value="truck">Truck</SelectItem>
                            <SelectItem value="hatchback">Hatchback</SelectItem>
                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                            <SelectItem value="van">Van</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="color">Color</FormLabel>
                      <FormControl>
                        <Input id="color" placeholder="Silver" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={addForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="status">Initial Status</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="registrationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="registration">Registration Date</FormLabel>
                    <FormControl>
                      <Input id="registration" type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Vehicle</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>
              Update the details of {editingVehicle?.make} {editingVehicle?.model}.
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit((data) => {
                if (editingVehicle) {
                  updateVehicle({ ...data, id: editingVehicle.id });
                }
              })}
              className="grid gap-4 py-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="edit-make">Make</FormLabel>
                      <FormControl>
                        <Input id="edit-make" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="edit-model">Model</FormLabel>
                      <FormControl>
                        <Input id="edit-model" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="edit-year">Year</FormLabel>
                      <FormControl>
                        <Input
                          id="edit-year"
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="licensePlate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="edit-license">License Plate</FormLabel>
                      <FormControl>
                        <Input id="edit-license" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="edit-owner">Owner</FormLabel>
                    <FormControl>
                      <Input id="edit-owner" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="edit-type">Vehicle Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="edit-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedan">Sedan</SelectItem>
                            <SelectItem value="suv">SUV</SelectItem>
                            <SelectItem value="truck">Truck</SelectItem>
                            <SelectItem value="hatchback">Hatchback</SelectItem>
                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                            <SelectItem value="van">Van</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="edit-color">Color</FormLabel>
                      <FormControl>
                        <Input id="edit-color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="edit-status">Status</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="edit-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="registrationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="edit-registration">Registration Date</FormLabel>
                    <FormControl>
                      <Input id="edit-registration" type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
              />

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleManagement;