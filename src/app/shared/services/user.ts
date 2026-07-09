import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { UserModel } from '../../models/UserModel';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiURL = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private userSubject = new BehaviorSubject<UserModel | null>(null);
  authService: Auth = inject(Auth);
  user$ = this.userSubject.asObservable();

  get user(): UserModel | null {
    return this.userSubject.value;
  }
  setUser(user: UserModel | null) {
    this.userSubject.next(user);
  }
  clearUser() {
    this.userSubject.next(null);
  }

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post(
      this.apiURL + '/login/email',
      {
        email: email,
        password: password,
      },
      { withCredentials: true },
    );
  }

  googleLoginSignUp() {
    window.open(this.apiURL + '/login/google', '_self');
  }

  signUpUser(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      this.apiURL + '/signup',
      {
        name: username,
        email: email,
        password: password,
      },
      { withCredentials: true },
    );
  }

  getUser() {
    return this.http.get(this.apiURL + '/me', { withCredentials: true }).pipe(
      tap((user) => this.setUser(UserModel.fromApi(user))),
      map((user) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      }),
      catchError((err) => {
        console.error('getUser error: No user logged in!');
        return of(false);
      }),
    );
  }

  logout() {
    this.authService.clearToken();
    return this.http.post(this.apiURL + '/logout', {}, { withCredentials: true });
  }
}
