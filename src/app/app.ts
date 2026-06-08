import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './shared/services/user';
import { UserModel } from './models/UserModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  ngOnInit(): void {
    this.userService.loadUser().subscribe();
  }
  userService = inject(UserService);
  private router = inject(Router);

  protected readonly title = signal('my-app');
}
