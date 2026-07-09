import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UserService } from './shared/services/user';
import { RouteServices } from './shared/route-services';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  navigationService: RouteServices = inject(RouteServices);
  constructor(private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.getUser().pipe(
      map((user) => {
        if (user) {
          this.navigationService.navigateTo(RouteServices.routes.home);
          return false;
        }
        return true;
      }),
    );
  }
}