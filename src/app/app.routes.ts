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
import { BMaterialsComponent } from './components/buyer/buyer-home/b-materials/b-materials.component';
import { BMaterialsDetailsComponent } from './components/buyer/buyer-home/b-materials-details/b-materials-details.component';
import { BCartComponent } from './components/buyer/b-cart/b-cart.component';
import { BCheckoutComponent } from './components/b-checkout/b-checkout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'materials', component: MaterialsComponent, title: 'Materials' },
  {
    path: 'materials/:id',
    component: MaterialsDetailsComponent,
    title: 'Material Details',
  },
  { path: 'about', component: AboutComponent, title: 'About Us' },
  { path: 'contact', component: ContactComponent, title: 'Contact Us' },
  { path: 'profile', component: ProfileComponent, title: 'profile' },

  { path: 'buyer-home', component: BuyerHomeComponent, pathMatch: 'full' },
  { path: 'buyer-homee', component: BuyerHomeComponent, pathMatch: 'full' },
  { path: 'b-material', component: BMaterialsComponent, pathMatch: 'full' },
  {
    path: 'b-materials/:id',
    component: BMaterialsDetailsComponent,
    title: 'Buyer Material Details',
  },
  { path: 'b-cart', component: BCartComponent, pathMatch: 'full' },
  // { path: '404', component: NotFoundComponent, title: 'Page Not Found' },
  { path: '**', redirectTo: '/404' },
];

export const AppRoutingModule = RouterModule.forRoot(routes);
export const AppRoutingProviders = importProvidersFrom(AppRoutingModule);
