'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface MenuContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <MenuContext.Provider value={{ refreshTrigger, triggerRefresh, isCollapsed, setIsCollapsed }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
}
