import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  FileBarChart,
  LayoutDashboard,
  Settings,
  Users,
  MessageSquareText,
  Target,
  Share2,
  Plug,
  CreditCard,
  Menu,
  X,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ProfileDropdown from "./ProfileDropdown";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isMobile || !isOpen) return;
    const handleClick = (e: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      if (sidebar && !sidebar.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isMobile, isOpen]);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Reports", href: "/reports", icon: FileBarChart },
    { name: "Ad Campaigns", href: "/ads", icon: Target },
    { name: "Social Media", href: "/social", icon: Share2 },
    { name: "AI Content", href: "/content", icon: MessageSquareText },
    { name: "Community", href: "/community", icon: UsersRound },
    { name: "Integrations", href: "/integrations", icon: Plug },
    { name: "Team", href: "/team", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-16 bg-background border-b">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Open sidebar" aria-expanded={isOpen}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="font-bold text-lg">Genius</div>
          <ProfileDropdown />
        </div>
      )}

      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300" onClick={() => setIsOpen(false)}></div>
      )}

      <aside
        id={isMobile ? "mobile-sidebar" : undefined}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-transform duration-300",
          isMobile
            ? isOpen
              ? "translate-x-0 w-64 animate-slideIn"
              : "-translate-x-full w-64"
            : "w-64"
        )}
        style={{ willChange: 'transform' }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h2 className="text-lg font-bold">Genius</h2>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Close sidebar">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => isMobile && setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t">
          <NavLink 
            to="/upgrade"
            onClick={() => isMobile && setIsOpen(false)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
              pathname === "/upgrade" && "bg-primary/90"
            )}
          >
            <CreditCard className="h-4 w-4" />
            Upgrade Plan
          </NavLink>
        </div>

        {!isMobile && (
          <div className="p-4 border-t">
            <ProfileDropdown />
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
