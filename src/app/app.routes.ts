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
import { BMaterialsComponent } from './components/buyer/b-materials/b-materials.component';
import { BMaterialsDetailsComponent } from './components/buyer/b-materials-details/b-materials-details.component';
import { BCartComponent } from './components/buyer/b-cart/b-cart.component';
import { DashboardComponent } from './components/seller/dashboard/dashboard.component';
import { BCheckoutComponent } from './components/buyer/b-checkout/b-checkout.component';
import { BProfileComponent } from './components/buyer/b-profile/b-profile.component';
import { BAboutComponent } from './components/buyer/b-about/b-about.component';
import { FeedbackComponent } from './components/buyer/b-feadback/b-feadback.component';
import { BOrderConfirmationComponent } from './components/buyer/b-order-confirmation/b-order-confirmation.component';
import { SellerFeedbacksComponent } from './components/buyer/seller-feedbacks/seller-feedbacks.component';
import { UsersListComponent } from './components/admin/users-list/users-list.component';
import { MaterialsListComponent } from './components/admin/materials-list/materials-list.component';
import { UserFormComponent } from './components/admin/user-form/user-form.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { FeedbacksListComponent } from './components/admin/feedbacks-list/feedbacks-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'logout', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  {
    path: 'seller-feedbacks/:seller_id/:material_id',
    component: SellerFeedbacksComponent,
  },

  {
    path: 'my-orders',
    loadComponent: () =>
      import('./my-orders/my-orders.component').then(
        (m) => m.MyOrdersComponent
      ),
  },

  // Seller routes
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [RoleGuard],
    data: { role: 'seller' },
  },
  {
    path: 'materials',
    component: MaterialsComponent,
    title: 'Materials',
    canActivate: [RoleGuard],
    data: { role: 'seller' },
  },
  {
    path: 'materials/:id',
    component: MaterialsDetailsComponent,
    title: 'Material Details',
    canActivate: [RoleGuard],
    data: { role: 'seller' },
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About Us',
    canActivate: [RoleGuard],
    data: { role: 'seller' },
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'Contact Us',
    canActivate: [RoleGuard],
    data: { role: 'seller' },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Profile',
    canActivate: [RoleGuard],
    data: { role: 'seller' },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'dashbord',
    canActivate: [RoleGuard],
    data: { role: 'seller' },
  },

  // Buyer route
  {
    path: 'buyer-home',
    component: BuyerHomeComponent,
    title: 'Buyer Home',
    canActivate: [RoleGuard],
    data: { role: 'buyer' },
  },
  {
    path: 'b-materials',
    component: BMaterialsComponent,
    pathMatch: 'full',
    title: 'Buyer Matirials',
    canActivate: [RoleGuard],
    data: { role: 'buyer' },
  },
  {
    path: 'b-materials/:id',
    component: BMaterialsDetailsComponent,
    title: 'Buyer Material Details',
    canActivate: [RoleGuard],
    data: { role: 'buyer' },
  },
  {
    path: 'b-about',
    component: BAboutComponent,
    title: 'Buyer About',
    canActivate: [RoleGuard],
    data: { role: 'buyer' },
  },
  {
    path: 'b-cart',
    component: BCartComponent,
    pathMatch: 'full',
    title: 'My Cart',
    canActivate: [RoleGuard],
    data: { role: 'buyer' },
  },
  {
    path: 'b-profile',
    component: BProfileComponent,
    title: 'My Profile',
    canActivate: [RoleGuard],
    data: { role: 'buyer' },
  },
  {
    path: 'feedback/:seller',
    component: FeedbackComponent,
    title: 'feadback',
    canActivate: [RoleGuard],
    data: { role: 'buyer' },
  },
  {
    path: 'b-checkout',
    component: BCheckoutComponent,
    pathMatch: 'full',
    title: 'Checkout',
    canActivate: [RoleGuard],
    data: { role: 'buyer' },
  },
  {
    path: 'order-confirmation',
    component: BOrderConfirmationComponent,
    pathMatch: 'full',
    title: 'Order Confirmation',
    canActivate: [RoleGuard],
    data: { role: 'buyer' },
  },

  // Admin routes
  {
    path: 'admin',
    component: AdminLayoutComponent, // Use the layout component
    canActivate: [RoleGuard],
    data: { role: 'admin' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
      },
      {
        path: 'users',
        component: UsersListComponent,
      },
      {
        path: 'users/new',
        component: UserFormComponent,
      },
      {
        path: 'materials',
        component: MaterialsListComponent,
      },
      {
        path: 'feedbacks',
        component: FeedbacksListComponent,
      },
    ],
  },

  // Not found
  { path: '404', component: NotFoundComponent, title: 'Page Not Found' },
  { path: '**', redirectTo: '/404' },
];

export const AppRoutingModule = RouterModule.forRoot(routes);
export const AppRoutingProviders = importProvidersFrom(AppRoutingModule);
