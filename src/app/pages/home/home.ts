import {
  ChangeDetectorRef,
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
import { MatDialog } from '@angular/material/dialog';
import { MessageModel } from '../../models/chatMessageModel';
import { AIBotService } from '../../shared/services/aibot';
import { signal } from '@angular/core';
import { AIModel } from '../../models/aiModel';
import { FormsModule } from '@angular/forms';
import { RouteServices } from '../../shared/route-services';
import { ChatOperationServices } from '../../shared/chat-operation-services';
import { FileService } from '../../shared/file-service';
import { Navbar } from '../../shared/Components/navbar/navbar';
import { SideBar } from '../../shared/Components/side-bar/side-bar';
import { take } from 'rxjs';

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
  private chatItems!: QueryList<ElementRef<HTMLElement>>;

  @ViewChild('textarea')
  private chatTextArea!: ElementRef<HTMLDivElement>;

  constructor(private cdr: ChangeDetectorRef) {
    // Auto resize chat text area
    effect(() => {
      this.textContent();
      setTimeout(() => {
        if (this.chatTextArea.nativeElement) {
          this.chatTextArea.nativeElement.style.height = 'auto';
          this.chatTextArea.nativeElement.style.height =
            this.chatTextArea.nativeElement.scrollHeight + 'px';
        }
      });
    });
  }

  ngOnInit(): void {
    this.aiService.AIModels$.pipe().subscribe((models) => {
      this.models.set(models.map((m) => AIModel.fromApi(m)));
    });
    this.chatOperationService.chatService.chat$.subscribe({
      next: (currChat) => {
        setTimeout(() =>
          this.chatEnd.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          }),
        );
      },
    });
  }

  ngAfterViewInit() {}

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
          ...currentChat,
        };
        asNewChat.messages.push(mes);
        if (asNewChat.messages.length < 1) {
          asNewChat.firstMessage = mes;
        }
        this.chatOperationService.chatService.setChat(asNewChat);
        setTimeout(() => this.navigationService.scrollToBottom(this.chatEnd, 'smooth'));
        this.aiService
          .askAIBot(
            message,
            this.chatOperationService.chatService.getChat?.id!,
            this.selectedModel().id,
          )
          .pipe(take(1))
          .subscribe({
            next: (AIresponse) => {

              this.chatOperationService.chatService.allchats$.pipe(take(1)).subscribe({
                next: (chats) => {
                  if (!chats) return;

                  const newChatIndex = chats.findIndex((c) => c.id === currentChat.id);
                  const allchats = chats;
                  allchats[newChatIndex].messages.push(
                    new MessageModel(-1, currentChat.id, 'assistant', JSON.stringify(AIresponse)),
                  );

                  this.chatOperationService.chatService.setChats(allchats);
                  setTimeout(() => {
                    this.navigationService.scrollToBottom(this.chatEnd, 'smooth');
                  });
                },
              });
            },
          });
      },
    });
  }

  selectModel(model: any) {
    this.selectedModel.set(model);
    this.showModels = false;
  }
}
