"use client";

import { Menu } from "@/types/menu";
import { ChevronRight, ChevronDown, Trash2, Plus } from "lucide-react";
import { IconButton } from "@/components/ui";

interface MenuTreeProps {
  menus: Menu[];
  selectedMenuId: number | null;
  onSelectMenu: (menu: Menu) => void;
  onDeleteMenu: (menu: Menu) => void;
  onAddChild?: (parentMenu: Menu) => void;
  expandedMenuIds?: Set<number>;
  onToggleExpand?: (menuId: number) => void;
}

interface MenuTreeItemProps {
  menu: Menu;
  depth?: number;
  isLast?: boolean;
  parentPath?: boolean[];
  selectedMenuId: number | null;
  onSelectMenu: (menu: Menu) => void;
  onDeleteMenu: (menu: Menu) => void;
  onAddChild?: (parentMenu: Menu) => void;
  expandedMenuIds?: Set<number>;
  onToggleExpand?: (menuId: number) => void;
}

function MenuTreeItem({
  menu,
  depth = 0,
  isLast = false,
  parentPath = [],
  selectedMenuId,
  onSelectMenu,
  onDeleteMenu,
  onAddChild,
  expandedMenuIds,
  onToggleExpand,
}: MenuTreeItemProps) {
  const hasChildren = menu.children && menu.children.length > 0;
  const isSelected = selectedMenuId === menu.id;
  const isExpanded = expandedMenuIds ? expandedMenuIds.has(menu.id) : true;

  return (
    <div className="relative">
      {/* Tree lines */}
      <div className="flex items-center gap-1 group relative">
        {/* Render vertical lines for parent levels */}
        {depth > 0 &&
          parentPath.map((shouldDrawLine, index) => (
            <div key={index} className="w-4 flex justify-center">
              {shouldDrawLine && <div className="w-px h-full bg-gray-300" />}
            </div>
          ))}

        {/* Expand/Collapse button */}
        <button
          onClick={() =>
            hasChildren && onToggleExpand && onToggleExpand(menu.id)
          }
          className={`shrink-0 ${!hasChildren ? "invisible" : ""}`}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {/* Vertical line from chevron to children (only when expanded and has children and not last) */}
        {hasChildren && isExpanded && !isLast && (
          <div
            className="absolute w-px bg-gray-300"
            style={{
              left: `${depth > 0 ? depth * 5 * 4 + 5 * 4 + 10 : 10}px`,
              top: "100%",
              height: "100%",
              zIndex: -1,
            }}
          />
        )}

        {/* Title */}
        <div
          className={`
            flex-1 text-sm font-normal cursor-pointer py-2 px-2 rounded
            transition-colors
            ${
              isSelected
                ? "bg-primary-100 text-primary-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }
            ${!menu.is_active ? "opacity-50" : ""}
          `}
          onClick={() => onSelectMenu(menu)}
        >
          {menu.title}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Add Child button - only show if callback exists */}
          {onAddChild && (
            <IconButton
              variant="primary"
              size="md"
              isRound
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(menu);
              }}
              title="Add Child Menu"
            />
          )}

          {/* Delete button */}
          <IconButton
            variant="danger"
            size="md"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteMenu(menu);
            }}
            title="Delete"
          />
        </div>
      </div>

      {/* Render children */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {menu.children!.map((child, index) => {
            const isLastChild = index === menu.children!.length - 1;
            return (
              <MenuTreeItem
                key={child.id}
                menu={child}
                depth={depth + 1}
                isLast={isLastChild}
                parentPath={[...parentPath, !isLast]}
                selectedMenuId={selectedMenuId}
                onSelectMenu={onSelectMenu}
                onDeleteMenu={onDeleteMenu}
                onAddChild={onAddChild}
                expandedMenuIds={expandedMenuIds}
                onToggleExpand={onToggleExpand}
              />
            );
          })}
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
  onAddChild,
  expandedMenuIds,
  onToggleExpand,
}: MenuTreeProps) {
  return (
    <div className="space-y-0">
      {menus.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No menus found</p>
        </div>
      ) : (
        menus.map((menu, index) => {
          const isLastMenu = index === menus.length - 1;
          return (
            <div key={menu.id} className="group">
              <MenuTreeItem
                menu={menu}
                depth={0}
                isLast={isLastMenu}
                selectedMenuId={selectedMenuId}
                onSelectMenu={onSelectMenu}
                onDeleteMenu={onDeleteMenu}
                onAddChild={onAddChild}
                expandedMenuIds={expandedMenuIds}
                onToggleExpand={onToggleExpand}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
