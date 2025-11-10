import { Menu, ApiResponse } from "@/types/menu";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Get all menus (for sidebar - only active)
export async function getMenus(): Promise<Menu[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/menus`, {
      cache: "no-store", // Disable caching for fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch menus: ${response.statusText}`);
    }

    const result: ApiResponse<Menu[]> = await response.json();

    return result.data.map((menu) => ({
      ...menu,
      children: menu.children ?? undefined,
    }));
  } catch (error) {
    console.error("Error fetching menus:", error);
    return [];
  }
}

// Get all menus (for CRUD page - all menus including inactive)
export async function getAllMenus(): Promise<Menu[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/menus`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch menus: ${response.statusText}`);
    }

    const result: ApiResponse<Menu[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching all menus:", error);
    return [];
  }
}

// Get single menu by ID
export async function getMenuById(id: string): Promise<Menu | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/menus/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch menu: ${response.statusText}`);
    }

    const result: ApiResponse<Menu> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return null;
  }
}

// Create new menu
export async function createMenu(
  data: Omit<Menu, "id" | "created_at" | "updated_at" | "children">
): Promise<Menu | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/menus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create menu: ${response.statusText}`);
    }

    const result: ApiResponse<Menu> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error creating menu:", error);
    throw error;
  }
}

// Update menu
export async function updateMenu(
  id: string,
  data: Partial<Omit<Menu, "id" | "created_at" | "updated_at" | "children">>
): Promise<Menu | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/menus/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update menu: ${response.statusText}`);
    }

    const result: ApiResponse<Menu> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error updating menu:", error);
    throw error;
  }
}

// Delete menu
export async function deleteMenu(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/menus/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete menu: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting menu:", error);
    throw error;
  }
}

// Toggle menu active status
export async function toggleMenuActive(id: string): Promise<Menu | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/menus/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle menu active: ${response.statusText}`);
    }

    const result: ApiResponse<Menu> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error toggling menu active:", error);
    throw error;
  }
}

// Move menu to different parent
export async function moveMenu(
  id: string,
  parentId: string | null
): Promise<Menu | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/menus/${id}/move`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parent_id: parentId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to move menu: ${response.statusText}`);
    }

    const result: ApiResponse<Menu> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error moving menu:", error);
    throw error;
  }
}

// Reorder menu within same parent level
export async function reorderMenu(
  id: string,
  newIndex: number,
  oldIndex?: number
): Promise<Menu | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/menus/${id}/reorder`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        new_index: newIndex,
        ...(oldIndex !== undefined && { old_index: oldIndex }),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to reorder menu: ${response.statusText}`);
    }

    const result: ApiResponse<Menu> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error reordering menu:", error);
    throw error;
  }
}
