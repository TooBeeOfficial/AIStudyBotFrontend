import { Component, effect, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../shared/services/user';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ChatService } from '../shared/services/chat';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../shared/dialogs/success-dialog/success-dialog';
import { QuestionBuilderDialogComponent } from '../shared/dialogs/create-new-question/create-new-question';
import { QuestionsService } from '../shared/services/questions';
import { switchMap, forkJoin, map, of, catchError } from 'rxjs';
import { MessageModel } from '../models/chatMessageModel';
import { AIBotService } from '../shared/services/aibot';
import { signal } from '@angular/core';
import { AIModel } from '../models/aiModel';
import * as pdfjsLib from 'pdfjs-dist';
import { FormsModule } from '@angular/forms';

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.mjs';

@Component({
  selector: 'app-home',
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  userService: UserService = inject(UserService);
  chatService: ChatService = inject(ChatService);
  questionService: QuestionsService = inject(QuestionsService);
  aiService: AIBotService = inject(AIBotService);
  menuOpen: boolean = false;
  dialog = inject(MatDialog);
  showModels = false;
  selectedModel = signal<AIModel>(new AIModel());
  firstMessages = signal<MessageModel[]>([]);
  models = signal<AIModel[]>([]);
  isDragging = false;
  textContent = signal<string>('');

  selectModel(model: any) {
    this.selectedModel.set(model);
    this.showModels = false;
  }
  constructor() {
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

  submitMessage() {}

  ngOnInit(): void {
    this.aiService.AIModels$.subscribe((models) => {
      this.models.set(models.map((m) => AIModel.fromApi(m)));
    });

    this.chatService.allchats$
      .pipe(
        switchMap((chats) => {
          if (!chats) return of([]);

          return forkJoin(
            chats.map((chat) =>
              this.chatService
                .getFirstMessageFromUser(chat.id)
                .pipe(
                  catchError(() => of(new MessageModel(-1, chat.id, 'user', 'Write new Message'))),
                ),
            ),
          );
        }),
      )
      .subscribe({
        next: (messages: MessageModel[]) => {
          this.firstMessages.set(messages);
        },
      });
  }

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
        this.questionService.createNewQuestion(result, 62).subscribe({
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
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  readText(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      this.textContent.set(reader.result as string);
    };

    reader.readAsText(file);
  }

  async extractPdfText(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = content.items.map((item: any) => item.str).join(' ');

      fullText += pageText + '\n';
    }

    return fullText.trim();
  }

  handleFile(file: File) {
    const name = file.name.toLowerCase();
    const type = file.type;
    console.log(type);

    if (type === 'application/pdf' || name.endsWith('.pdf')) {
      this.extractPdfText(file).then((val) => {
        this.textContent.set(val);
      });

      return;
    }

    if (
      type.startsWith('text') ||
      name.endsWith('.txt') ||
      name.endsWith('.md') ||
      name.endsWith('.json') ||
      name.endsWith('.csv') ||
      name.endsWith('.html') ||
      name.endsWith('.css') ||
      name.endsWith('.js') ||
      name.endsWith('.ts')
    ) {
      this.readText(file);
      return;
    }
    this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Failed!',
        message: `Unsupported file type: ${file.type}. \nSupported file types: .txt, .md, .json, .csv, .pdf.`,
      },
    });
  }
}
