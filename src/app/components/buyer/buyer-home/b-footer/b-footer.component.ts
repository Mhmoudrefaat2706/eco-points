import { routes } from './../../../../app.routes';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-b-footer',
  imports: [TranslateModule, CommonModule],
  templateUrl: './b-footer.component.html',
  styleUrl: './b-footer.component.css',
})
export class BFooterComponent {
  constructor(private router: Router) {}
  // Navigation method
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
