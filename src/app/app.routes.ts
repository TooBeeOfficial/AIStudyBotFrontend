import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { Home } from './home/home';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'home', component: Home },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
