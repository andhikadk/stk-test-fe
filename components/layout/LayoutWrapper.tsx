"use client";

import { ReactNode } from "react";
import { useMenuContext } from "@/contexts/MenuContext";
import Sidebar from "@/components/sidebar/Sidebar";
import { PanelsTopLeft } from "lucide-react";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isCollapsed, setIsSidebarOpen } = useMenuContext();

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main
        className={`
          flex-1 overflow-y-auto bg-gray-50 transition-all duration-300
          ${isCollapsed ? "lg:ml-12" : "lg:ml-68"}
        `}
      >
        {/* Mobile Toggle Button - Top of Page */}
        <button
          onClick={openSidebar}
          className="lg:hidden p-4 text-gray-700 hover:text-primary-500 transition-colors"
          aria-label="Open sidebar"
        >
          <PanelsTopLeft className="w-6 h-6" />
        </button>

        <div className="container mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
