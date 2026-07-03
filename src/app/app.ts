import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './shared/services/user';
import { ChatService } from './shared/services/chat';
import { ChatModel } from './models/chatModel';
import { AIBotService } from './shared/services/aibot';
import { QuizService } from './shared/services/quiz';
import { ChatOperationServices } from './shared/chat-operation-services';
import { MessageModel } from './models/chatMessageModel';
import { take } from 'rxjs';
import { AIModel } from './models/aiModel';
import { RouteServices } from './shared/route-services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  chatOperationService: ChatOperationServices = inject(ChatOperationServices);
  navigationService: RouteServices = inject(RouteServices);
  AIBotService: AIBotService = inject(AIBotService);
  quizService: QuizService = inject(QuizService);
  userService: UserService = inject(UserService);
  chatService: ChatService = inject(ChatService);

  ngOnInit(): void {
    this.userService.loadUser().subscribe({
      next: (res) => {
        if (!res) return;
        this.chatService.loadChats().subscribe({
          next: (chats) => {
            if (!chats) return;
            this.chatService.chat$.pipe(take(1)).subscribe({
              next: (currChat) => {
                if (!currChat?.id) {
                  return;
                }
                let chat: ChatModel = new ChatModel();
                if (currChat) {
                  chat = currChat;
                } else {
                  chat = ChatModel.fromApi(chats[0]);
                }

                this.chatService.getChatHistory(chat.id).subscribe({
                  next: (messages) => {
                    chat.messages = [...messages];
                    console.log(chat);
                    this.chatService.setChat(chat);
                    this.quizService.getQuizFromChat(chat.id).subscribe((res) => {
                      this.quizService.setQuiz(res);
                    });
                  },
                });
              },
            });

            this.chatOperationService.getFirstMessages().subscribe((values: MessageModel[]) => {
              this.chatOperationService.chatService.allchats$.subscribe((chats) => {
                if (!chats) return;
                chats.forEach((chat) => {
                  for (let index = 0; index < values.length; index++) {
                    if (chat.id === values[index].chat_id) {
                      chat.firstMessage = values[index];
                    }
                  }
                });
              });
            });
          },
        });
        this.AIBotService.getAIModels().subscribe({
          next: (models) => {
            let modes: AIModel[] = [];
            models.forEach((model) => {
              modes.push(AIModel.fromApi(model));
            });

            this.AIBotService.setAIModels(modes);
          },
        });
      },
      error: (err) => {},
    });
  }
}
