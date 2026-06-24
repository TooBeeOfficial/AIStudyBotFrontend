import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
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
  router = inject(Router);

  menuOpen: boolean = true;
  quizFormOpen: boolean = false;
  maxQuestions: number = 10;
  mode: string = 'end';

  @ViewChild('quizOptions') quizOpts!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.quizOpts) {
      return;
    }
    const clickedInside = event.target as Node;

    const clickedInsideButton = this.quizOpts.nativeElement.contains(clickedInside);

    if (!clickedInsideButton) {
      this.quizFormOpen = false;
    }
  }

  home() {
    this.navigationService.navigateTo(RouteServices.routes.home);
  }

  ngOnInit(): void {
    this.chatOperationService.chatService.chat$.pipe(take(1)).subscribe({
      next: (currentChat) => {
        if (!currentChat) return;

        this.quizService.getQuizFromChat(currentChat.id).subscribe((res) => {
          console.log(res);
          this.quizService.setQuiz(res);
        });
      },
    });
  }

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }

  swapNewQuiz(chatId: number) {
    this.chatOperationService.chatService.chat$.pipe(take(1)).subscribe({
      next: (currentChat) => {
        if (!currentChat) return;

        this.quizService
          .getQuizFromChat(chatId)
          .pipe(take(1))
          .subscribe((res) => {
            this.quizService.setQuiz(res);
          });
      },
    });
  }

  takeQuiz() {
    console.log('ROUTING');
    this.navigationService.navigateTo(RouteServices.routes.takeQuiz, {
      maxQuestions: this.maxQuestions,
      mode: this.mode,
    });
  }
}
