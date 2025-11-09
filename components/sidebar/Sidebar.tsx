"use client";

import { useEffect, useState } from "react";
import { Menu } from "@/types/menu";
import { getMenus } from "@/lib/api";
import SidebarItem from "./SidebarItem";
import { useMenuContext } from "@/contexts/MenuContext";
import Image from "next/image";
import { PanelsTopLeft } from "lucide-react";

export default function Sidebar() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshTrigger, isCollapsed, setIsCollapsed, isSidebarOpen, setIsSidebarOpen } = useMenuContext();

  useEffect(() => {
    const fetchMenus = async () => {
      setIsLoading(true);
      const data = await getMenus();
      setMenus(data);
      setIsLoading(false);
    };

    fetchMenus();
  }, [refreshTrigger]);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebarOrCollapse = () => {
    // On mobile: close sidebar
    // On desktop: toggle collapse
    const isMobile = window.innerWidth < 1024; // lg breakpoint
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full
          transition-all duration-300 ease-in-out z-40
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-64"}
          lg:translate-x-0 lg:m-4 lg:h-[calc(100vh-2rem)] lg:rounded-xl
        `}
        style={{ backgroundColor: "#0051AF" }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
            {!isCollapsed && (
              <Image
                src="/stk.svg"
                alt="STK Logo"
                width={70}
                height={30}
                priority
              />
            )}
            <button
              onClick={toggleSidebarOrCollapse}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors text-white"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <PanelsTopLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : menus.length === 0 ? (
              <div className="text-center py-8 text-white/70">
                <p className="text-sm">No active menus found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {menus.map((menu) => (
                  <SidebarItem
                    key={menu.id}
                    menu={menu}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
}
