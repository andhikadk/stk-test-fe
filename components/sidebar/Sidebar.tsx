'use client';

import { useEffect, useState } from 'react';
import { Menu } from '@/types/menu';
import { getMenus } from '@/lib/api';
import SidebarItem from './SidebarItem';
import MobileMenuToggle from './MobileMenuToggle';
import { useMenuContext } from '@/contexts/MenuContext';
import Image from 'next/image';

export default function Sidebar() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshTrigger } = useMenuContext();

  useEffect(() => {
    const fetchMenus = async () => {
      setIsLoading(true);
      const data = await getMenus();
      setMenus(data);
      setIsLoading(false);
    };

    fetchMenus();
  }, [refreshTrigger]);

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
          fixed top-0 left-0 h-full w-64
          transition-transform duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
        `}
        style={{ backgroundColor: '#0051AF' }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-6 border-b border-white/10">
            <Image
              src="/stk.svg"
              alt="STK Logo"
              width={70}
              height={30}
              priority
            />
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
                  <SidebarItem key={menu.id} menu={menu} />
                ))}
              </div>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
}
