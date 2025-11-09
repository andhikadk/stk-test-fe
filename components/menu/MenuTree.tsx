"use client";

import { Menu } from "@/types/menu";
import MenuTreeItem from "./MenuTreeItem";

interface MenuTreeProps {
  menus: Menu[];
  selectedMenuId: number | null;
  onSelectMenu: (menu: Menu) => void;
  onDeleteMenu: (menu: Menu) => void;
  onAddChild?: (parentMenu: Menu) => void;
  expandedMenuIds?: Set<number>;
  onToggleExpand?: (menuId: number) => void;
  onMenuDrop?: (
    draggedId: number,
    targetId: number | null,
    position: "before" | "after" | "inside"
  ) => void;
}

export default function MenuTree({
  menus,
  selectedMenuId,
  onSelectMenu,
  onDeleteMenu,
  onAddChild,
  expandedMenuIds,
  onToggleExpand,
  onMenuDrop,
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
                onMenuDrop={onMenuDrop}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
