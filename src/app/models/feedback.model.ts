export interface Feedback {
  id: number;
  seller_id: number;
  buyer_id: number;
  rating: number;
  comment: string;
  created_at: string;
  seller?: {
    id: number;
    name: string;
  };
  buyer?: {
    id: number;
    name: string;
  };
}