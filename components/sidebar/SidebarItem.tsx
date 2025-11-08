"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "@/types/menu";
import { ChevronDown, ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";

interface SidebarItemProps {
  menu: Menu;
  depth?: number;
  isCollapsed?: boolean;
}

// Map icon string to Lucide icon component
const getIconComponent = (iconName: string) => {
  // Remove 'icon-' prefix if exists and convert to PascalCase
  const cleanName = iconName.replace(/^icon-/, "");
  const pascalCase = cleanName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<any>>)[pascalCase];
  return IconComponent || Icons.Circle;
};

export default function SidebarItem({ menu, depth = 0, isCollapsed = false }: SidebarItemProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = menu.children && menu.children.length > 0;
  const isActive = pathname === menu.path;

  const IconComponent = getIconComponent(menu.icon);
  const paddingLeft = isCollapsed ? 12 : depth * 8 + 12; // No depth indentation when collapsed

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren && !isCollapsed) {
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
          flex items-center py-3 rounded-2xl transition-all duration-200
          ${isCollapsed ? 'justify-center px-3' : 'gap-3 px-3'}
          ${
            isActive
              ? "bg-white text-primary-500"
              : "text-white/90 hover:bg-white/10"
          }
        `}
        style={isCollapsed ? undefined : { paddingLeft: `${paddingLeft}px` }}
      >
        {/* eslint-disable-next-line react-hooks/static-components */}
        <IconComponent className="w-5 h-5 shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-sm font-semibold">{menu.title}</span>
            {hasChildren &&
              (isExpanded ? (
                <ChevronDown
                  className={`w-4 h-4 ${
                    isActive ? "text-primary-500/70" : "text-white/70"
                  }`}
                />
              ) : (
                <ChevronRight
                  className={`w-4 h-4 ${
                    isActive ? "text-primary-500/70" : "text-white/70"
                  }`}
                />
              ))}
          </>
        )}
      </Link>

      {/* Render children recursively - only when expanded and not collapsed */}
      {hasChildren && isExpanded && !isCollapsed && (
        <div className="mt-1 space-y-1">
          {menu.children!.map((childMenu) => (
            <SidebarItem
              key={childMenu.id}
              menu={childMenu}
              depth={depth + 1}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
