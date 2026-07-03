import { inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { UserService } from './shared/services/user';
import { RouteServices } from './shared/route-services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  navigationService: RouteServices = inject(RouteServices);

  constructor(private userService: UserService) {}

  canActivate(): Observable<boolean> {
    return this.userService.user$.pipe(
      take(1),
      map((user) => {
        console.log(user);
        if (!user) {
          this.navigationService.navigateTo(RouteServices.routes.login);
          return false;
        }
        return true;
      }),
    );
  }
}
