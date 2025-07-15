import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BFooterComponent } from '../b-footer/b-footer.component';
import { BNavbarComponent } from '../b-navbar/b-navbar.component';
import { Material } from '../../../models/material.model';
import { MaterialsService } from '../../../services/materials.service';
import { filter } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../../services/cart.service';

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
  material: Material | undefined;
  id: number = 0;
  quantity: number = 1;
  isLoading: boolean = true;
  errorMessage: string = '';
  isInCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private materialsService: MaterialsService,
    private snackBar: MatSnackBar,
    private cartService: CartService
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
      this.loadMaterial();
      this.checkIfInCart();
    });
  }

  loadMaterial(): void {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.material = this.materialsService.getMaterialById(this.id);
      if (!this.material) {
        this.errorMessage = 'Material not found';
      }
      this.isLoading = false;
    } catch (error) {
      this.errorMessage = 'Failed to load material details';
      this.isLoading = false;
      console.error('Error loading material:', error);
    }
  }

  checkIfInCart(): void {
    if (!this.material) return;
    this.cartService.viewCart().subscribe({
      next: (res: any[]) => {
        this.isInCart = res.some((item) => item.material.id === this.material?.id);
      },
      error: (err) => {
        console.error('Error checking cart:', err);
      },
    });
  }

  goBack() {
    this.router.navigate(['/b-materials']);
  }

  addToCart(material: Material) {
    if (this.isInCart) {
      this.showSnackbar(`${material.name} is already in your cart`, 'info-snackbar');
      return;
    }

    this.cartService.addToCart(material.id).subscribe({
      next: (res) => {
        this.isInCart = true;
        this.showSnackbar(`${material.name} added to cart`, 'success-snackbar');
        console.log('Added to cart:', res);
      },
      error: (err) => {
        this.showSnackbar('Failed to add to cart', 'error-snackbar');
        console.error('Error:', err);
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
