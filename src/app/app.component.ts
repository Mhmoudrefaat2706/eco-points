// app.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ScrollTopService } from './services/scroll-top.service';
import { LoaderComponent } from "./components/loader/loader.component";
import { ChatbotComponent } from "./chatbot/chatbot.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoaderComponent, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  authService = inject(AuthService);
  title = 'Final';

  constructor(private scrollTopService: ScrollTopService) {}

  ngOnInit() {
    this.scrollTopService.init();
  }
}