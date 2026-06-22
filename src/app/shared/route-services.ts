import { ElementRef, inject, Injectable, Service } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouteServices {
  static routes = {
    login: '/login',
    home: '/home',
    quiz: '/quizes',
    takeQuiz: '/takeQuiz',
  };

  router = inject(Router);

  navigateTo(route: string, data: any = "") {
    this.router
      .navigate([route], {
        state: {
          quiz: data,
        },
      })
      .then((success) => {
        console.log('Navigation success: ', route, success);
      });
  }

  scrollToBottomDiv(
    targetToScroll: ElementRef<HTMLDivElement>,
    behaviour: ScrollBehavior = 'auto',
  ) {
    targetToScroll.nativeElement.scrollIntoView({
      behavior: behaviour,
      block: 'center',
    });
  }
  scrollToBottom(targetToScroll: ElementRef<HTMLElement>, behaviour: ScrollBehavior = 'auto') {
    targetToScroll.nativeElement.scrollIntoView({
      behavior: behaviour,
      block: 'center',
    });
  }
}
