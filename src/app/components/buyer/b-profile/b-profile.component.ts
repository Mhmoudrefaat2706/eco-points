import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { BNavbarComponent } from "../b-navbar/b-navbar.component";

// Define the User interface with all required properties
interface User {
  name?: string;
  email: string;
  role: string;
  gender?: string;
  location?: string;
  address?: string;
}

@Component({
  selector: 'app-b-profile',
  imports: [CommonModule, FormsModule, BNavbarComponent],
  templateUrl: './b-profile.component.html',
  styleUrl: './b-profile.component.css'
})
export class BProfileComponent implements OnInit {

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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
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
    // In a real app, call API to save profile here
    this.isEditing = false;
  }

}
