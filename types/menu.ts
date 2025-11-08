export interface Menu {
  id: number;
  title: string;
  path: string;
  icon: string;
  is_active: boolean;
  order_index: number;
  parent_id: number | null;
  children?: Menu[];
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  error?: string;
}
