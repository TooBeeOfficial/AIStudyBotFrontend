import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ChatOperationServices } from '../../chat-operation-services';
import { ChatModel } from '../../../models/chatModel';
import { MessageModel } from '../../../models/chatMessageModel';
import { RouteServices } from '../../route-services';
import { filter, switchMap, take, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TwoButtonDialog } from '../../dialogs/two-button-dialog/two-button-dialog';
import { MessageDialogComponent } from '../../dialogs/success-dialog/success-dialog';
import { QuizService } from '../../services/quiz';

@Component({
  selector: 'app-side-bar',
  imports: [MatIcon, CommonModule],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar implements OnInit, AfterViewInit {
  chatOperationService: ChatOperationServices = inject(ChatOperationServices);
  navigationService: RouteServices = inject(RouteServices);
  quizService: QuizService = inject(QuizService);
  dialog: MatDialog = inject(MatDialog);

  @Output() onChangeChatEventChatId: EventEmitter<number> = new EventEmitter();
  @Output() onChangeChatEvent: EventEmitter<any> = new EventEmitter();

  changeChatEvent() {
    this.onChangeChatEvent.emit();
  }
  changeChatEventChatID(chatId: number) {
    this.onChangeChatEventChatId.emit(chatId);
  }

  @Input() menuOpen: boolean = true;

  @ViewChild('chatListEnd')
  private chatListEnd!: ElementRef<HTMLDivElement>;

  @ViewChildren('chatItem')
  chatItems!: QueryList<ElementRef<HTMLElement>>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.chatOperationService.chatService
      .loadChats()
      .pipe(
        switchMap((chats) =>
          this.chatOperationService.chatService.getAllFirstMessages().pipe(
            tap((allChatsFirstMessages) => {
              chats.forEach((chat) => {
                for (let index = 0; index < allChatsFirstMessages.length; index++) {
                  if (chat.id === allChatsFirstMessages[index].chat_id) {
                    chat.firstMessage = allChatsFirstMessages[index];
                  }
                }
              });
              this.chatOperationService.chatService.setChats(chats);

              this.getNewChat(chats[0].id);
            }),
          ),
        ),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {}

  scrollSelectedChatIntoView() {
    const index = this.chatOperationService.chatService.getAllChats?.findIndex(
      (m) => m.id === this.chatOperationService.chatService.getChat?.id!,
    );

    if (index && index >= 0) {
      setTimeout(() => {
        this.chatItems.get(index)?.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      });
    }
  }

  getNewChat(chatId: number, index: number = -1) {
    const currChats = this.chatOperationService.chatService.getAllChats;
    if (!currChats) return;

    const chatToSwap = currChats.find((c) => c.id === chatId);
    if (!chatToSwap) return;
    let messagesToSwap: MessageModel[];
    this.chatOperationService.chatService
      .getChatHistory(chatId)
      .pipe(
        tap((messages) => {
          messagesToSwap = messages;
        }),
        switchMap(() => this.chatOperationService.chatService.getFirstMessageForChat(chatId)),
      )
      .subscribe({
        next: (firstMessage) => {
          this.chatOperationService.chatService.setChat(chatToSwap);

          let updatedChat = {
            ...chatToSwap,
            messages: messagesToSwap,
            firstMessage: firstMessage,
          };

          this.chatOperationService.chatService.setChat(updatedChat);
          if (index === -1) {
            setTimeout(() => {
              this.navigationService.scrollToBottom(
                this.chatItems.get(0) ?? this.chatListEnd,
                'smooth',
              );
            });
          } else if (index >= 0) {
            setTimeout(() => {
              this.navigationService.scrollToBottom(this.chatItems.get(index)!, 'smooth');
            });
          }
          this.changeChatEvent();
          this.changeChatEventChatID(updatedChat.id);
        },
        error: (err) => console.error('getNewChat failed:', err),
      });
  }

  newChat() {
    console.log('Creating new chat');
    this.chatOperationService
      .createNewChat()
      .pipe(
        tap((chatId) => {
          if (chatId) this.getNewChat(chatId);
        }),
      )
      .subscribe({
        next: () => console.log('Created!'),
        error: () => {
          console.log('fail!');
        },
      });
  }

  createNewQuestionFromDialog() {
    this.chatOperationService.chatService.chat$
      .pipe(
        tap((currChat) => {
          if (currChat) this.chatOperationService.createNewQuestion(currChat.id);
        }),
      )
      .subscribe();
  }

  deleteChat(chatId: number, index: number) {
    const dialogRef = this.dialog.open(TwoButtonDialog, {
      data: {
        title: 'Delete chat?',
        message: 'This can not be undone.',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        showCancel: true,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.chatOperationService.chatService.deleteChat(chatId)),
        tap(() => {
          this.chatOperationService.chatService.allchats$.pipe(take(1)).subscribe({
            next: (chats) => {
              if (!chats) return;
              let newChats = chats;
              if (chats.length <= 1) {
                newChats = [];
              } else {
                newChats = newChats.filter((ch) => ch.id !== chatId);
              }

              this.chatOperationService.chatService.setChats(newChats);

              this.chatOperationService.chatService.chat$.pipe(take(1)).subscribe({
                next: (currentChat) => {
                  if (!currentChat) return;
                  if (chats.length <= 1) {
                    this.chatOperationService.chatService.setChat(new ChatModel());
                  } else if (currentChat.id === chatId) {
                    this.getNewChat(chats[0].id, 0);
                  }
                },
              });
            },
          });
        }),
      )
      .subscribe({
        next: () => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              title: 'Success',
              message: 'Chat has been deleted successfully!',
            },
          });
        },
        error: (err) => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              title: 'Error',
              message: 'Chat couldn`t be deleted!',
            },
          });
        },
      });
  }
}
