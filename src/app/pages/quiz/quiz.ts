import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Navbar } from '../../shared/Components/navbar/navbar';
import { RouteServices } from '../../shared/route-services';
import { MatIcon } from '@angular/material/icon';
import { SideBar } from '../../shared/Components/side-bar/side-bar';
import { ChatOperationServices } from '../../shared/chat-operation-services';
import { QuizService } from '../../shared/services/quiz';
import { take } from 'rxjs';
import { QuestionCard } from '../../shared/Components/question-card/question-card';

@Component({
  selector: 'app-quiz',
  imports: [Navbar, MatIcon, SideBar, QuestionCard, AsyncPipe],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit {
  chatOperationService: ChatOperationServices = inject(ChatOperationServices);
  navigationService: RouteServices = inject(RouteServices);
  quizService: QuizService = inject(QuizService);

  menuOpen: boolean = true;

  home() {
    this.navigationService.navigateTo(RouteServices.routes.home);
  }

  ngOnInit(): void {
    this.chatOperationService.chatService.chat$.pipe(take(1)).subscribe({
      next: (currentChat) => {
        if (!currentChat) return;
        this.quizService
          .getQuizFromChat(currentChat.id)
          .subscribe((res) => {
            console.log(res)
            this.quizService.setQuiz(res);
            this.quizService.quiz$.subscribe((quizes) => {
              console.log(quizes?.quiz);
            });
          });
      },
    });
  }

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
