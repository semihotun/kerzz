import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'main-page',
    loadComponent: () => import('./components/main-page/main-page.component').then((m) => m.MainPageComponent),
  },
  {
    path: '',
    redirectTo: 'main-page',
    pathMatch: 'full',
  },
];

