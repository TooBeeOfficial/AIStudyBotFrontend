import { inject, Injectable } from '@angular/core';
import { catchError, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { QuestionBuilderDialogComponent } from './dialogs/create-new-question/create-new-question';
import { MessageDialogComponent } from './dialogs/success-dialog/success-dialog';
import { TwoButtonDialog } from './dialogs/two-button-dialog/two-button-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from './services/chat';
import { RouteServices } from './route-services';
import { QuestionsService } from './services/questions';
import { QuestionModel } from '../models/questionModel';
import { QuizService } from './services/quiz';

@Injectable({
  providedIn: 'root',
})
export class ChatOperationServices {
  dialog = inject(MatDialog);
  chatService: ChatService = inject(ChatService);
  navigationService: RouteServices = inject(RouteServices);
  questionService: QuestionsService = inject(QuestionsService);
  quizService: QuizService = inject(QuizService);

  createNewChat(): Observable<number> {
    let newChatId: number = -1;

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
        tap((val) => console.log(val)),
        filter(Boolean),
        switchMap(() => this.chatService.createNewChat()),
        tap((result) => {
          newChatId = result.id;
        }),
        switchMap((result) => this.chatService.loadChats(result.id)),
        switchMap(() => this.chatService.getAllFirstMessages()),
        tap((firstMessages) => {
          let chats = this.chatService.getAllChats;
          if (chats && firstMessages) {
            chats.forEach((chat, index) => {
              chat.firstMessage = firstMessages[index];
              if (chat.id === newChatId) {
                this.chatService.setChat(chat);
              }
            });
            this.chatService.setChats(chats);
          }
        }),
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
        map(() => newChatId),
      );
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

  updateExistingQuestion(question: QuestionModel) {
    console.log('UPDATE', question);
    const dialogRef = this.dialog.open(QuestionBuilderDialogComponent, {
      data: question,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.id = question.id;
        this.questionService.updateQuestion(result).subscribe({
          next: (res) => {
            this.dialog.open(MessageDialogComponent, {
              data: {
                title: 'Success!',
                message: `Updated question!`,
              },
            });
          },
          error: (res) => {
            console.log(res);
            this.dialog.open(MessageDialogComponent, {
              data: {
                title: 'Failed!',
                message: `Couldn't update question!`,
              },
            });
          },
        });
      }
    });
  }

  deleteExistingQuestion(questionId: number, chatId: number) {
    this.dialog
      .open(TwoButtonDialog, {
        data: {
          title: 'Delete Question?',
          message: '',
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          showCancel: true,
        },
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.questionService.deleteQuestion(questionId)),
        switchMap(() => this.quizService.getQuizFromChat(chatId)),
        tap((quiz) => this.quizService.setQuiz(quiz)),
        switchMap(() =>
          this.dialog
            .open(MessageDialogComponent, {
              data: {
                title: 'Success!',
                message: 'Deleted question!',
              },
            })
            .afterClosed(),
        ),
      )
      .subscribe();
  }
}
