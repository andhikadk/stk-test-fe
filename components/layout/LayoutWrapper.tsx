"use client";

import { ReactNode } from "react";
import { useMenuContext } from "@/contexts/MenuContext";
import Sidebar from "@/components/sidebar/Sidebar";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isCollapsed } = useMenuContext();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main
        className={`
          flex-1 overflow-y-auto bg-gray-50 transition-all duration-300
          ${isCollapsed ? "lg:ml-12" : "lg:ml-68"}
        `}
      >
        <div className="container mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
