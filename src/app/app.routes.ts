import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/seller/home/home.component';
import { MaterialsComponent } from './components/seller/materials/materials.component';
import { MaterialsDetailsComponent } from './components/seller/materials-details/materials-details.component';
import { NotFoundComponent } from './components/seller/not-found/not-found.component';
import { ProfileComponent } from './components/seller/profile/profile.component';
import { AboutComponent } from './components/seller/about/about.component';
import { ContactComponent } from './components/seller/contact/contact.component';
import { BuyerHomeComponent } from './components/buyer/buyer-home/buyer-home.component';

import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'logout', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },

  // Seller routes
  { path: 'home', component: HomeComponent, canActivate: [RoleGuard], data: { role: 'seller' } },
  { path: 'materials', component: MaterialsComponent, title: 'Materials', canActivate: [RoleGuard], data: { role: 'seller' } },
  { path: 'materials/:id', component: MaterialsDetailsComponent, title: 'Material Details', canActivate: [RoleGuard], data: { role: 'seller' } },
  { path: 'about', component: AboutComponent, title: 'About Us', canActivate: [RoleGuard], data: { role: 'seller' } },
  { path: 'contact', component: ContactComponent, title: 'Contact Us', canActivate: [RoleGuard], data: { role: 'seller' } },
  { path: 'profile', component: ProfileComponent, title: 'Profile', canActivate: [RoleGuard], data: { role: 'seller' } },

  // Buyer route
  { path: 'buyer-home', component: BuyerHomeComponent, canActivate: [RoleGuard], data: { role: 'buyer' } },

  // Not found
  { path: '404', component: NotFoundComponent, title: 'Page Not Found' },
  { path: '**', redirectTo: '/404' }
];

export const AppRoutingModule = RouterModule.forRoot(routes);
export const AppRoutingProviders = importProvidersFrom(AppRoutingModule);
