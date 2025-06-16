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



  // userData: any = {
  //   name: 'User',
  //   email: '',
  //   role: '',
  //   location: 'Cairo, Egypt',
  //   gender: 'Male',
  //   address: ''
  // };
  // isEditing = false;
  // currentDate = new Date();
  // @Input() isDarkMode = false;

  // constructor(private authService: AuthService, private router: Router) {}

  // ngOnInit() {
  //   // Get user data from auth service
  //   const loggedInUser = this.authService.getLoggedInUser();
  //   if (loggedInUser) {
  //     this.userData = {
  //       ...this.userData,
  //       email: loggedInUser.email,
  //       role: loggedInUser.role.charAt(0).toUpperCase() + loggedInUser.role.slice(1)
  //     };
  //     // Set name from email if available
  //     if (loggedInUser.email) {
  //       this.userData.name = loggedInUser.email.split('@')[0];
  //     }
  //   }
  // }

  // toggleEdit() {
  //   this.isEditing = !this.isEditing;
  // }

  // saveProfile() {
  //   // Here you would typically call an API to save the profile
  //   this.isEditing = false;
  //   // For demo purposes, we'll just update the local data
  // }
  
}
