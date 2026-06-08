import { Component, inject, Inject, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserModel } from '../models/UserModel';

@Component({
  selector: 'app-home',
  imports: [MatIconModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home  {
  userService: UserService = inject(UserService);
  menuOpen: boolean = false;
  constructor() {
  }

  get username() {
    return this.userService.user?.name;
  }

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
