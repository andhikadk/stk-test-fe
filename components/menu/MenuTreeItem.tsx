"use client";

import { Menu } from "@/types/menu";
import { ChevronRight, ChevronDown, Trash2, Plus } from "lucide-react";
import { IconButton } from "@/components/ui";
import { useDrag, useDrop } from "react-dnd";
import { useRef, useState } from "react";

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
  onMenuDrop?: (
    draggedId: number,
    targetId: number | null,
    position: "before" | "after" | "inside"
  ) => void;
}

const ITEM_TYPE = "MENU_ITEM";

interface DragItem {
  id: number;
  type: string;
}

export default function MenuTreeItem({
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
  onMenuDrop,
}: MenuTreeItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [dropPosition, setDropPosition] = useState<
    "before" | "after" | "inside" | null
  >(null);

  const hasChildren = menu.children && menu.children.length > 0;
  const isSelected = selectedMenuId === menu.id;
  const isExpanded = expandedMenuIds ? expandedMenuIds.has(menu.id) : true;

  // Drag source
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: menu.id, type: ITEM_TYPE },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop target
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: DragItem, monitor) => {
      if (!ref.current || item.id === menu.id) {
        setDropPosition(null);
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        setDropPosition(null);
        return;
      }

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const hoverHeight = hoverBoundingRect.bottom - hoverBoundingRect.top;

      // Determine drop position based on cursor position
      // Use larger thresholds for more stability (30% top, 30% bottom, 40% middle)
      const topThreshold = hoverHeight * 0.3;
      const bottomThreshold = hoverHeight * 0.7;

      if (hoverClientY < topThreshold) {
        setDropPosition("before");
      } else if (hoverClientY > bottomThreshold) {
        setDropPosition("after");
      } else {
        setDropPosition("inside");
      }
    },
    drop: (item: DragItem, monitor) => {
      if (!ref.current || !onMenuDrop || item.id === menu.id) return;

      const didDrop = monitor.didDrop();
      if (didDrop) return; // Already handled by child

      const position = dropPosition || "after";
      onMenuDrop(item.id, menu.id, position);
      setDropPosition(null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  // Combine drag and drop refs
  drag(drop(ref));

  // Calculate drop indicator position
  const getDropIndicatorStyle = () => {
    if (!isOver || !dropPosition) return {};

    const baseStyle = {
      position: "absolute" as const,
      left: `${depth * 20 + 20}px`,
      right: "8px",
      height: "6px",
      backgroundColor: "#0051AF",
      borderRadius: "2px",
      boxShadow: "0 0 4px rgba(0, 81, 175, 0.5)",
      zIndex: 10,
    };

    if (dropPosition === "before") {
      return { ...baseStyle, top: "-2px" };
    } else if (dropPosition === "after") {
      return { ...baseStyle, bottom: "-2px" };
    }
    return {};
  };

  // Calculate transform shift for smooth animation
  // Don't shift the item being hovered - only show indicator
  // This prevents jittery behavior from bounding rect changes
  const getTransformShift = () => {
    // Never shift the item being directly hovered over
    return "translateY(0)";
  };

  return (
    <div className="relative">
      {/* Drop indicator line */}
      {isOver && dropPosition && dropPosition !== "inside" && (
        <div style={getDropIndicatorStyle()} />
      )}

      {/* Tree lines */}
      <div
        ref={ref}
        className={`
          flex items-center gap-1 group relative
          transition-transform duration-200 ease-out
          ${isDragging ? "opacity-40" : ""}
          ${isOver && dropPosition === "inside" ? "bg-primary-50" : ""}
        `}
        style={{
          transform: getTransformShift(),
          paddingLeft: `${depth * 20}px`,
        }}
      >
        {/* Expand/Collapse button */}
        <button
          onClick={() =>
            hasChildren && onToggleExpand && onToggleExpand(menu.id)
          }
          className={`shrink-0 z-10 ${!hasChildren ? "invisible" : ""}`}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>

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
                onMenuDrop={onMenuDrop}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
