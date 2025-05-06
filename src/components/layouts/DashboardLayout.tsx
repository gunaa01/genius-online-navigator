import { ReactNode } from "react";
import Sidebar from "../Sidebar";
import { useState } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        onCollapse={(val: boolean) => {
          setCollapsed(val);
        }}
      />
      <main
        className="flex-1 p-6 lg:p-8 overflow-y-auto transition-all duration-300"
        style={{
          marginLeft: collapsed ? '80px' : '256px',
          transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
