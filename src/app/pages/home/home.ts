import {
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { UserService } from '../../shared/services/user';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../shared/services/chat';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../shared/dialogs/success-dialog/success-dialog';
import { QuestionBuilderDialogComponent } from '../../shared/dialogs/create-new-question/create-new-question';
import { QuestionsService } from '../../shared/services/questions';
import { switchMap, forkJoin, map, of, catchError, filter, take } from 'rxjs';
import { MessageModel } from '../../models/chatMessageModel';
import { AIBotService } from '../../shared/services/aibot';
import { signal } from '@angular/core';
import { AIModel } from '../../models/aiModel';
import { FormsModule } from '@angular/forms';
import { TwoButtonDialog } from '../../shared/dialogs/two-button-dialog/two-button-dialog';
import { ChatModel } from '../../models/chatModel';
import { Router } from '@angular/router';
import { RouteServices } from '../../shared/route-services';
import { ChatOperationServices } from '../../shared/chat-operation-services';
import { FileService } from '../../shared/file-service';
import { Navbar } from '../components/navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [MatIconModule, CommonModule, FormsModule, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  userService: UserService = inject(UserService);
  navigationService: RouteServices = inject(RouteServices);
  aiService: AIBotService = inject(AIBotService);
  chatOperationService: ChatOperationServices = inject(ChatOperationServices);
  fileService: FileService = inject(FileService);

  currentChat = signal<ChatModel>(new ChatModel());
  selectedModel = signal<AIModel>(new AIModel());
  firstMessages = signal<MessageModel[]>([]);
  textContent = signal<string>('');
  models = signal<AIModel[]>([]);

  dialog = inject(MatDialog);

  isDragging: boolean = false;
  showModels: boolean = false;
  menuOpen: boolean = false;
  loadingFile: boolean = false;
  showProfileDropdown: boolean = true;

  @ViewChild('chatEnd')
  private chatEnd!: ElementRef<HTMLDivElement>;

  @ViewChild('chatListEnd')
  private chatListEnd!: ElementRef<HTMLDivElement>;

  constructor() {
    // Auto resize chat text area
    effect(() => {
      this.textContent();

      setTimeout(() => {
        const el = document.querySelector('textarea') as HTMLTextAreaElement;
        if (el) {
          el.style.height = 'auto';
          el.style.height = el.scrollHeight + 'px';
        }
      });
    });
  }

  ngOnInit(): void {
    this.aiService.AIModels$.subscribe((models) => {
      this.models.set(models.map((m) => AIModel.fromApi(m)));
    });
    this.chatOperationService.setCurrentChat().subscribe((chat) => {
      this.currentChat.set(chat);
    });
    this.chatOperationService.setFirstMessages().subscribe((values: MessageModel[]) => {
      this.firstMessages.set(values);
    });
  }
  ngAfterViewInit() {
    setTimeout(() => this.navigationService.scrollToBottom(this.chatEnd, 'smooth'));
  }
  get username() {
    return this.userService.user?.name;
  }

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave() {
    this.isDragging = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.textContent.set('');
      this.loadingFile = true;
      this.fileService.handleFile(files[0]).then((extractedText) => {
        this.textContent.set(extractedText);
        this.loadingFile = false;
      });
    }
  }
  @ViewChildren('chatItem')
  chatItems!: QueryList<ElementRef<HTMLElement>>;

  scrollSelectedChatIntoView() {
    const index = this.firstMessages().findIndex((m) => m.chat_id === this.currentChat().id);

    if (index >= 0) {
      this.chatItems.get(index)?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.textContent.set('');
      this.loadingFile = true;
      this.fileService.handleFile(input.files[0]).then((extractedText) => {
        this.textContent.set(extractedText);
        this.loadingFile = false;
      });
    }
  }

  myQuizes() {
    this.navigationService.navigateTo(RouteServices.routes.quiz);
  }

  logoutUser() {
    this.userService.logout().subscribe({
      next: () => {
        this.navigationService.navigateTo('/login');
      },
    });
  }

  submitMessage() {
    const message = this.textContent();
    this.textContent.set('');

    this.currentChat.update((chat) => {
      const messages = chat.messages.slice();

      messages.push(new MessageModel(-1, chat.id, 'user', message));
      chat.messages = messages;

      return chat;
    });
    setTimeout(() => this.navigationService.scrollToBottom(this.chatEnd, 'smooth'));

    this.aiService.askAIBot(message, this.currentChat().id, this.selectedModel().id).subscribe({
      next: async () => {
        await new Promise((r) => setTimeout(r, 1000));
        const chats = this.chatOperationService.chatService.allChats;
        if (!chats) return;

        const baseChat = chats.find((c) => c.id === this.currentChat().id);
        if (!baseChat) return;

        this.getNewChat(this.currentChat().id);
      },
    });
  }

  selectModel(model: any) {
    this.selectedModel.set(model);
    this.showModels = false;
  }

  getNewChat(chatId: number, index: number = -1) {
    const chats = this.chatOperationService.chatService.allChats;
    if (!chats) return;

    const baseChat = chats.find((c) => c.id === chatId);
    if (!baseChat) return;

    this.chatOperationService.swapChat(chatId)?.subscribe((messages) => {
      const updatedChat = baseChat;
      updatedChat.messages = [...messages];

      this.chatOperationService.chatService.setChat(updatedChat);
      this.currentChat.set(updatedChat);
      setTimeout(() => this.navigationService.scrollToBottom(this.chatEnd, 'smooth'));
      if (index !== -1) {
        setTimeout(() => {
          this.chatItems.get(index)?.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        });
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
