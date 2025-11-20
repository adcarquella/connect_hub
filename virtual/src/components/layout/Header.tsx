import { useEffect, useState } from "react";
import { Menu, Bell, Clock, AlertTriangle, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { sendEncryptedData } from "@/api/apiClient";
import { useAuth0 } from "@auth0/auth0-react";
import IMG_LOG from "../../images/logo.png";


interface HeaderProps {
  onMenuClick: () => void;
}

interface ApiResponse {
  data: {
    user: {
      id: number;
      email: string;
      surname: string;
      firstName: string;
    };
    site: {
      id: number;
      name: string;
      code: string;
    };
  };
}

const notifications = [
  {
    id: 1,
    type: "Emergency Call",
    location: "Room 124A",
    time: "2 minutes ago",
    priority: "high",
    patient: "Mrs. Johnson",
    message: "Emergency assistance required"
  },
  {
    id: 2,
    type: "Bathroom Call",
    location: "Room 108B",
    time: "5 minutes ago",
    priority: "medium",
    patient: "Mr. Williams",
    message: "Assistance needed in bathroom"
  },
  {
    id: 3,
    type: "Nurse Call",
    location: "Room 203C",
    time: "8 minutes ago",
    priority: "low",
    patient: "Ms. Davis",
    message: "Routine assistance requested"
  }
];

export const Header = ({ onMenuClick }: HeaderProps) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userData, setUserData] = useState<ApiResponse["data"]["user"] | null>(null);
  const [siteData, setSiteData] = useState<ApiResponse["data"]["site"] | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const { toast } = useToast();

  const { loginWithRedirect, logout, isAuthenticated, user, isLoading, error } = useAuth0();

  useEffect(() => {
    const fetchUserConfig = async () => {
      try {
        
        const res = await sendEncryptedData("user/config", 
          {
            username: "andrewchapman@arquella.co.uk",
            user_guid: "asdlkasdoiad",
          }
        );

        if (!res.data) throw new Error("Failed to fetch user data");
        const data: ApiResponse = await res;
        setUserData(data.data.user);
        setSiteData(data.data.site);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error fetching user details",
          description: "Could not load user information from API.",
          variant: "destructive",
        });
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserConfig();
  }, [toast]);

  const handleLogout = () => {
    
    logout().then((d)=>{
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }).
    catch(e=>{
      toast({
        title: "Logged out error",
        description: e.toString(),
    });
    });
    
  };

  return (
    <div className="sticky top-0 z-40 bg-nav-background/80 backdrop-blur-md border-b border-border">
      <div className="flex h-header items-center gap-x-4 px-6 lg:px-8">
        <img src={IMG_LOG} className="header_company_logo" />
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-nav-foreground hover:text-white hover:bg-nav-hover"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Spacer for search bar */}
        <div className="flex flex-1 gap-x-4 self-stretch" />

        {/* Right side */}
        <div className="flex items-center gap-x-4">
          {/* Notifications */}
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative text-nav-foreground hover:text-white hover:bg-nav-hover"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <Badge variant="secondary" className="text-xs">
                    {notifications.length}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Recent nurse call alerts</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              notification.priority === "high" && "bg-red-500",
                              notification.priority === "medium" && "bg-orange-500",
                              notification.priority === "low" && "bg-blue-500"
                            )}
                          />
                          <span className="text-sm font-medium truncate">{notification.type}</span>
                          {notification.priority === "high" && (
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm text-foreground mb-1">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{notification.patient}</span>
                          <span>•</span>
                          <span>{notification.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                        <Clock className="h-3 w-3" />
                        <span>{notification.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border">
                <button
                  className="w-full text-xs text-primary hover:text-primary/80 transition-colors"
                  onClick={() => setNotificationsOpen(false)}
                >
                  View All Notifications
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="text-sm font-medium text-primary-foreground">
                    {loadingUser
                      ? "..."
                      : userData
                      ? `${userData.firstName[0]}${userData.surname[0]}`.toUpperCase()
                      : "?"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {loadingUser ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : userData ? (
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userData.firstName} {userData.surname}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData.email}
                    </p>
                    {siteData && (
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {siteData.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">User not found</p>
                )}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              {/*
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};