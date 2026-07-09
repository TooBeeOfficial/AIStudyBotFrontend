import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { Home } from './pages/home/home';
import { Quiz } from './pages/quiz/quiz';
import { TakeQuiz } from './pages/take-quiz/take-quiz';
import { AuthGuard } from './auth-guard';
import { OauthCallback } from './shared/services/oauth-callback/oauth-callback';
import { LoginGuard } from './login-guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage, canActivate: [LoginGuard] },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'quizes', component: Quiz, canActivate: [AuthGuard] },
  { path: 'takeQuiz', component: TakeQuiz, canActivate: [AuthGuard] },
  { path: 'oauth-callback', component: OauthCallback },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
