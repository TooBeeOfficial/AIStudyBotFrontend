import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './shared/services/user';
import { UserModel } from './models/UserModel';
import { Router } from '@angular/router';
import { ChatService } from './shared/services/chat';
import { ChatModel } from './models/chatModel';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  ngOnInit(): void {
    this.userService.loadUser().subscribe();
    this.chatService.loadChat().subscribe({
      next: (chats) => {
        this.chatService.setChat(ChatModel.fromApi(chats[0]));
      },
    });
    console.log(this.chatService.allchats$);
    console.log(this.chatService.chat$);
  }
  userService = inject(UserService);
  chatService = inject(ChatService);

  protected readonly title = signal('my-app');
}
