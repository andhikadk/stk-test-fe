'use client';

import { Menu } from '@/types/menu';
import { ChevronRight, ChevronDown, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import * as Icons from 'lucide-react';

interface MenuTreeProps {
  menus: Menu[];
  selectedMenuId: number | null;
  onSelectMenu: (menu: Menu) => void;
  onDeleteMenu: (menu: Menu) => void;
  onToggleActive: (menu: Menu) => void;
}

interface MenuTreeItemProps {
  menu: Menu;
  depth?: number;
  selectedMenuId: number | null;
  onSelectMenu: (menu: Menu) => void;
  onDeleteMenu: (menu: Menu) => void;
  onToggleActive: (menu: Menu) => void;
}

// Map icon string to Lucide icon component
const getIconComponent = (iconName: string) => {
  const cleanName = iconName.replace(/^icon-/, '');
  const pascalCase = cleanName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const IconComponent = (Icons as any)[pascalCase];
  return IconComponent || Icons.Circle;
};

function MenuTreeItem({
  menu,
  depth = 0,
  selectedMenuId,
  onSelectMenu,
  onDeleteMenu,
  onToggleActive
}: MenuTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = menu.children && menu.children.length > 0;
  const isSelected = selectedMenuId === menu.id;
  const IconComponent = getIconComponent(menu.icon);
  const paddingLeft = depth * 20 + 12;

  return (
    <div>
      <div
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg mb-1 cursor-pointer
          transition-colors
          ${isSelected
            ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }
          ${!menu.is_active ? 'opacity-50' : ''}
        `}
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {/* Expand/Collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex-shrink-0 ${!hasChildren ? 'invisible' : ''}`}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {/* Icon */}
        <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />

        {/* Title */}
        <div
          className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 truncate"
          onClick={() => onSelectMenu(menu)}
        >
          {menu.title}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectMenu(menu);
            }}
            className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleActive(menu);
            }}
            className="p-1 hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded"
            title={menu.is_active ? 'Deactivate' : 'Activate'}
          >
            {menu.is_active ? (
              <Eye className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteMenu(menu);
            }}
            className="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>

      {/* Render children */}
      {hasChildren && isExpanded && (
        <div>
          {menu.children!.map((child) => (
            <MenuTreeItem
              key={child.id}
              menu={child}
              depth={depth + 1}
              selectedMenuId={selectedMenuId}
              onSelectMenu={onSelectMenu}
              onDeleteMenu={onDeleteMenu}
              onToggleActive={onToggleActive}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MenuTree({
  menus,
  selectedMenuId,
  onSelectMenu,
  onDeleteMenu,
  onToggleActive
}: MenuTreeProps) {
  return (
    <div className="space-y-1">
      {menus.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No menus found</p>
          <p className="text-xs mt-1">Click "Add New Menu" to create one</p>
        </div>
      ) : (
        menus.map((menu) => (
          <div key={menu.id} className="group">
            <MenuTreeItem
              menu={menu}
              selectedMenuId={selectedMenuId}
              onSelectMenu={onSelectMenu}
              onDeleteMenu={onDeleteMenu}
              onToggleActive={onToggleActive}
            />
          </div>
        ))
      )}
    </div>
  );
}
