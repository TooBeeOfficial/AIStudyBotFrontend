import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Auth {
  private cookieName = 'token';

  setToken(token: string) {
    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `${this.cookieName}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`;
  }

  getToken(): string | null {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${this.cookieName}=`));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
  }

  clearToken() {
    document.cookie = `${this.cookieName}=; Path=/; Max-Age=0`;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}