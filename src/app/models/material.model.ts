// Create a new file: src/app/models/material.model.ts
export interface Material {
  id: number;
  name: string;
  category: string;
  image: string;
  desc: string;
  isUserAdded?: boolean; // Optional because default materials won't have this
}