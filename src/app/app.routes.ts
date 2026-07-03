import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { Home } from './pages/home/home';
import { Quiz } from './pages/quiz/quiz';
import { TakeQuiz } from './pages/take-quiz/take-quiz';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'quizes', component: Quiz, canActivate: [AuthGuard] },
  { path: 'takeQuiz', component: TakeQuiz, canActivate: [AuthGuard] },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
