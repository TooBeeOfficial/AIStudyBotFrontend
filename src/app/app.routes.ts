import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'home', component: Home },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
