import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  UserPlus, 
  Search,
  MoreHorizontal,
  Mail,
  Phone
} from "lucide-react";

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      email: "john@company.com",
      role: "Team Lead",
      department: "Analytics",
      status: "active",
      avatar: "JS",
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@company.com", 
      role: "Senior Analyst",
      department: "Analytics",
      status: "active",
      avatar: "SJ",
      lastActive: "1 hour ago"
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@company.com",
      role: "Data Scientist",
      department: "Research",
      status: "away",
      avatar: "MC",
      lastActive: "4 hours ago"
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@company.com",
      role: "Project Manager",
      department: "Operations",
      status: "active",
      avatar: "ED",
      lastActive: "30 minutes ago"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "away":
        return "bg-primary/10 text-primary";
      case "offline":
        return "bg-muted/10 text-muted-foreground";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Team Lead":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "Senior Analyst":
        return "bg-primary/10 text-primary border-primary/20";
      case "Project Manager":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted/10 text-muted-foreground border-border";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your team members and their permissions
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="metric-card rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold text-card-foreground">24</p>
              </div>
            </div>
          </div>
          
          <div className="metric-card rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <div className="h-5 w-5 rounded-full bg-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Now</p>
                <p className="text-2xl font-bold text-card-foreground">18</p>
              </div>
            </div>
          </div>
          
          <div className="metric-card rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Mail className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Invites</p>
                <p className="text-2xl font-bold text-card-foreground">3</p>
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
                placeholder="Search team members..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="text-card-foreground border-border hover:bg-muted">
              All Departments
            </Button>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="dashboard-card rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-foreground">
                      {member.avatar}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {member.department}
                    </p>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-card-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                    {member.role}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Last active: {member.lastActive}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 text-card-foreground border-border hover:bg-muted">
                  <Mail className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline" size="sm" className="text-card-foreground border-border hover:bg-muted">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Team;