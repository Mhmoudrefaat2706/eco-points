import { Component, Input } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";
import { Router } from '@angular/router';

// Define the User interface
interface User {
  name?: string;
  email: string;
  role: string;
  gender?: string;
  location?: string;
  address?: string;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {



  userData: User = {
    name: 'User',
    email: '',
    role: '',
    location: 'Cairo, Egypt',
    gender: 'Male',
    address: ''
  };

  isEditing = false;
  currentDate = new Date();
  @Input() isDarkMode = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const loggedInUser = this.authService.getLoggedInUser() as User;
    if (loggedInUser) {
      this.userData = {
        ...this.userData,
        name: loggedInUser.name || loggedInUser.email.split('@')[0],
        email: loggedInUser.email,
        role: this.capitalizeFirstLetter(loggedInUser.role),
        gender: loggedInUser.gender || 'Male',
        location: loggedInUser.location || 'Cairo, Egypt',
        address: loggedInUser.address || ''
      };
    }
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    console.log('Profile updated:', this.userData);
    this.isEditing = false;
  }
}