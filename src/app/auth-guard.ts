import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take, tap } from 'rxjs';
import { UserService } from './shared/services/user';
import { RouteServices } from './shared/route-services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  navigationService: RouteServices = inject(RouteServices);

  constructor(private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.getUser().pipe(
      tap((activate) => {
        if (!activate) {
          this.navigationService.navigateTo(RouteServices.routes.login, {
            queryParams: { returnUrl: state.url },
          });
          return false;
        } else {
          return true;
        }
      }),
    );
  }
}
