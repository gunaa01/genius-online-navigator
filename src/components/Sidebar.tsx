
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  PieChart, 
  FileText, 
  MessageSquare, 
  Settings, 
  Users, 
  Share2,
  BarChart3,
  Sparkles,
  FileUpload
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-card h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Genius
          </span>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">
          Marketing & Analytics Platform
        </p>
      </div>
      
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          <NavItem to="/" icon={<LayoutDashboard size={18} />} text="Dashboard" active />
          <NavItem to="/analytics" icon={<PieChart size={18} />} text="Analytics" />
          <NavItem to="/reports" icon={<FileText size={18} />} text="Reports" />
          <NavItem to="/ads" icon={<BarChart3 size={18} />} text="Ad Campaigns" />
          <NavItem to="/social" icon={<Share2 size={18} />} text="Social Media" />
          <NavItem to="/content" icon={<MessageSquare size={18} />} text="AI Content" />
          <NavItem to="/integrations" icon={<FileUpload size={18} />} text="Integrations" />
          <NavItem to="/team" icon={<Users size={18} />} text="Team" />
          <NavItem to="/settings" icon={<Settings size={18} />} text="Settings" />
        </ul>
      </nav>
      
      <div className="p-4 m-4 bg-accent/10 rounded-lg">
        <h3 className="text-sm font-medium mb-1">Premium Features</h3>
        <p className="text-xs text-muted-foreground mb-2">
          Upgrade to access advanced AI tools and unlimited reports.
        </p>
        <Link
          to="/upgrade"
          className="text-xs flex justify-center items-center py-1.5 px-3 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
        >
          Upgrade to Pro
        </Link>
      </div>
      
      <div className="p-4 border-t flex items-center">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
          JS
        </div>
        <div>
          <p className="text-sm font-medium">John Smith</p>
          <p className="text-xs text-muted-foreground">Free Trial</p>
        </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}

const NavItem = ({ to, icon, text, active }: NavItemProps) => {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
          active 
            ? "bg-primary text-primary-foreground" 
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
      >
        {icon}
        <span>{text}</span>
      </Link>
    </li>
  );
};

export default Sidebar;
