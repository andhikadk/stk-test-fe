'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu } from '@/types/menu';
import { ChevronDown, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';

interface SidebarItemProps {
  menu: Menu;
  depth?: number;
}

// Map icon string to Lucide icon component
const getIconComponent = (iconName: string) => {
  // Remove 'icon-' prefix if exists and convert to PascalCase
  const cleanName = iconName.replace(/^icon-/, '');
  const pascalCase = cleanName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const IconComponent = (Icons as any)[pascalCase];
  return IconComponent || Icons.Circle;
};

export default function SidebarItem({ menu, depth = 0 }: SidebarItemProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = menu.children && menu.children.length > 0;
  const isActive = pathname === menu.path;

  const IconComponent = getIconComponent(menu.icon);
  const paddingLeft = depth * 16 + 12; // Indentation for nested items

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <Link
        href={menu.path}
        onClick={handleClick}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
          ${isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        <IconComponent className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1 text-sm font-medium">{menu.title}</span>
        {hasChildren && (
          <span className="text-gray-400">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
      </Link>

      {/* Render children recursively */}
      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {menu.children!.map((childMenu) => (
            <SidebarItem key={childMenu.id} menu={childMenu} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
