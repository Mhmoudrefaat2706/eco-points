import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CurrencyPipe } from '@angular/common';
import { MaterialsService } from '../../../services/materials.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Material } from '../../../models/material.model';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-materials-details',
  standalone: true,
  imports: [NavbarComponent, CurrencyPipe, FooterComponent],
  templateUrl: './materials-details.component.html',
  styleUrl: './materials-details.component.css',
})
export class MaterialsDetailsComponent implements OnInit {
  material: Material | null = null;
  id: number = 0;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private materialsService: MaterialsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('id'));
      if (this.id) {
        this.loadMaterial();
      } else {
        this.error = 'Invalid material ID';
        this.isLoading = false;
      }
    });
  }

  private loadMaterial(): void {
    this.isLoading = true;
    this.error = null;
    this.material = null;

    this.materialsService
      .getMaterialById(this.id)
      .pipe(
        catchError((error) => {
          console.error('Error loading material:', error);
          this.error = 'Failed to load material details';
          return of(null);
        })
      )
      .subscribe({
        next: (material) => {
          this.material = material;
          if (!material && !this.error) {
            this.error = 'Material not found';
          }
        },
        error: () => {
          this.error = 'Failed to load material details';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  goBack() {
    this.router.navigate(['/materials']);
  }
}
