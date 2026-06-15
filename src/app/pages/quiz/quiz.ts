import { Component, inject } from '@angular/core';
import { UserService } from '../../shared/services/user';
import { Navbar } from '../../shared/Components/navbar/navbar';
import { RouteServices } from '../../shared/route-services';
import { MatIcon } from '@angular/material/icon';
import { SideBar } from "../../shared/Components/side-bar/side-bar";

@Component({
  selector: 'app-quiz',
  imports: [Navbar, MatIcon, SideBar],
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
