import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        onCollapse={(collapsed) => setSidebarCollapsed(collapsed)} 
      />
      
      {/* Main Content */}
      <main 
        className="w-full transition-all duration-300" 
        style={{ 
          marginLeft: sidebarCollapsed ? '80px' : '256px',
          marginTop: '0px',
          padding: '1rem'
        }}
      >
          <Outlet />
        </main>
    </div>
  );
};

export default Layout;
