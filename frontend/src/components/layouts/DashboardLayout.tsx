import { ReactNode } from "react";
import Sidebar from "../Sidebar";
import { useState, useEffect } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const SIDEBAR_WIDTH = 256; // 64 (expanded)
const SIDEBAR_COLLAPSED = 80; // 20 (collapsed)

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  // Listen to sidebar collapsed state via a custom event (for global sync)
  const [collapsed, setCollapsed] = useState(false);

  // Listen for sidebar collapse/expand
  useEffect(() => {
    const handler = (e: any) => setCollapsed(!!e.detail);
    window.addEventListener("sidebar:collapsed", handler);
    return () => window.removeEventListener("sidebar:collapsed", handler);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        onCollapse={(val: boolean) => {
          setCollapsed(val);
          window.dispatchEvent(new CustomEvent("sidebar:collapsed", { detail: val }));
        }}
      />
      <main
        className="flex-1 p-6 lg:p-8 overflow-y-auto transition-all duration-300"
        style={{
          marginLeft: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH,
          transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
