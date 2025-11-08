'use client';

import { useEffect, useState } from 'react';
import { Menu } from '@/types/menu';
import { getMenus } from '@/lib/api';
import SidebarItem from './SidebarItem';
import MobileMenuToggle from './MobileMenuToggle';

export default function Sidebar() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      setIsLoading(true);
      const data = await getMenus();
      setMenus(data);
      setIsLoading(false);
    };

    fetchMenus();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <MobileMenuToggle isOpen={isOpen} onToggle={toggleSidebar} />

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          transition-transform duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Menu Manager
            </h2>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : menus.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm">No active menus found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {menus.map((menu) => (
                  <SidebarItem key={menu.id} menu={menu} />
                ))}
              </div>
            )}
          </nav>

          {/* Sidebar Footer */}
          <div className="h-16 flex items-center px-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2025 Menu Manager
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
