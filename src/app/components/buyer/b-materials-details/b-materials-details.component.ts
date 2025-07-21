import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BFooterComponent } from '../b-footer/b-footer.component';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';
import { Material } from '../../../models/material.model';
import { MaterialsService } from '../../../services/materials.service';
import { filter } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../../services/cart.service';
import { SharedMatarialsService } from '../../../services/shared-matarials.service';
import { FeedbackService } from '../../../services/feedback.service';

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
  addingToCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private materialsService: MaterialsService,
    private snackBar: MatSnackBar,
    private cartService: CartService,
    private cartMaterials: SharedMatarialsService,
    private FeedbackService: FeedbackService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('id'));
      this.FeedbackService.setMaterialId(this.id);

      this.loadMaterial();
      this.checkIfInCart();
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

  checkIfInCart(): void {
    if (!this.material) {
      this.isInCart = false;
      return;
    }

    this.cartService.viewCart().subscribe({
      next: (res: any[]) => {
        this.isInCart = res.some(
          (item) => item.material.id === this.material?.id
        );
      },
      error: (err) => {
        console.error('Error checking cart:', err);
      },
    });
  }

  goBack() {
    this.router.navigate(['/b-materials']);
  }

  getImageUrl(image: string | undefined): string {
    if (!image) return 'assets/images/placeholder.png';
    return `http://localhost:8000/materials/${image}`;
  }

  // Update addToCart method
  addToCart(material: Material) {
    if (!material || this.addingToCart) return;

    if (this.isInCart) {
      this.showSnackbar(
        `${material.name} is already in your cart`,
        'info-snackbar'
      );
      return;
    }

    this.addingToCart = true;

    this.cartService.addToCart(material.id).subscribe({
      next: (res) => {
        this.isInCart = true;
        this.showSnackbar(`${material.name} added to cart`, 'success-snackbar');
        this.addingToCart = false;
      },
      error: (err) => {
        this.showSnackbar('Failed to add to cart', 'error-snackbar');
        this.addingToCart = false;
      },
    });
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
