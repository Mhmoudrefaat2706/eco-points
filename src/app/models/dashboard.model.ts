export interface DashboardStats {
  users_count: number;
  active_materials: number;
  blocked_materials: number;
  pending_materials?: number;
  recent_users: {
    id: number;
    name: string;
    email: string;
    created_at: string;
  }[];
  recent_materials: {
    id: number;
    name: string;
    price: number;
    status: string;
    created_at: string;
    category: string;
  }[];
  materials_by_category?: {
    category: string;
    count: number;
  }[];
  user_registration_stats?: {
    date: string;
    count: number;
  }[];
}

// Optional: You can also add interfaces for specific components of the dashboard
export interface RecentUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface RecentMaterial {
  id: number;
  name: string;
  price: number;
  created_at: string;
  status: 'active' | 'blocked' | 'pending';
}
