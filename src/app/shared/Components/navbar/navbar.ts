import { Component, HostListener, inject, signal } from '@angular/core';
import { UserService } from '../../services/user';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { RouteServices } from '../../route-services';

@Component({
  selector: 'app-navbar',
  imports: [MatIcon, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  navigationService: RouteServices = inject(RouteServices);
  userService: UserService = inject(UserService);

  showProfileDropdown: boolean = false;
  menuOpen: boolean = false;

  isMobile = signal(window.innerWidth < 850);

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth < 850);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.profile-dropdown') && !target.closest('button')) {
      this.showProfileDropdown = false;
    }
  }

  openDropDownMenu() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  logoutUser() {
    this.userService
      .logout()
      .subscribe({
        next: () => {
          this.navigationService.navigateTo('/login');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
