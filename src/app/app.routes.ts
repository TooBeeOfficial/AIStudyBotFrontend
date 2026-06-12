import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { Home } from './pages/home/home';
import { Quiz } from './pages/quiz/quiz';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'home', component: Home },
  { path: 'quizes', component: Quiz },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
