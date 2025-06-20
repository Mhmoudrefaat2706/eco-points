export interface Material {
  id: number;
  name: string;
  category: string;
  image: string;
  desc: string;
  price: number;
  priceUnit: string;
  isUserAdded?: boolean; // Optional because default materials won't have this
}