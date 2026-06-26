import { CommonModule } from '@angular/common';
import {
  afterNextRender,
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
  signal,
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

@Component({
  selector: 'app-side-bar',
  imports: [MatIcon, CommonModule],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar implements OnInit, AfterViewInit {
  chatOperationService: ChatOperationServices = inject(ChatOperationServices);
  navigationService: RouteServices = inject(RouteServices);
  @Output() onChangeChatEvent: EventEmitter<any> = new EventEmitter();
  @Output() onChangeChatEventChatId: EventEmitter<number> = new EventEmitter();

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
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

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
    const chats = this.chatOperationService.chatService.getAllChats;
    if (!chats) return;

    const baseChat = chats.find((c) => c.id === chatId);
    if (!baseChat) return;

    this.chatOperationService.chatService.setChat(baseChat);

    this.chatOperationService.swapChat(chatId)?.subscribe((messages) => {
      this.chatOperationService.chatService.getFirstMessageForChat(chatId).subscribe({
        next: (res) => {
          let updatedChat = {
            ...baseChat,
            messages: [...messages],
          };
          updatedChat.firstMessage = res;
          console.log('FIRST MESSAGE: ', res);
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
      });
    });
  }

  newChat() {
    this.chatOperationService.createNewChat().subscribe(() => {
      this.getNewChat(this.chatOperationService.chatService.getChat!.id);
    });
  }
  dialog = inject(MatDialog);

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
              newChats = newChats.filter((ch) => ch.id !== chatId);

              this.chatOperationService.chatService.setChats(newChats);

              this.chatOperationService.chatService.chat$.pipe(take(1)).subscribe({
                next: (currentChat) => {
                  if (!currentChat) return;

                  if (currentChat.id === chatId) {
                    console.log(currentChat.id === chatId);
                    this.getNewChat(chats[0].id, 0);
                  }
                  this.dialog.open(MessageDialogComponent, {
                    data: {
                      title: 'Success',
                      message: 'Chat has been deleted successfully!',
                    },
                  });
                },
              });
            },
          });
        }),
      )
      .subscribe({
        error: (err) => console.error(err),
      });
  }
}
