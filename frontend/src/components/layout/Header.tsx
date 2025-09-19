import { Menu, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <div className="sticky top-0 z-40 bg-nav-background/80 backdrop-blur-md border-b border-border">
      <div className="flex h-header items-center gap-x-4 px-6 lg:px-8">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-nav-foreground hover:text-white hover:bg-nav-hover"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="flex flex-1 gap-x-4 self-stretch">
          {/*
          <form className="relative flex flex-1 max-w-md" action="#" method="GET">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground pl-3" />
            <Input
              id="search-field"
              className="block h-full w-full border-0 bg-transparent py-0 pl-10 pr-0 text-foreground placeholder:text-muted-foreground focus:ring-0 sm:text-sm"
              placeholder="Search clients, reports..."
              type="search"
              name="search"
            />
          </form>
          */}
        </div>
            
        {/* Right side */}
        <div className="flex items-center gap-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-nav-foreground hover:text-white hover:bg-nav-hover"
          >
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">
              JD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};