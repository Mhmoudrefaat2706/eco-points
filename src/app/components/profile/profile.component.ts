import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  date = new Date();
  userName: string = `User`;
  greating: string = `Welocme, ${this.userName}`;
  email: string = 'test@email.com';
}
