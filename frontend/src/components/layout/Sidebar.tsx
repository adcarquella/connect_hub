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
  Grid3X3
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  /*
    { name: "Reports", href: "/reports", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Team", href: "/team", icon: Users },
  { name: "Users", href: "/users", icon: UserCog },
  { name: "Battery", href: "/battery", icon: Battery },
  { name: "Senior Living", href: "/senior-living", icon: Heart },
  { name: "Care Plan", href: "/care-plan", icon: Heart },
  { name: "Move Tracking", href: "/move", icon: MapPin },
  { name: "Floor Plan", href: "/floor-plan", icon: Layout },
  { name: "Call Data", href: "/call-data", icon: Phone },
  { name: "Call List", href: "/call-list", icon: Phone },
  { name: "Insights", href: "/insights", icon: TrendingUp },
  { name: "Devices", href: "/devices", icon: Router },
  { name: "Configuration", href: "/configuration", icon: Settings },
  { name: "Style Guide", href: "/style", icon: Settings },
  { name: "Examples", href: "/examples", icon: Grid3X3 },
   */
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
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-nav-background px-6 pb-4">
      <div className={cn(
        "flex h-header shrink-0 items-center transition-all duration-300",
        isCollapsed ? "justify-center px-0" : "justify-between"
      )}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-nav-foreground">
              Arquella
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
      
      <nav className="flex flex-1 flex-col">
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
                      : "text-nav-foreground hover:text-white",
                    isCollapsed && "justify-center px-3"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="nav-item-icon h-5 w-5 shrink-0" />
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
      </nav>
    </div>
  );
};