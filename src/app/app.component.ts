import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ScrollTopService } from './services/scroll-top.service';
import { LoaderComponent } from './components/loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  authService = inject(AuthService);
  title = 'Final';

  constructor(private scrollTopService: ScrollTopService) {}

  ngOnInit() {
    this.scrollTopService.init();
  }
}
