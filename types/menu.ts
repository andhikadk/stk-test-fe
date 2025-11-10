export interface Menu {
  id: string;
  title: string;
  path: string;
  icon: string;
  order_index: number;
  parent_id: string | null;
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
