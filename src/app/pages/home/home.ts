import {
  afterEveryRender,
  afterNextRender,
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
import { Navbar } from '../../shared/Components/navbar/navbar';
import { SideBar } from '../../shared/Components/side-bar/side-bar';

@Component({
  selector: 'app-home',
  imports: [MatIconModule, CommonModule, FormsModule, Navbar, SideBar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  userService: UserService = inject(UserService);
  navigationService: RouteServices = inject(RouteServices);
  aiService: AIBotService = inject(AIBotService);
  chatOperationService: ChatOperationServices = inject(ChatOperationServices);
  fileService: FileService = inject(FileService);

  selectedModel = signal<AIModel>(new AIModel());
  textContent = signal<string>('');
  models = signal<AIModel[]>([]);

  dialog = inject(MatDialog);

  isDragging: boolean = false;
  showModels: boolean = false;
  menuOpen: boolean = true;
  loadingFile: boolean = false;
  showProfileDropdown: boolean = true;

  @ViewChild('chatEnd')
  private chatEnd!: ElementRef<HTMLDivElement>;

  @ViewChildren('chatItem')
  chatItems!: QueryList<ElementRef<HTMLElement>>;

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
    this.chatOperationService.chatService.loadChat().subscribe({
      next: () => {
        setTimeout(() =>
          this.chatEnd.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          }),
        );
      },
    });
  }

  ngAfterViewInit() {
    setTimeout(() =>
      this.chatEnd.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      }),
    );
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

  scrolltoBottom() {
    setTimeout(() => this.navigationService.scrollToBottom(this.chatEnd, 'smooth'));
  }

  submitMessage() {
    const message = this.textContent();
    this.textContent.set('');
    this.chatOperationService.chatService.chat$.pipe(take(1)).subscribe({
      next: (currentChat) => {
        if (!currentChat) return;
        const mes = new MessageModel(-1, currentChat.id, 'user', message);
        const asNewChat = {
          ...currentChat
        }
        asNewChat.messages.push(mes);
        if (asNewChat.messages.length < 1) {
          asNewChat.firstMessage = mes;
        }

        setTimeout(() => this.chatOperationService.chatService.setChat(asNewChat),500);
        this.scrolltoBottom();
      },
    });
    this.aiService
      .askAIBot(
        message,
        this.chatOperationService.chatService.getChat?.id!,
        this.selectedModel().id,
      )
      .pipe(take(1))
      .subscribe({
        next: (AIresponse) => {
          console.log('AIresponse:', AIresponse);
          console.log('type:', typeof AIresponse);

          const baseChat = this.chatOperationService.chatService.getChat;
          if (!baseChat) return;

          baseChat.messages.push(
            new MessageModel(-1, baseChat.id, 'assistant', JSON.stringify(AIresponse)),
          );

          this.chatOperationService.chatService.setChat(baseChat);
          this.scrolltoBottom();
        },
      });
  }

  selectModel(model: any) {
    this.selectedModel.set(model);
    this.showModels = false;
  }
}
