import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Material } from '../models/material.model';
import { AuthService } from './auth.service';

interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class MaterialsService {
  private apiUrl = 'http://localhost:8000/api';
  categories: string[] = [
    'Metal',
    'Wood',
    'Fabric',
    'Plastic',
    'Stone',
    'Elastomer',
    'Ceramic',
    'Composite',
    'Construction',
    'Other',
  ];

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const user = this.authService.getLoggedInUser();
    if (!user || !user.token) {
      throw new Error('User not authenticated');
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
      Accept: 'application/json',
    });
  }

  private getTokenFromUser(user: any): string {
    return user.token || '';
  }

  // Update the getAllMaterials method signature:
  getAllMaterials(
    page: number = 1,
    search?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    status?: string
  ): Observable<{
    data: Material[];
    total: number;
    last_page: number;
    current_page: number;
  }> {
    let params = new URLSearchParams();
    params.append('page', page.toString());

    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (minPrice) params.append('min_price', minPrice.toString());
    if (maxPrice) params.append('max_price', maxPrice.toString());
    if (status) params.append('status', status);

    return this.http.get<{
      data: Material[];
      total: number;
      last_page: number;
      current_page: number;
    }>(`${this.apiUrl}/materials?${params.toString()}`);
  }

  // Get seller's materials (for dashboard) - returns paginated response
  getMyMaterials(
    page: number,
    search?: string,
    category?: string
  ): Observable<{
    data: Material[];
    total: number;
    last_page: number;
    current_page: number;
  }> {
    let params = new URLSearchParams();
    params.append('page', page.toString());

    if (search) {
      params.append('search', search);
    }

    if (category && category !== 'All') {
      params.append('category', category);
    }

    return this.http
      .get<any>(`${this.apiUrl}/materials/my-materials?${params.toString()}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching my materials:', error);
          return of({ data: [], total: 0, current_page: 1, last_page: 1 });
        })
      );
  }

  // Update getMaterialById to expect the nested response
  getMaterialById(id: number): Observable<Material | null> {
    return this.http.get<any>(`${this.apiUrl}/materials/details/${id}`).pipe(
      map((response) => this.mapApiToMaterial(response.material) || null),
      catchError((error) => {
        console.error(`Error fetching material ${id}:`, error);
        return of(null);
      })
    );
  }

  // Update the addMaterial method
  addMaterial(material: any): Observable<any> {
    const materialData = {
      name: material.name,
      category_id: material.category_id,
      description: material.description,
      price: material.price,
      price_unit: material.price_unit,
      image_url: material.image_url,
    };

    return this.http.post<any>(`${this.apiUrl}/materials`, materialData, {
      headers: this.getHeaders(),
    });
  }

  // Update material
  updateMaterial(id: number, material: any): Observable<any> {
    const materialData = {
      name: material.name,
      category_id: material.category_id,
      description: material.description,
      price: material.price,
      price_unit: material.price_unit,
      image_url: material.image_url,
    };

    return this.http
      .put<any>(`${this.apiUrl}/materials/${id}`, materialData, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error updating material:', error);
          throw error;
        })
      );
  }

  // Delete material
  deleteMaterial(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/materials/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error deleting material:', error);
          throw error;
        })
      );
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(`${this.apiUrl}/categories`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError(() =>
          of(this.categories.map((name, index) => ({ id: index + 1, name })))
        )
      );
  }

  // Get latest materials
  getLatestMaterials(): Observable<Material[]> {
    return this.http
      .get<Material[]>(`${this.apiUrl}/materials/latest?status=active`)
      .pipe(
        map((materials) =>
          materials.map((material) => this.mapApiToMaterial(material))
        ),
        catchError((error) => {
          console.error('Error fetching latest materials:', error);
          return of([]);
        })
      );
  }

  // Helper method to map API response to Material model
  private mapApiToMaterial(apiMaterial: any): Material {
    return {
      id: apiMaterial.id,
      name: apiMaterial.name,
      category:
        apiMaterial.category?.name || apiMaterial.category || 'Uncategorized',
      category_id: apiMaterial.category_id,
      image_url:
        apiMaterial.image_url ||
        apiMaterial.image ||
        './assets/default-material.jpg',
      description:
        apiMaterial.description ||
        apiMaterial.desc ||
        'No description available',
      price: apiMaterial.price,
      price_unit: apiMaterial.price_unit || 'piece',
    };
  }

  // Fixed uploadImage method
  uploadImage(imageFile: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${
        this.authService.getLoggedInUser()?.token || ''
      }`,
      Accept: 'application/json',
    });

    // Use the correct endpoint
    return this.http
      .post(`${this.apiUrl}/materials/upload-image`, imageFile, {
        headers: headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Upload error:', error);
          return throwError(() => new Error('Image upload failed'));
        })
      );
  }
}
