import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'shelf',
    loadComponent: () => import('./pages/shelf/shelf').then((m) => m.Shelf),
  },
  {
    path: 'shelf/:slug',
    loadComponent: () => import('./pages/product/product').then((m) => m.ProductPage),
  },
  {
    path: 'how-it-works',
    loadComponent: () => import('./pages/how-it-works/how-it-works').then((m) => m.HowItWorks),
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services').then((m) => m.Services),
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing/pricing').then((m) => m.Pricing),
  },
  {
    path: 'roadmap',
    loadComponent: () => import('./pages/roadmap/roadmap').then((m) => m.Roadmap),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'request',
    loadComponent: () => import('./pages/request/request').then((m) => m.Request),
  },
  {
    path: 'legal/:page',
    loadComponent: () => import('./pages/legal/legal').then((m) => m.Legal),
  },
  {
    path: 'login',
    data: { mode: 'login' },
    loadComponent: () => import('./pages/auth/auth').then((m) => m.AuthPage),
  },
  {
    path: 'register',
    data: { mode: 'register' },
    loadComponent: () => import('./pages/auth/auth').then((m) => m.AuthPage),
  },
  {
    path: 'forgot',
    data: { mode: 'forgot' },
    loadComponent: () => import('./pages/auth/auth').then((m) => m.AuthPage),
  },
  {
    path: 'account',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/account/account').then((m) => m.Account),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/overview').then((m) => m.AdminOverview),
      },
      {
        path: 'requests',
        loadComponent: () => import('./pages/admin/requests').then((m) => m.AdminRequests),
      },
      {
        path: 'customers',
        loadComponent: () => import('./pages/admin/customers').then((m) => m.AdminCustomers),
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/admin/products').then((m) => m.AdminProducts),
      },
    ],
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
