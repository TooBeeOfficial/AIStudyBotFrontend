import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [MatIcon, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  userService: UserService = inject(UserService);
  menuOpen: any;
  showProfileDropdown: any;
  navigationService: any;

  logoutUser() {
    this.userService.logout().subscribe({
      next: () => {
        this.navigationService.navigateTo('/login');
      },
    });
  }
}
