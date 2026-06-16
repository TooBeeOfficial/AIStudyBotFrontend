import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user';
import { Navbar } from '../../shared/Components/navbar/navbar';
import { RouteServices } from '../../shared/route-services';
import { MatIcon } from '@angular/material/icon';
import { SideBar } from '../../shared/Components/side-bar/side-bar';
import { ChatOperationServices } from '../../shared/chat-operation-services';
import { QuizService } from '../../shared/services/quiz';
import { Subject, take } from 'rxjs';
import { QuestionCard } from "../../shared/Components/question-card/question-card";

@Component({
  selector: 'app-quiz',
  imports: [Navbar, MatIcon, SideBar, QuestionCard],
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
        console.log(currentChat);
        if (!currentChat) return;
        this.quizService.getQuizFromChat(currentChat.id).subscribe((res) => {
          console.log('QUIZ: ', res);
        });
      },
    });
  }

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
