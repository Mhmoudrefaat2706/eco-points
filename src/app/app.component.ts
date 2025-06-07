
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ProfileComponent } from './components/profile/profile.component';
import { MaterialsComponent } from './components/materials/materials.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  authService = inject(AuthService);
  title = 'Final';
}

