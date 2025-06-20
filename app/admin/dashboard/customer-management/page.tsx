"use client";

import React, { useState, useEffect } from "react";
import { axiosPrivate } from "@/api/axios";
import createAdminApi from "@/services/adminApi";
import {
  UniversalTable,
  TableBadge,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const adminApi = createAdminApi(axiosPrivate);

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isListed: boolean;
};

const CustomerManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsersApi();
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleListing = async (email: string) => {
    try {
      const response = await adminApi.toggleListing(email);
      const updatedUser = response?.data.user;

      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.email === email) {
            return { ...user, isListed: updatedUser.isListed };
          }
          return user;
        })
      );
    } catch (error) {
      console.log("Toggle listing status failed", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const columns: TableColumn<User>[] = [
    {
      key: "name",
      header: "Name",
      className: "font-medium",
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "role",
      header: "Role",
      render: (value) => <TableBadge variant="outline">{value}</TableBadge>,
    },
    {
      key: "status",
      header: "Status",
      accessor: (user) => user.isListed,
      render: (isListed) => (
        <TableBadge variant={isListed ? "default" : "destructive"}>
          {isListed ? "Active" : "Blocked"}
        </TableBadge>
      ),
    },
  ];
  const actions: TableAction<User>[] = [
    {
      label: (item) => (item.isListed ? "Block" : "Unblock"),
      onClick: (user) => toggleListing(user.email),
      variant: (item) => (item.isListed ? "destructive" : "outline"),
    },
  ];
  return (
    <div className="flex h-screen bg-slate-50">
      <div className="flex-1 md:ml-64 transition-all duration-200 ease-in-out overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Customer Management
              </h2>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Tabs for main dashboard sections */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage system users and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-6">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <UniversalTable
                  title="User Management"
                  description="Manage system users and permissions"
                  data={users}
                  columns={columns}
                  actions={actions}
                  loading={false}
                  emptyMessage="No users found"
                />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default CustomerManagement;
