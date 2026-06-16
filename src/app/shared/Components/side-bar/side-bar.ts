import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  AfterViewInit,
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
import { take } from 'rxjs';

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

  changeChatEvent() {
    this.onChangeChatEvent.emit();
  }

  @Input() menuOpen: boolean = true;

  @ViewChild('chatListEnd')
  private chatListEnd!: ElementRef<HTMLDivElement>;

  @ViewChildren('chatItem')
  chatItems!: QueryList<ElementRef<HTMLElement>>;

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
        this.getNewChat(chats[0].id, 0);
        setTimeout(() => {
          this.chatItems.get(0)?.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        });
      });
    });
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

          if (index !== -1) {
            this.scrollSelectedChatIntoView();
          } else {
            setTimeout(() => {
              this.navigationService.scrollToBottom(this.chatListEnd, 'auto');
            });
          }
          this.changeChatEvent();
        },
      });
    });
  }

  newChat() {
    this.chatOperationService.createNewChat().subscribe(() => {
      this.getNewChat(this.chatOperationService.chatService.getChat!.id);
    });
  }
}
