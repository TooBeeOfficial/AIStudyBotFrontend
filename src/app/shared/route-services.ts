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
  };

  router = inject(Router);

  navigateTo(route: string) {
    this.router.navigate([route]).then((success) => {
      console.log('Navigation success:', success);
    });
  }

  scrollToBottom(targetToScroll: ElementRef<HTMLDivElement>, behaviour: ScrollBehavior = 'auto') {
    targetToScroll.nativeElement.scrollIntoView({
      behavior: behaviour,
      block: 'center',
    });
  }
}
