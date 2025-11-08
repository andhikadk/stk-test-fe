'use client';

import { Menu } from '@/types/menu';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input, Select, Checkbox, Button, IconButton, SelectOption } from '@/components/ui';

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

  const parentOptions: SelectOption[] = [
    { value: '', label: 'None (Top Level)' },
    ...availableParents.map(menu => ({
      value: menu.id,
      label: menu.title,
    })),
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {selectedMenu && selectedMenu.id !== 0 ? 'Edit Menu' : 'Create New Menu'}
        </h3>
        {selectedMenu && (
          <IconButton
            variant="ghost"
            size="md"
            icon={<X className="w-5 h-5" />}
            onClick={onCancel}
            title="Cancel"
          />
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          type="text"
          required
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          placeholder="e.g., Dashboard"
        />

        <Input
          label="Path"
          type="text"
          required
          value={formData.path}
          onChange={(e) => handleChange('path', e.target.value)}
          error={errors.path}
          placeholder="e.g., /dashboard"
        />

        <Input
          label="Icon"
          type="text"
          required
          value={formData.icon}
          onChange={(e) => handleChange('icon', e.target.value)}
          error={errors.icon}
          placeholder="e.g., home or icon-home"
          helperText="Use Lucide icon name (e.g., home, settings, users)"
        />

        <Select
          label="Parent Menu"
          value={formData.parent_id || ''}
          onChange={(e) => handleChange('parent_id', e.target.value ? Number(e.target.value) : null)}
          options={parentOptions}
        />

        <Input
          label="Order Index"
          type="number"
          value={formData.order_index}
          onChange={(e) => handleChange('order_index', Number(e.target.value))}
          helperText="Lower numbers appear first"
          min="0"
        />

        <Checkbox
          id="is_active"
          label="Active"
          checked={formData.is_active}
          onChange={(e) => handleChange('is_active', e.target.checked)}
        />

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="flex-1"
          >
            {selectedMenu && selectedMenu.id !== 0 ? 'Update Menu' : 'Create Menu'}
          </Button>
          {selectedMenu && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
