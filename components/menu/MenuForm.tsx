'use client';

import { Menu } from '@/types/menu';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface MenuFormProps {
  selectedMenu: Menu | null;
  allMenus: Menu[];
  onSubmit: (data: Partial<Menu>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function MenuForm({
  selectedMenu,
  allMenus,
  onSubmit,
  onCancel,
  isLoading
}: MenuFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    path: '',
    icon: '',
    is_active: true,
    order_index: 0,
    parent_id: null as number | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when selectedMenu changes
  useEffect(() => {
    if (selectedMenu) {
      setFormData({
        title: selectedMenu.title,
        path: selectedMenu.path,
        icon: selectedMenu.icon,
        is_active: selectedMenu.is_active,
        order_index: selectedMenu.order_index,
        parent_id: selectedMenu.parent_id,
      });
    } else {
      // Reset form for new menu
      setFormData({
        title: '',
        path: '',
        icon: '',
        is_active: true,
        order_index: 0,
        parent_id: null,
      });
    }
    setErrors({});
  }, [selectedMenu]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.path.trim()) {
      newErrors.path = 'Path is required';
    } else if (!formData.path.startsWith('/')) {
      newErrors.path = 'Path must start with /';
    }

    if (!formData.icon.trim()) {
      newErrors.icon = 'Icon is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Flatten menus for parent selection (exclude current menu and its children)
  const flattenMenus = (menus: Menu[], excludeId?: number): Menu[] => {
    let result: Menu[] = [];

    for (const menu of menus) {
      if (menu.id !== excludeId) {
        result.push(menu);
        if (menu.children) {
          result = result.concat(flattenMenus(menu.children, excludeId));
        }
      }
    }

    return result;
  };

  const availableParents = flattenMenus(allMenus, selectedMenu?.id);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {selectedMenu ? 'Edit Menu' : 'Create New Menu'}
        </h3>
        {selectedMenu && (
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            title="Cancel"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
              focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., Dashboard"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Path */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Path <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.path}
            onChange={(e) => handleChange('path', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              ${errors.path ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
              focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., /dashboard"
          />
          {errors.path && <p className="text-red-500 text-xs mt-1">{errors.path}</p>}
        </div>

        {/* Icon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Icon <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => handleChange('icon', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              ${errors.icon ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
              focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., home or icon-home"
          />
          {errors.icon && <p className="text-red-500 text-xs mt-1">{errors.icon}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Use Lucide icon name (e.g., home, settings, users)
          </p>
        </div>

        {/* Parent Menu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Parent Menu
          </label>
          <select
            value={formData.parent_id || ''}
            onChange={(e) => handleChange('parent_id', e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None (Top Level)</option>
            {availableParents.map((menu) => (
              <option key={menu.id} value={menu.id}>
                {menu.title}
              </option>
            ))}
          </select>
        </div>

        {/* Order Index */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Order Index
          </label>
          <input
            type="number"
            value={formData.order_index}
            onChange={(e) => handleChange('order_index', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">
            Lower numbers appear first
          </p>
        </div>

        {/* Is Active */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => handleChange('is_active', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Active
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Saving...' : selectedMenu ? 'Update Menu' : 'Create Menu'}
          </button>
          {selectedMenu && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
