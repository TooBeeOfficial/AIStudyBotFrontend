import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Navbar } from '../../shared/Components/navbar/navbar';
import { RouteServices } from '../../shared/route-services';
import { MatIcon } from '@angular/material/icon';
import { SideBar } from '../../shared/Components/side-bar/side-bar';
import { ChatOperationServices } from '../../shared/chat-operation-services';
import { QuizService } from '../../shared/services/quiz';
import { take } from 'rxjs';
import { QuestionCard } from '../../shared/Components/question-card/question-card';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExportServices } from '../../shared/services/export-services';
import { QuestionModel } from '../../models/questionModel';
import { QuizModel } from '../../models/quizModel';
import { UserService } from '../../shared/services/user';

@Component({
  selector: 'app-quiz',
  imports: [Navbar, MatIcon, SideBar, QuestionCard, AsyncPipe, FormsModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit {
  chatOperationService: ChatOperationServices = inject(ChatOperationServices);
  navigationService: RouteServices = inject(RouteServices);
  quizService: QuizService = inject(QuizService);

  menuOpen: boolean = true;

  isMobile = signal(window.innerWidth < 1350);

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth < 1350);
  }

  ngOnInit(): void {
    if (this.isMobile()) {
      this.menuOpen = false;
    }
    this.chatOperationService.chatService.chat$.pipe(take(1)).subscribe({
      next: (currentChat) => {
        if (!currentChat) return;
        this.quizService.getQuizFromChat(currentChat.id).subscribe((res) => {
          this.quizService.setQuiz(res);
        });
      },
    });
  }

  home() {
    this.navigationService.navigateTo(RouteServices.routes.home);
  }

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
