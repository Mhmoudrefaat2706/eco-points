// feedback.model.ts
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  name?: string; // Optional if needed for backward compatibility
}

export interface Feedback {
  id: number;
  seller_id: number;
  buyer_id: number;
  rating: number;
  comment: string;
  created_at: string;
  seller: User;  // Required field
  buyer: User;   // Required field
}