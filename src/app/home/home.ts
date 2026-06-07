import { Component, Inject } from '@angular/core';
import { UserService } from '../shared/services/user';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MatIconModule,CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
    private userService = Inject(UserService)
    menuOpen:boolean = false

    openMenu(){
      this.menuOpen = !this.menuOpen
    }
}
