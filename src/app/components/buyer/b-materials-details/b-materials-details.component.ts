import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BFooterComponent } from '../b-footer/b-footer.component';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';
import { Material } from '../../../models/material.model';
import { SharedMatarialsService } from '../../../services/shared-matarials.service';
import { MaterialsService } from '../../../services/materials.service';
import { filter } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-b-materials-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BFooterComponent,
    BNavbarComponent,
    MatSnackBarModule,
  ],
  templateUrl: './b-materials-details.component.html',
  styleUrls: ['./b-materials-details.component.css'],
})
export class BMaterialsDetailsComponent implements OnInit {
  material: Material | null = null;
  id: number = 0;
  quantity: number = 1;
  isLoading: boolean = true;
  errorMessage: string = '';
  isInCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartMaterials: SharedMatarialsService,
    private materialsService: MaterialsService,
    private snackBar: MatSnackBar
  ) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('id'));
      this.loadMaterial();
    });
  }

  loadMaterial(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.materialsService.getMaterialById(this.id).subscribe({
      next: (material) => {
        this.material = material;
        this.isLoading = false;
        this.checkIfInCart();

        if (!material) {
          this.errorMessage = 'Material not found';
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load material details';
        this.isLoading = false;
        console.error('Error loading material:', error);
      },
    });
  }

  // Update checkIfInCart to handle null case
  checkIfInCart(): void {
    if (this.material) {
      this.isInCart = this.cartMaterials.isInCart(this.material.id);
    } else {
      this.isInCart = false;
    }
  }

  goBack() {
    this.router.navigate(['/b-materials']);
  }
getImageUrl(image: string | undefined): string {
  if (!image) return 'assets/images/placeholder.png'; // صورة افتراضية
  return `http://localhost:8000/materials/${image}`;
}

  // Update addToCart to handle null case
  addToCart(material: Material) {
    if (!material) return;

    if (this.isInCart) {
      this.showSnackbar(
        `${material.name} is already in your cart`,
        'info-snackbar'
      );
      return;
    }

    const itemToAdd = {
      ...material,
      quantity: this.quantity,
    };

    this.cartMaterials.addToCart(itemToAdd);
    this.isInCart = true;
    this.showSnackbar(`${material.name} added to cart`, 'success-snackbar');
  }

  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [panelClass],
    });
  }
}
