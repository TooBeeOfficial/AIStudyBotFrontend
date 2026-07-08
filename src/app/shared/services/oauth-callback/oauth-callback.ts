import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-oauth-callback',
  imports: [],
  templateUrl: './oauth-callback.html',
  styleUrl: './oauth-callback.css',
})
export class OauthCallback {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(Auth);

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.auth.setToken(token);
      this.router.navigate(['/home'], { replaceUrl: true });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
