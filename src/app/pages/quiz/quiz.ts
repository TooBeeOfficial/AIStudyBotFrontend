import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user';
import { Navbar } from '../../shared/Components/navbar/navbar';
import { RouteServices } from '../../shared/route-services';
import { MatIcon } from '@angular/material/icon';
import { SideBar } from '../../shared/Components/side-bar/side-bar';
import { ChatOperationServices } from '../../shared/chat-operation-services';

@Component({
  selector: 'app-quiz',
  imports: [Navbar, MatIcon, SideBar],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit {
  chatOperationService: ChatOperationServices = inject(ChatOperationServices);
  
  menuOpen: boolean = true;
  navigationService: RouteServices = inject(RouteServices);

  home() {
    this.navigationService.navigateTo(RouteServices.routes.home);
  }

  ngOnInit(): void {
  }

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
