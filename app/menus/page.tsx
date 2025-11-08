'use client';

import { useState, useEffect } from 'react';
import { Menu } from '@/types/menu';
import { getAllMenus, createMenu, updateMenu, deleteMenu, toggleMenuActive } from '@/lib/api';
import MenuTree from '@/components/menu/MenuTree';
import MenuForm from '@/components/menu/MenuForm';
import { Plus, RefreshCw } from 'lucide-react';

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Menu | null>(null);

  // Fetch all menus
  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const data = await getAllMenus();
      setMenus(data);
    } catch (error) {
      console.error('Error fetching menus:', error);
      alert('Failed to fetch menus');
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
      if (selectedMenu) {
        // Update existing menu
        await updateMenu(selectedMenu.id, data);
        alert('Menu updated successfully!');
      } else {
        // Create new menu
        await createMenu(data as Omit<Menu, 'id' | 'created_at' | 'updated_at' | 'children'>);
        alert('Menu created successfully!');
      }

      // Refresh menus and reset form
      await fetchMenus();
      setSelectedMenu(null);
    } catch (error) {
      console.error('Error submitting menu:', error);
      alert('Failed to save menu');
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
      alert('Menu deleted successfully!');

      // Refresh menus and reset selection
      await fetchMenus();
      if (selectedMenu?.id === deleteConfirm.id) {
        setSelectedMenu(null);
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
      alert('Failed to delete menu');
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Handle toggle active
  const handleToggleActive = async (menu: Menu) => {
    try {
      await toggleMenuActive(menu.id, !menu.is_active);

      // Refresh menus
      await fetchMenus();

      // Update selected menu if it's the same
      if (selectedMenu?.id === menu.id) {
        setSelectedMenu({ ...menu, is_active: !menu.is_active });
      }
    } catch (error) {
      console.error('Error toggling menu active:', error);
      alert('Failed to toggle menu active status');
    }
  };

  // Handle new menu button
  const handleNewMenu = () => {
    setSelectedMenu(null);
  };

  // Handle cancel form
  const handleCancel = () => {
    setSelectedMenu(null);
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Menu Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your application menus with hierarchical structure
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleNewMenu}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Menu
        </button>
        <button
          onClick={fetchMenus}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Main Content - Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Menu Tree (40%) */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 h-[calc(100vh-16rem)] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Menu Structure
            </h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <MenuTree
                menus={menus}
                selectedMenuId={selectedMenu?.id || null}
                onSelectMenu={setSelectedMenu}
                onDeleteMenu={handleDeleteMenu}
                onToggleActive={handleToggleActive}
              />
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
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete menu <strong>{deleteConfirm.title}</strong>?
              {deleteConfirm.children && deleteConfirm.children.length > 0 && (
                <span className="block mt-2 text-red-600 dark:text-red-400">
                  This will also delete all {deleteConfirm.children.length} child menu(s).
                </span>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
