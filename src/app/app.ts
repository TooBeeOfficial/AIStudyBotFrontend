import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './shared/services/user';
import { UserModel } from './models/UserModel';
import { Router } from '@angular/router';
import { ChatService } from './shared/services/chat';
import { ChatModel } from './models/chatModel';
import { AIBotService } from './shared/services/aibot';

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
        const chat = ChatModel.fromApi(chats[0]);
        this.chatService.getChatHistory(chat.id).subscribe({
          next: (messages) => {
            chat.messages = messages;
          },
        });
        this.chatService.setChat(chat);
      },
    });
    this.AIBotService.getAIModels().subscribe({
      next: (models) => {
        console.log(models)
        this.AIBotService.setAIModels(models);
      },
    });
  }
  userService = inject(UserService);
  chatService = inject(ChatService);
  AIBotService = inject(AIBotService);

  protected readonly title = signal('my-app');
}
