import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './shared/services/user';
import { ChatService } from './shared/services/chat';
import { ChatModel } from './models/chatModel';
import { AIBotService } from './shared/services/aibot';
import { QuizService } from './shared/services/quiz';
import { ChatOperationServices } from './shared/chat-operation-services';
import { MessageModel } from './models/chatMessageModel';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  quizService: QuizService = inject(QuizService);
  chatOperationService: ChatOperationServices = inject(ChatOperationServices);

  ngOnInit(): void {
    this.userService.loadUser().subscribe({
      next: () => {
        this.chatService.loadChats().subscribe({
          next: (chats) => {
            if (!chats?.length) return;

            const chat = ChatModel.fromApi(chats[0]);

            this.chatService.getChatHistory(chat.id).subscribe({
              next: (messages) => {
                chat.messages = messages;
                this.chatService.setChat(chat);
                this.quizService.getQuizFromChat(chat.id).subscribe((res) => {
                  console.log(res);
                  this.quizService.setQuiz(res);
                  this.quizService.quiz$.subscribe((quizes) => {
                    console.log(quizes?.questions);
                  });
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
            console.log(models);
            this.AIBotService.setAIModels(models);
          },
        });
      },
    });
  }
  userService = inject(UserService);
  chatService = inject(ChatService);
  AIBotService = inject(AIBotService);

  protected readonly title = signal('my-app');
}
