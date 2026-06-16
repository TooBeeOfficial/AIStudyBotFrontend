import { CommonModule } from '@angular/common';
import {
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

@Component({
  selector: 'app-side-bar',
  imports: [MatIcon, CommonModule],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar implements OnInit {
  chatOperationService: ChatOperationServices = inject(ChatOperationServices);
  navigationService: RouteServices = inject(RouteServices);
  firstMessages = signal<MessageModel[]>([]);

  @Input() menuOpen: boolean = true;

  @ViewChild('chatListEnd')
  private chatListEnd!: ElementRef<HTMLDivElement>;

  @ViewChildren('chatItem')
  chatItems!: QueryList<ElementRef<HTMLElement>>;

  ngOnInit(): void {
    this.chatOperationService.setFirstMessages().subscribe((values: MessageModel[]) => {
      this.firstMessages.set(values);
      this.scrollSelectedChatIntoView();
    });
  }

  scrollSelectedChatIntoView() {
    const index = this.firstMessages().findIndex(
      (m) => m.chat_id === this.chatOperationService.chatService.chat?.id!,
    );

    if (index >= 0) {
      setTimeout(() => {
        this.chatItems.get(index)?.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      });
    }
  }

  getNewChat(chatId: number, index: number = -1) {
    const chats = this.chatOperationService.chatService.allChats;
    if (!chats) return;

    const baseChat = chats.find((c) => c.id === chatId);
    if (!baseChat) return;

    this.chatOperationService.swapChat(chatId)?.subscribe((messages) => {
      const updatedChat = {
        ...baseChat,
        messages: [...messages],
      };

      this.chatOperationService.chatService.setChat(updatedChat);
      if (index !== -1) {
        this.scrollSelectedChatIntoView();
      } else {
        setTimeout(() => {
          this.navigationService.scrollToBottom(this.chatListEnd, 'auto');
        });
      }
    });
  }

  newChat() {
    this.chatOperationService.createNewChat().subscribe(() => {
      this.getNewChat(this.chatOperationService.chatService.chat!.id);
    });
  }
}
