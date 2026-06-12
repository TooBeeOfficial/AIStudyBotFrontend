import { inject, Injectable, Service } from '@angular/core';
import { filter, take, switchMap, of, forkJoin, catchError } from 'rxjs';
import { QuestionBuilderDialogComponent } from './dialogs/create-new-question/create-new-question';
import { MessageDialogComponent } from './dialogs/success-dialog/success-dialog';
import { TwoButtonDialog } from './dialogs/two-button-dialog/two-button-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from './services/chat';
import { RouteServices } from './route-services';
import { QuestionsService } from './services/questions';
import { MessageModel } from '../models/chatMessageModel';
import { ChatModel } from '../models/chatModel';

@Injectable({
  providedIn: 'root',
})
export class ChatOperationServices {
  dialog = inject(MatDialog);
  chatService: ChatService = inject(ChatService);
  navigationService: RouteServices = inject(RouteServices);
  questionService: QuestionsService = inject(QuestionsService);

  createNewChat() {
    return this.dialog
      .open(TwoButtonDialog, {
        data: {
          title: 'Create new chat?',
          message: '',
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          showCancel: true,
        },
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.chatService.createNewChat()),
        switchMap(() => this.chatService.loadChat()),
        switchMap(() =>
          this.dialog
            .open(MessageDialogComponent, {
              data: {
                title: 'Success!',
                message: 'Created new chat!',
              },
            })
            .afterClosed(),
        ),

        switchMap(() =>
          this.chatService.allchats$.pipe(
            take(1),
            switchMap((chats) => {
              if (!chats?.length) return of([]);

              return forkJoin(chats.map((c) => this.chatService.getFirstMessageForChat(c.id)));
            }),
          ),
        ),
      );
  }

  swapChat(chatId: number) {
    return this.chatService.getChatHistory(chatId);
  }

  createNewQuestion(currentChatId: number) {
    const dialogRef = this.dialog.open(QuestionBuilderDialogComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.questionService.createNewQuestion(result, currentChatId).subscribe({
          next: (res) => {
            this.dialog.open(MessageDialogComponent, {
              data: {
                title: 'Success!',
                message: `Created new question!`,
              },
            });
          },
          error: (res) => {
            this.dialog.open(MessageDialogComponent, {
              data: {
                title: 'Failed!',
                message: `Couldn't create new question!`,
              },
            });
          },
        });
      }
    });
  }

  setCurrentChat() {
    return this.chatService.chat$.pipe(
      filter((chat): chat is ChatModel => chat !== null),
      take(1),
    );
  }

  setFirstMessages() {
    return this.chatService.allchats$.pipe(
      switchMap((chats) => {
        if (!chats) return of([]);

        return forkJoin(
          chats.map((chat) =>
            this.chatService
              .getFirstMessageForChat(chat.id)
              .pipe(catchError(() => of(new MessageModel(-1, chat.id, 'user', 'New Chat')))),
          ),
        );
      }),
    );
  }
}
