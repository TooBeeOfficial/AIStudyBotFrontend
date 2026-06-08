import { Component, inject } from '@angular/core';
import { UserService } from '../shared/services/user';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ChatService } from '../shared/services/chat';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../shared/dialogs/success-dialog/success-dialog';
import { QuestionBuilderDialogComponent } from '../shared/dialogs/create-new-question/create-new-question';

@Component({
  selector: 'app-home',
  imports: [MatIconModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  userService: UserService = inject(UserService);
  chatService: ChatService = inject(ChatService);
  menuOpen: boolean = false;
  dialog = inject(MatDialog);
  constructor() {}

  get username() {
    return this.userService.user?.name;
  }

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }

  createNewChat() {
    this.chatService.createNewChat().subscribe((res) => {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Chat Created',
          message: 'Your new chat is ready!',
        },
      });
    });
  }

  createNewQuestion() {
    const dialogRef = this.dialog.open(QuestionBuilderDialogComponent, {
      data: {
        title: 'Add Quiz Question',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);

        // send to backend
        // this.chatService.saveQuestions(result).subscribe(...)
      }
    });
  }
}
