import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { Home } from './pages/home/home';
import { Quiz } from './pages/quiz/quiz';
import { TakeQuiz } from './pages/take-quiz/take-quiz';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'home', component: Home },
  { path: 'quizes', component: Quiz },
  { path: 'takeQuiz', component: TakeQuiz },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
