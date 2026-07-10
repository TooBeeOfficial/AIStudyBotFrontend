import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-oauth-callback',
  imports: [],
  templateUrl: './oauth-callback.html',
  styleUrl: './oauth-callback.css',
})
export class OauthCallback {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiURL = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');

    if (!code) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.post(`${this.apiURL}/auth/exchange`, { code }, { withCredentials: true }).subscribe({
      next: () => {
        window.history.replaceState({}, '', '/oauth-callback');

        this.router.navigate(['/home']);
      },
      error: () => {
        this.router.navigate(['/login']);
      },
    });
  }
}
