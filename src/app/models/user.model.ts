export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: 'active' | 'blocked';
  created_at: string;
  password?: string; // Made optional since we don't always need it
}

export interface CreateUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}

export interface RecentUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}