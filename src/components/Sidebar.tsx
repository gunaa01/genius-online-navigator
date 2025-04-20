
import { useState } from "react";
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
  Sparkle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ProfileDropdown from "./ProfileDropdown";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = ({ onCollapse }: { onCollapse?: (collapsed: boolean) => void }) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // desktop collapsed state
  const { pathname } = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Collapse sidebar on desktop after navigation
  const handleNavClick = () => {
    if (!isMobile) {
      setCollapsed(true);
      if (onCollapse) onCollapse(true);
    }
    if (isMobile) setIsOpen(false);
  };

  // Expand sidebar on hover (desktop only)
  const handleMouseEnter = () => {
    if (!isMobile && collapsed) {
      setCollapsed(false);
      if (onCollapse) onCollapse(false);
    }
  };
  const handleMouseLeave = () => {
    if (!isMobile && !collapsed) {
      setCollapsed(true);
      if (onCollapse) onCollapse(true);
    }
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
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
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
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="font-bold text-lg">Genius</div>
          <ProfileDropdown />
        </div>
      )}

      <aside
        className={cn(
          // Shared core styles
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-white/80 backdrop-blur-md shadow-2xl",
          // Animate width for collapse/expand
          "transition-[width] duration-300 ease-in-out",
          // Desktop collapsed/expanded
          !isMobile && (collapsed ? "w-20" : "w-64"),
          !isMobile && "hover:shadow-3xl border-r-2 border-gray-200",
          // Mobile: slide in/out, extra shadow, no border
          isMobile && (isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 shadow-xl border-none"),
          isMobile && "max-w-[85vw] min-w-[60vw]"
        )}
        style={{ willChange: 'width, transform' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={cn(
          "flex items-center justify-between h-16 px-6 border-b bg-white/80 transition-all duration-300 ease-in-out",
          !isMobile && "border-gray-200",
          isMobile && "border-gray-300"
        )}>
          {/* Sidebar logo/icon area */}
          {!collapsed || isMobile ? (
            <h2 className="text-xl font-extrabold tracking-tight text-primary transition-all duration-300 flex items-center gap-2">
              <Sparkle className="h-7 w-7 text-primary transition-all duration-300" />
              <span className="transition-all duration-300">Genius</span>
            </h2>
          ) : (
            <div className="flex items-center justify-center w-full">
              <Sparkle className="h-8 w-8 text-primary transition-all duration-300" />
            </div>
          )}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className={cn(
          "flex-1 overflow-auto flex flex-col justify-center transition-all duration-300 ease-in-out",
          !isMobile ? "py-6" : "py-4"
        )}>
          <nav
            className={
              !isMobile
                ? "flex flex-col gap-3 items-start justify-center px-2"
                : "flex flex-col gap-3 items-start px-4"
            }
          >
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    // Shared
                    "group flex items-center rounded-lg py-3 font-semibold transition-all duration-300 w-full",
                    !isMobile && (collapsed ? "justify-center px-0" : "gap-3 px-5"),
                    !isMobile && (collapsed ? "text-xl" : "text-base"),
                    isMobile && "gap-3 text-lg py-4 px-6",
                    // Active/hover
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-accent text-primary shadow"
                      : "text-gray-600 hover:bg-primary/5 hover:text-primary",
                    "transition-all duration-200"
                  )
                }
              >
                {item.icon && <item.icon className={cn("opacity-80 group-hover:text-primary transition-all duration-300", collapsed && !isMobile ? "h-7 w-7" : "h-5 w-5")}/>} 
                {!collapsed || isMobile ? <span className={isMobile ? "truncate text-lg transition-all duration-300" : "truncate ml-2 transition-all duration-300"}>{item.name}</span> : null}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className={cn(
          "border-t bg-white/80 transition-all duration-300 ease-in-out",
          !isMobile ? "p-6 border-gray-200" : "p-4 border-gray-300"
        )}>
          {!collapsed || isMobile ? (
            <NavLink
              to="/upgrade"
              onClick={handleNavClick}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground w-full shadow-md transition-all duration-300",
                !isMobile && "px-5 py-3 text-base font-bold hover:bg-primary/90",
                isMobile && "px-6 py-4 text-lg font-semibold hover:bg-primary/80",
                pathname === "/upgrade" && "bg-primary/90"
              )}
            >
              <CreditCard className={isMobile ? "h-6 w-6 transition-all duration-300" : "h-5 w-5 transition-all duration-300"} />
              <span className="transition-all duration-300">Upgrade Plan</span>
            </NavLink>
          ) : (
            <NavLink
              to="/upgrade"
              onClick={handleNavClick}
              className={cn(
                "flex items-center justify-center rounded-lg bg-primary text-primary-foreground w-full shadow-md transition-all duration-300 px-0 py-3 hover:bg-primary/90",
                pathname === "/upgrade" && "bg-primary/90"
              )}
            >
              <CreditCard className="h-7 w-7 transition-all duration-300" />
            </NavLink>
          )}
        </div>
        {!isMobile && !collapsed && (
          <div className="p-6 border-t border-gray-200 bg-white/80 transition-all duration-300">
            <ProfileDropdown />
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
