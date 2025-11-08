import Link from "next/link";
import { Menu, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Welcome to Menu Manager
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          A comprehensive menu management system with CRUD operations and hierarchical structure support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Menu Management Card */}
        <Link
          href="/menus"
          className="block p-6 bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Menu className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Menu Management
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create, edit, and organize your application menus with an intuitive tree view interface.
          </p>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              Hierarchical menu structure
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              Drag-and-drop support (coming soon)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              Toggle active/inactive status
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              Icon integration with Lucide
            </li>
          </ul>
        </Link>

        {/* Settings Card (Placeholder) */}
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-800 opacity-60">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Settings className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Settings
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Configure your application settings and preferences.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 italic">
            Coming soon...
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Quick Start Guide
        </h3>
        <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600 dark:text-blue-400">1.</span>
            Click on "Menu Management" to access the CRUD interface
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600 dark:text-blue-400">2.</span>
            Use "Add New Menu" button to create your first menu item
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600 dark:text-blue-400">3.</span>
            Click on any menu item in the tree to edit its properties
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600 dark:text-blue-400">4.</span>
            Use the action buttons to toggle visibility or delete items
          </li>
        </ol>
      </div>
    </div>
  );
}
