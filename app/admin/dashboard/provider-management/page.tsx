"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye } from "lucide-react";
import createAdminApi from "@/services/adminApi";
import { axiosPrivate } from "@/api/axios";
import { toast } from "react-toastify";
import {
  UniversalTable,
  TableBadge,
  TableAvatar,
  type TableColumn,
  type TableAction,
} from "../../../../components/Table";
// Import shadcn components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IServiceProvider } from "@/types/provider";
const adminApi = createAdminApi(axiosPrivate);
const ProviderManagement = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [providers, setProviders] = useState<IServiceProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch providers data
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await adminApi.getProvidersList(
          searchTerm,
          currentPage,
          statusFilter
        );
        console.log("response", response);
        setProviders(response.data.providerResponse.sanitizedProviders);
        setTotalPages(response.data.providerResponse.totalPage);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
        setLoading(false);
        toast.error("Failed to fetch providers");
      }
    };

    fetchProviders();
    setLoading(false);
  }, [searchTerm, currentPage, statusFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const actions: TableAction<IServiceProvider>[] = [
    {
      label: "Verify",
      onClick: () => {},
      variant: "outline",
      icon: <Eye className="h-4 w-4" />,
      disabled: (provider) =>
        !provider.verificationStatus ||
        provider.verificationStatus !== "pending",
    },
    {
      label: (item) => (item.isListed ? "Unlist" : "List"),
      onClick: (provider) => toggleProviderStatus(provider._id),
      variant: (item) => (item.isListed ? "destructive" : "outline"),
    },
  ];

  const columns: TableColumn<IServiceProvider>[] = [
    {
      key: "provider",
      header: "Provider",
      render: (_, provider) => (
        <TableAvatar
          src={provider.profilePicture}
          fallback={provider.name.charAt(0)}
          name={provider.name}
          email={provider.email}
        />
      ),
    },
    {
      key: "name",
      header: "Business Name",
    },
    {
      key: "ownerName",
      header: "Owner",
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      key: "verificationStatus",
      header: "Verification",
      render: (status) => (
        <TableBadge
          variant={
            status === "approved"
              ? "default"
              : status === "rejected"
              ? "destructive"
              : "secondary"
          }
        >
          {status || "Pending"}
        </TableBadge>
      ),
    },
  ];

  // Placeholder for toggling provider listing status
  const toggleProviderStatus = async (providerId: string) => {
    try {
      const provider = providers.find((p) => p._id === providerId); // Assuming email as unique ID
      if (!provider) return;
      console.log("abc");
      const updatedStatus = !provider.isListed;
      await adminApi.toggleProviderListing(providerId);
      setProviders(
        providers.map((p) =>
          p._id === providerId ? { ...p, isListed: updatedStatus } : p
        )
      );
      toast.success(
        `Provider ${updatedStatus ? "listed" : "unlisted"} successfully`
      );
    } catch (error) {
      console.error("Failed to update provider status:", error);
      toast.error("Failed to update provider status");
    }
  };

  return (
    <div className="flex-1 md:ml-64 transition-all duration-200 ease-in-out overflow-y-auto">
      {/* Top header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Provider Management
            </h2>
            <p className="text-sm text-slate-500">
              Manage and verify service providers
            </p>
          </div>
        </div>
      </header>
      <div className="relative flex-1">
        <input
          placeholder="Search Providers..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <Button onClick={() => setStatusFilter("all")}>Reset</Button>
      </div>
      {/* Main content */}
      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Service Providers</CardTitle>
            <CardDescription>
              {providers.length} providers found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col gap-4 py-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 animate-pulse"
                  >
                    <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-8 bg-slate-200 rounded w-24"></div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="overflow-x-auto"
              >
                <UniversalTable
                  title="Provider Management"
                  description="Manage service providers and their verification status"
                  data={providers}
                  columns={columns}
                  actions={actions}
                  loading={false}
                  emptyMessage="No providers found matching your filters"
                />
              </motion.div>
            )}
          </CardContent>
        </Card>
        <div className="flex justify-center items-center gap-4 mt-6">
          {/* Minus / Prev Button */}
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md border text-sm font-medium ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100 text-gray-800 border-gray-300"
            }`}
          >
            Prev
          </button>
          <span className="px-4 py-2 border rounded-md text-sm font-semibold bg-blue-100 text-blue-700">
            Page {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md border text-sm font-medium ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100 text-gray-800 border-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProviderManagement;
