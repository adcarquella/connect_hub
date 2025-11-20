import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  UserCog, 
  UserPlus, 
  Search,
  Filter,
  Shield,
  Eye,
  Edit3
} from "lucide-react";

const Users = () => {
  const users = [
    {
      id: 1,
      name: "Alice Cooper",
      email: "alice@client1.com",
      company: "Acme Corp",
      role: "Admin",
      permissions: ["read", "write", "delete"],
      lastLogin: "2024-01-15",
      status: "active"
    },
    {
      id: 2,
      name: "Bob Wilson",
      email: "bob@client2.com",
      company: "TechStart Inc",
      role: "Viewer",
      permissions: ["read"],
      lastLogin: "2024-01-14",
      status: "active"
    },
    {
      id: 3,
      name: "Carol Brown",
      email: "carol@client3.com",
      company: "Global Solutions",
      role: "Editor",
      permissions: ["read", "write"],
      lastLogin: "2024-01-10",
      status: "inactive"
    },
    {
      id: 4,
      name: "David Lee",
      email: "david@client4.com",
      company: "Innovation Labs",
      role: "Admin",
      permissions: ["read", "write", "delete"],
      lastLogin: "2024-01-13",
      status: "active"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "inactive":
        return "bg-muted/10 text-muted-foreground";
      case "pending":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-destructive/10 text-destructive";
      case "Editor":
        return "bg-primary/10 text-primary";
      case "Viewer":
        return "bg-secondary/10 text-secondary";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="mt-2 text-muted-foreground">
              Manage client users, roles, and permissions
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="metric-card rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <UserCog className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-card-foreground">156</p>
              </div>
            </div>
          </div>
          
          <div className="metric-card rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <div className="h-5 w-5 rounded-full bg-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-card-foreground">142</p>
              </div>
            </div>
          </div>
          
          <div className="metric-card rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Shield className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-card-foreground">12</p>
              </div>
            </div>
          </div>
          
          <div className="metric-card rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-card-foreground">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="dashboard-card rounded-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="text-card-foreground border-border hover:bg-muted">
              <Filter className="h-4 w-4 mr-2" />
              Role
            </Button>
            <Button variant="outline" className="text-card-foreground border-border hover:bg-muted">
              <Filter className="h-4 w-4 mr-2" />
              Company
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="dashboard-card rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-card-foreground">Client Users</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/10">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-primary-foreground">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-card-foreground">
                            {user.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                      {user.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary-hover hover:bg-primary/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-card-foreground hover:bg-muted/10"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Users;