import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/UserModel';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiURL = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private userSubject = new BehaviorSubject<User | null>(null);

  user$ = this.userSubject.asObservable();

  get user(): User | null {
    return this.userSubject.value;
  }
  setUser(user: User | null) {
    this.userSubject.next(user);
  }
  clearUser() {
    this.userSubject.next(null);
  }

  loginUser(email: string, password: string): Observable<JSON> {
    return this.http.post<JSON>(this.apiURL + '/login/email', {
      email: email,
      password: password,
    });
  }

  googleLoginSignUp() {
    window.open(this.apiURL + '/oauth2/redirect/google', '_self');
  }

  signUpUser(username: string, email: string, password: string): Observable<JSON> {
    return this.http.post<JSON>(this.apiURL + '/signup', {
      name: username,
      email: email,
      password: password,
    });
  }

  getUser() {
    return this.http.get<JSON>(this.apiURL + '/me', { withCredentials: true });
  }

  logout() {
    return this.http.post<JSON>(this.apiURL + '/logout', {}, { withCredentials: true });
  }
}
