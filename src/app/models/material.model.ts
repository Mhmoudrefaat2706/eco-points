export interface Category {
  id: number;
  name: string;
}

export interface Material {
  id: number;
  name: string;
  category: string | Category; // Can be either string or Category object
  category_id?: number;
  image_url: string;
  description: string;
  price: number;
  price_unit: 'piece' | 'kg' | 'm²' | 'm³';
  seller_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MaterialRequest {
  name: string;
  category_id: number;
  description: string;
  price: number;
  price_unit: 'piece' | 'kg' | 'm²' | 'm³';
  image_url?: string;
}

export interface MaterialResponse {
  id: number;
  name: string;
  category: string | Category;
  description: string;
  price: number;
  price_unit: 'piece' | 'kg' | 'm²' | 'm³';
  image_url: string;
  seller_id: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}