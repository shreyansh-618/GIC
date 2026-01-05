"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Edit } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "admin";
  joinDate: string;
  status: "active" | "inactive";
}

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      email: "raj@example.com",
      name: "Raj Kumar",
      role: "student",
      joinDate: "2024-09-01",
      status: "active",
    },
    {
      id: "2",
      email: "priya@example.com",
      name: "Priya Singh",
      role: "teacher",
      joinDate: "2024-08-15",
      status: "active",
    },
    {
      id: "3",
      email: "amit@example.com",
      name: "Amit Patel",
      role: "student",
      joinDate: "2024-10-01",
      status: "active",
    },
    {
      id: "4",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      joinDate: "2024-01-01",
      status: "active",
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-600">Admin</Badge>;
      case "teacher":
        return <Badge className="bg-blue-600">Teacher</Badge>;
      case "student":
        return <Badge variant="secondary">Student</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-600 mt-2">
          View and manage all registered users
        </p>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-gray-600">No users found</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {getRoleBadge(user.role)}
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                      >
                        {user.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-xs text-gray-600">
                        Joined: {new Date(user.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
