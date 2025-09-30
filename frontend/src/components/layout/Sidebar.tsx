import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  FileText, 
  Users, 
  UserCog, 
  Home,
  Battery,
  Settings,
  Heart,
  Phone,
  TrendingUp,
  Router,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Layout,
  Grid3X3,
  AlertTriangle,
  Activity,
  Wifi,
  User,
  Bell,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navigation = [
  { name: "Analytics Dashboard", href: "/", icon: BarChart3 },
  { name: "Live Site Monitor", href: "/live-calls", icon: Phone }
  /*
  ,
  { name: "Call Events", href: "/call-data", icon: Phone },
  { name: "Sensor Analytics", href: "/analytics", icon: Activity },
  { name: "Staff Performance", href: "/team", icon: Users },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Alert Management", href: "/insights", icon: AlertTriangle },
   */
];

const systemStatus = [
  /*{ 
    label: "System Status", 
    value: "Online", 
    icon: Wifi, 
    status: "online",
    showBadge: true 
  },
  { 
    label: "Units Connected", 
    value: "7/7", 
    icon: Router, 
    status: "success",
    showBadge: false 
  },*/
];

const notifications = [
  /*{
    id: 1,
    type: "Emergency Call",
    location: "Room 124A",
    time: "2 minutes ago",
    priority: "high",
    patient: "Mrs. Johnson"
  },
  {
    id: 2,
    type: "Bathroom Call",
    location: "Room 108B",
    time: "5 minutes ago",
    priority: "medium",
    patient: "Mr. Williams"
  },
  {
    id: 3,
    type: "Nurse Call",
    location: "Room 203C",
    time: "8 minutes ago",
    priority: "low",
    patient: "Ms. Davis"
  }*/
];

export const Sidebar = ({ isOpen, onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) => {
  
  const location = useLocation();

  return (
    <>
      {/* Fixed sidebar for desktop */}
      <div className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:w-16" : "lg:w-sidebar"
      )}>
        <SidebarContent 
          currentPath={location.pathname} 
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-sidebar transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent currentPath={location.pathname} showCloseButton onClose={onClose} />
      </div>
    </>
  );
};

interface SidebarContentProps {
  currentPath: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const SidebarContent = ({ currentPath, showCloseButton, onClose, isCollapsed = false, onToggleCollapse }: SidebarContentProps) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="flex grow flex-col gap-y-6 overflow-y-auto bg-nav-background px-6 pb-4">
      {/* Header */}
      <div className={cn(
        "flex h-header shrink-0 items-center transition-all duration-300",
        isCollapsed ? "justify-center px-0" : "justify-between"
      )}>
        {!isCollapsed && (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-nav-foreground">
                CareCall Analytics
              </span>
            </div>
            <span className="text-sm text-muted-foreground ml-10">
              Nurse Call Reporting
            </span>
          </div>
        )}
        
        {isCollapsed && (
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
        
        {showCloseButton && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-nav-foreground hover:bg-nav-hover"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        {onToggleCollapse && !showCloseButton && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              "sidebar-toggle-btn p-2 rounded-lg text-nav-foreground hover:bg-nav-hover transition-all duration-200",
              isCollapsed && "absolute top-4 -right-12 bg-nav-background border border-border shadow-lg"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      
      {/* Navigation Section */}
      <nav className="flex flex-1 flex-col gap-y-6">
        {!isCollapsed && (
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Navigation
          </div>
        )}
        
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "nav-item group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 relative transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-nav-foreground hover:bg-nav-hover",
                    isCollapsed && "justify-center px-3"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="nav-item-icon h-4 w-4 shrink-0" />
                  {!isCollapsed && (
                    <span className="transition-opacity duration-200">
                      {item.name}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="sidebar-tooltip absolute left-full ml-2 px-2 py-1 bg-nav-background border border-border rounded-md text-xs text-nav-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        
        {/* System Status Section */}
        <div className="mt-auto space-y-4">
          {!isCollapsed && (
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              System Status
            </div>
          )}
          
          <div className="space-y-3">
            {systemStatus.map((status) => {
              const Icon = status.icon;
              
              return (
                <div 
                  key={status.label}
                  className={cn(
                    "flex items-center gap-3 text-sm",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? `${status.label}: ${status.value}` : undefined}
                >
                  <Icon className={cn(
                    "h-4 w-4 shrink-0",
                    status.status === "online" && "text-green-500",
                    status.status === "warning" && "text-orange-500",
                    status.status === "success" && "text-green-500"
                  )} />
                  
                  {!isCollapsed && (
                    <>
                      <span className="text-nav-foreground flex-1">{status.label}</span>
                      {status.showBadge ? (
                        <Badge 
                          variant={status.status === "online" ? "default" : status.status === "warning" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {status.value}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">{status.value}</span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
            
            {/* Call Bell Notifications */}
            <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <PopoverTrigger asChild>
                {/*}
                <button 
                  className={cn(
                    "flex items-center gap-3 text-sm w-full hover:bg-nav-hover rounded-lg p-2 transition-colors",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? "Active Calls: 3" : undefined}
                >
                  <div className="relative">
                    <Bell className="h-4 w-4 shrink-0 text-orange-500" />
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
                  </div>
                  
                  {!isCollapsed && (
                    <>
                      <span className="text-nav-foreground flex-1">Active Calls</span>
                      <Badge variant="destructive" className="text-xs">
                        3
                      </Badge>
                    </>
                  )}
                </button>
                */}
              </PopoverTrigger>
              <PopoverContent 
                className="w-80 p-0" 
                side={isCollapsed ? "right" : "top"}
                align="start"
              >
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-sm">Active Call Notifications</h3>
                  <p className="text-xs text-muted-foreground">Recent nurse calls requiring attention</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={cn(
                              "h-2 w-2 rounded-full",
                              notification.priority === "high" && "bg-red-500",
                              notification.priority === "medium" && "bg-orange-500",
                              notification.priority === "low" && "bg-blue-500"
                            )} />
                            <span className="text-sm font-medium truncate">{notification.type}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{notification.patient}</p>
                          <p className="text-xs text-muted-foreground">{notification.location}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <button className="w-full text-xs text-primary hover:text-primary/80 transition-colors">
                    View All Notifications
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* User Section */}
        <div className={cn(
          "border-t border-border pt-4 mt-4",
          isCollapsed && "px-0"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-nav-foreground">Administrator</span>
                <span className="text-xs text-muted-foreground">Quality & Analytics Team</span>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};