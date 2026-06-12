import { Component, inject } from '@angular/core';
import { UserService } from '../../shared/services/user';
import { Navbar } from '../components/navbar/navbar';
import { RouteServices } from '../../shared/route-services';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-quiz',
  imports: [Navbar, MatIcon],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz {
  menuOpen: boolean = true;
  openMenu() {
    this.menuOpen = !this.menuOpen;
  }
  navigationService: RouteServices = inject(RouteServices);

  home() {
    this.navigationService.navigateTo(RouteServices.routes.home);
  }
}
