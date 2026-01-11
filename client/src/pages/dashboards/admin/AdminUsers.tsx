"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  isVerified: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setError(null);
      const data = await apiRequest("/admin/users");
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Users</h1>
        <p className="text-gray-600 mt-1">
          View registered students, teachers, and admins
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <Card>
          <CardContent className="py-6 text-center text-red-600">
            {error}
          </CardContent>
        </Card>
      )}

      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            No users found
          </CardContent>
        </Card>
      ) : (
        filteredUsers.map((u) => (
          <Card key={u.id}>
            <CardContent className="pt-6 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{u.name}</h3>
                <p className="text-sm text-gray-600">{u.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{u.role}</Badge>
                  <Badge
                    className={u.isVerified ? "bg-green-600" : "bg-orange-500"}
                  >
                    {u.isVerified ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>

              <span className="text-xs text-gray-500">
                Joined {new Date(u.createdAt).toLocaleDateString()}
              </span>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
