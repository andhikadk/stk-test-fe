"use client";

import { useState, useEffect } from "react";
import { Menu } from "@/types/menu";
import {
  getAllMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  moveMenu,
  reorderMenu,
} from "@/lib/api";
import MenuTree from "@/components/menu/MenuTree";
import MenuForm from "@/components/menu/MenuForm";
import { useMenuContext } from "@/contexts/MenuContext";
import { Button, Modal, Breadcrumb } from "@/components/ui";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Menu | null>(null);
  const [expandedMenuIds, setExpandedMenuIds] = useState<Set<number>>(new Set());
  const { triggerRefresh } = useMenuContext();

  // Fetch all menus
  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const data = await getAllMenus();
      setMenus(data);
    } catch (error) {
      console.error("Error fetching menus:", error);
      toast.error("Failed to fetch menus");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // Handle form submit (create or update)
  const handleSubmit = async (data: Partial<Menu>) => {
    setIsSubmitting(true);
    try {
      if (selectedMenu && selectedMenu.id !== 0) {
        // Update existing menu
        await updateMenu(selectedMenu.id, data);
        toast.success("Menu updated successfully!");
      } else {
        // Create new menu (including child menus)
        await createMenu(
          data as Omit<Menu, "id" | "created_at" | "updated_at" | "children">
        );
        toast.success("Menu created successfully!");
      }

      // Refresh menus and reset form
      await fetchMenus();
      triggerRefresh(); // Trigger sidebar refresh
      setSelectedMenu(null);
    } catch (error) {
      console.error("Error submitting menu:", error);
      toast.error("Failed to save menu");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete menu
  const handleDeleteMenu = (menu: Menu) => {
    setDeleteConfirm(menu);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteMenu(deleteConfirm.id);
      toast.success("Menu deleted successfully!");

      // Refresh menus and reset selection
      await fetchMenus();
      triggerRefresh(); // Trigger sidebar refresh
      if (selectedMenu?.id === deleteConfirm.id) {
        setSelectedMenu(null);
      }
    } catch (error) {
      console.error("Error deleting menu:", error);
      toast.error("Failed to delete menu");
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Handle add child menu
  const handleAddChild = (parentMenu: Menu) => {
    // Pre-fill the form with parent_id
    setSelectedMenu({
      id: 0,
      title: "",
      path: "",
      icon: "",
      order_index: 0,
      parent_id: parentMenu.id,
      created_at: "",
      updated_at: "",
    } as Menu);
  };

  // Handle cancel form
  const handleCancel = () => {
    setSelectedMenu(null);
  };

  // Collect all menu IDs recursively
  const collectAllMenuIds = (menuList: Menu[]): number[] => {
    const ids: number[] = [];
    const traverse = (items: Menu[]) => {
      items.forEach((item) => {
        ids.push(item.id);
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      });
    };
    traverse(menuList);
    return ids;
  };

  // Handle expand all
  const handleExpandAll = () => {
    const allIds = collectAllMenuIds(menus);
    setExpandedMenuIds(new Set(allIds));
  };

  // Handle collapse all
  const handleCollapseAll = () => {
    setExpandedMenuIds(new Set());
  };

  // Handle toggle expand for individual menu
  const handleToggleExpand = (menuId: number) => {
    setExpandedMenuIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  // Handle menu drag and drop
  const handleMenuDrop = async (
    draggedId: number,
    targetId: number | null,
    position: "before" | "after" | "inside"
  ) => {
    try {
      // Find dragged menu
      const findMenu = (menus: Menu[], id: number): Menu | null => {
        for (const menu of menus) {
          if (menu.id === id) return menu;
          if (menu.children) {
            const found = findMenu(menu.children, id);
            if (found) return found;
          }
        }
        return null;
      };

      const draggedMenu = findMenu(menus, draggedId);
      if (!draggedMenu) return;

      // Determine new parent and position
      let newParentId: number | null = null;
      let newIndex = 0;

      if (position === "inside" && targetId !== null) {
        // Dropped inside another menu - make it a child
        newParentId = targetId;
        // Find target menu's children count for new index
        const targetMenu = findMenu(menus, targetId);
        newIndex = targetMenu?.children?.length || 0;
      } else {
        // Dropped before/after - same parent as target
        const targetMenu = targetId ? findMenu(menus, targetId) : null;
        newParentId = targetMenu?.parent_id || null;

        // Get siblings recursively from all menus
        const getAllMenusFlat = (menuList: Menu[]): Menu[] => {
          const result: Menu[] = [];
          const traverse = (items: Menu[]) => {
            items.forEach((item) => {
              result.push(item);
              if (item.children && item.children.length > 0) {
                traverse(item.children);
              }
            });
          };
          traverse(menuList);
          return result;
        };

        const allMenusFlat = getAllMenusFlat(menus);
        const siblings = allMenusFlat.filter(
          (m) => (m.parent_id || null) === newParentId && m.id !== draggedId
        );
        const targetIndex = siblings.findIndex((m) => m.id === targetId);
        newIndex = position === "before" ? targetIndex : targetIndex + 1;
      }

      // Check if parent changed
      const parentChanged = draggedMenu.parent_id !== newParentId;

      if (parentChanged) {
        await moveMenu(draggedId, newParentId);
      }

      // Always reorder to set correct position with old index for optimization
      await reorderMenu(draggedId, newIndex, draggedMenu.order_index);

      // Refresh menus
      await fetchMenus();
      triggerRefresh();
      toast.success("Menu moved successfully!");
    } catch (error) {
      console.error("Error handling menu drop:", error);
      toast.error("Failed to move menu");
    }
  };

  return (
    <div className="h-full">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb items={[{ label: "Menu Management" }]} />
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Menu Management
        </h1>
        <p className="text-gray-600">
          Manage your application menus with hierarchical structure
        </p>
      </div>

      {/* Main Content - Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Menu Tree (40%) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-4 h-[calc(100vh-16rem)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Tree Structure
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExpandAll}
                >
                  Expand All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCollapseAll}
                >
                  Collapse All
                </Button>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <DndProvider backend={HTML5Backend}>
                <MenuTree
                  menus={menus}
                  selectedMenuId={selectedMenu?.id || null}
                  onSelectMenu={setSelectedMenu}
                  onDeleteMenu={handleDeleteMenu}
                  onAddChild={handleAddChild}
                  expandedMenuIds={expandedMenuIds}
                  onToggleExpand={handleToggleExpand}
                  onMenuDrop={handleMenuDrop}
                />
              </DndProvider>
            )}
          </div>
        </div>

        {/* Right: Form (60%) */}
        <div className="lg:col-span-3">
          <div className="h-[calc(100vh-16rem)] overflow-y-auto">
            <MenuForm
              selectedMenu={selectedMenu}
              allMenus={menus}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button variant="danger" onClick={confirmDelete} className="flex-1">
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete menu{" "}
          <strong>{deleteConfirm?.title}</strong>?
          {deleteConfirm?.children && deleteConfirm.children.length > 0 && (
            <span className="block mt-2 text-red-600">
              This will also delete all {deleteConfirm.children.length} child
              menu(s).
            </span>
          )}
        </p>
      </Modal>
    </div>
  );
}
